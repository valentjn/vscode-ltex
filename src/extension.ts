'use strict';

import * as ChildProcess from 'child_process';
import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';
import * as extractZip from 'extract-zip';
import * as Fs from 'fs';
import * as Http from 'http';
import * as Https from 'https';
import * as Path from 'path';
import * as Rimraf from 'rimraf';
import * as SemVer from 'semver';
import * as Tar from 'tar';
import * as Url from 'url';

let clientOutputChannel: Code.OutputChannel;
let serverOutputChannel: Code.OutputChannel;
const ltexVersion = Code.extensions.getExtension('valentjn.vscode-ltex').packageJSON.version;

function log(message: string, type: string = "Info") {
  const timestamp: string = (new Date()).toISOString();
  clientOutputChannel.appendLine(`${timestamp} ${type}: ${message}`);
}

function error(line: string, e?: Error) {
  log(line, "Error");

  if (e != null) {
    log("Error name: " + e.name, "Error");
    log("Error message: " + e.message, "Error");
    log("Error stack: " + e.stack, "Error");
  }
}

async function setConfigurationSetting(settingName: string, settingValue: any,
      resourceConfig: Code.WorkspaceConfiguration, commandName: string): Promise<void> {
  const configurationTargetString: string =
      resourceConfig.get(`configurationTarget.${commandName}`);
  let configurationTargets: Code.ConfigurationTarget[];

  if (configurationTargetString === 'global') {
    configurationTargets = [Code.ConfigurationTarget.Global];
  } else if (configurationTargetString === 'workspace') {
    configurationTargets = [Code.ConfigurationTarget.Workspace,
        Code.ConfigurationTarget.Global];
  } else if (configurationTargetString === 'workspaceFolder') {
    configurationTargets = [Code.ConfigurationTarget.WorkspaceFolder,
        Code.ConfigurationTarget.Workspace, Code.ConfigurationTarget.Global];
  }

  for (const configurationTarget of configurationTargets) {
    try {
      await resourceConfig.update(settingName, settingValue, configurationTarget);
      return;
    } catch (e) {
      if (configurationTarget == configurationTargets[configurationTargets.length - 1]) {
        log(`Could not set configuration '${settingName}'.`);
        throw e;
      }
    }
  }
}

function convertToStringArray(obj: any): string[] {
  return (Array.isArray(obj) ? obj : [obj]);
}

function parseUrl(urlStr: string): Https.RequestOptions {
  const url: Url.UrlWithStringQuery = Url.parse(urlStr);
  return {
        hostname: url.hostname,
        path: url.pathname + ((url.query != null) ? `?${url.query}` : ''),
        headers: {'User-Agent': 'vscode-ltex'},
      };
}

async function doJsonRequest(urlStr: string): Promise<any> {
  return new Promise((resolve, reject) => {
    Https.get(parseUrl(urlStr), (response) => {
      const contentType: string = response.headers['content-type'];
      let error: Error;

      if (response.statusCode !== 200) {
        error = new Error(`Request failed with status code ${response.statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(`Request failed with content type ${contentType}`);
      }

      if (error) {
        response.resume();
        reject(error);
        return;
      }

      response.setEncoding('utf8');
      let rawData = '';
      response.on('data', (chunk) => { rawData += chunk; });
      response.on('end', () => {
        try {
          const jsonData: any = JSON.parse(rawData);
          resolve(jsonData);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

class CodeProgress {
  private taskProgressStack: number[];
  private taskSizeStack: number[];
  private taskNameStack: string[];
  private progressInterface: Code.Progress<{increment?: number, message?: string}>;
  private progressOnLastUpdate: number;

  public constructor(name: string,
        progressInterface: Code.Progress<{increment?: number, message?: string}>) {
    this.taskProgressStack = [0];
    this.taskSizeStack = [1];
    this.taskNameStack = [name];
    this.progressInterface = progressInterface;
    this.progressOnLastUpdate = 0;
  }

  public startTask(size: number, name: string) {
    this.taskProgressStack.push(0);
    this.taskSizeStack.push(size);
    this.taskNameStack.push(name);
    this.showProgress();
  }

  public updateTask(progress: number, name?: string) {
    const n: number = this.taskProgressStack.length;
    this.taskProgressStack[n - 1] = progress;
    if (name != null) this.taskNameStack[n - 1] = name;
    this.showProgress();
  }

  public finishTask() {
    const n: number = this.taskProgressStack.length - 1;
    if (n == 0) throw Error("Could not finish task, task stack already empty.");
    this.taskProgressStack.pop();
    this.taskProgressStack[n - 1] += this.taskSizeStack.pop();
    this.taskNameStack.pop();
    this.showProgress();
  }

  public getTaskName(): string {
    const n: number = this.taskProgressStack.length;
    return this.taskNameStack[n - 1];
  }

  public showProgress() {
    const n: number = this.taskProgressStack.length;
    let currentProgress: number = 0;
    let currentSize: number = 1;

    for (let i: number = 0; i < n; i++) {
      currentSize *= this.taskSizeStack[i];
      currentProgress += currentSize * this.taskProgressStack[i];
    }

    const progressIncrement: number = 100 * currentProgress - this.progressOnLastUpdate;
    const currentName: string = this.taskNameStack[n - 1];
    this.progressInterface.report({increment: progressIncrement, message: currentName});
    this.progressOnLastUpdate = 100 * currentProgress;
  }
}

async function downloadFile(urlStr: string, path: string, codeProgress: CodeProgress):
      Promise<void> {
  let file: Fs.WriteStream = Fs.createWriteStream(path);
  const origTaskName = codeProgress.getTaskName();

  return new Promise((resolve, reject) => {
    Https.get(parseUrl(urlStr), (response: Http.IncomingMessage) => {
      if ((response.statusCode === 301) || (response.statusCode === 302) ||
            (response.statusCode === 307)) {
        log(`Redirected to '${response.headers.location}'...`);
        downloadFile(response.headers.location, path, codeProgress).then(resolve).catch(reject);
        return;
      } else if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Request failed with status code ${response.statusCode}.`));
        return;
      }

      const fileSize: number = parseInt(response.headers['content-length']);
      const fileSizeMb: number = Math.round(fileSize / 1e6);
      let downloadedSize: number = 0;
      let downloadedSizeMb: number = 0;
      response.pipe(file);

      response.on('data', (chunk: any) => {
        downloadedSize += chunk.length;
        const newDownloadedMb: number = Math.round(downloadedSize / 1e6);

        if (newDownloadedMb != downloadedSizeMb) {
          downloadedSizeMb = newDownloadedMb;
          const taskName: string = `${origTaskName} ${downloadedSizeMb}MB/${fileSizeMb}MB`;
          codeProgress.updateTask(downloadedSize / fileSize, taskName);
        }
      });

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (e) => {
      Fs.unlinkSync(path);
      reject(e);
    });
  });
}

function getLatestCompatibleLtexLsVersion(versions: string[]): string {
  let latestVersion: string = null;

  versions.forEach((version: string) => {
    if (SemVer.valid(version) && SemVer.lte(version, ltexVersion) &&
          ((latestVersion == null) || SemVer.gt(version, latestVersion))) {
      latestVersion = version;
    }
  });

  return latestVersion;
}

async function installDependency(context: Code.ExtensionContext, urlStr: string,
      name: string, codeProgress: CodeProgress): Promise<void> {
  codeProgress.startTask(0.1, `Downloading ${name}...`);
  const url: Url.UrlWithStringQuery = Url.parse(urlStr);
  const archiveName: string = Path.basename(url.pathname);
  const archiveType: string = ((Path.extname(archiveName) == '.zip') ? 'zip' : 'tar.gz');
  const tmpDirPath: string = Fs.mkdtempSync(Path.join(context.extensionPath, 'tmp-'));
  const archivePath = Path.join(tmpDirPath, archiveName);
  codeProgress.finishTask();

  try {
    codeProgress.startTask(0.6, `Downloading ${name}...`);
    log(`Downloading ${name} from '${urlStr}' to '${archivePath}'...`);
    await downloadFile(urlStr, archivePath, codeProgress);
    codeProgress.finishTask();

    codeProgress.startTask(0.3, `Extracting ${name}...`);
    log(`Extracting ${name} archive to '${tmpDirPath}'...`);

    if (archiveType == 'zip') {
      await extractZip(archivePath, {dir: tmpDirPath});
    } else {
      await Tar.extract({file: archivePath, cwd: tmpDirPath});
    }

    codeProgress.updateTask(0.8);

    const fileNames: string[] = Fs.readdirSync(tmpDirPath);
    let extractedDirPath: string;

    for (let i: number = 0; i < fileNames.length; i++) {
      const filePath: string = Path.join(tmpDirPath, fileNames[i]);

      if (Fs.lstatSync(filePath).isDirectory()) {
        extractedDirPath = filePath;
        break;
      }
    }

    codeProgress.updateTask(0.85);

    const targetDirPath: string = Path.join(
        context.extensionPath, 'lib', Path.basename(extractedDirPath));
    const targetExists: boolean = Fs.existsSync(targetDirPath);
    codeProgress.updateTask(0.9);

    if (targetExists) {
      log(`Did not move '${extractedDirPath}' to '${targetDirPath}', as target already exists.`);
    } else {
      log(`Moving '${extractedDirPath}' to '${targetDirPath}'...`);
      Fs.renameSync(extractedDirPath, targetDirPath);
    }

    codeProgress.finishTask();

    return Promise.resolve();
  } finally {
    log(`Removing temporary directory '${tmpDirPath}'...`);
    Rimraf.sync(tmpDirPath);
  }
}

async function installLtexLs(context: Code.ExtensionContext): Promise<void> {
  const progressOptions: Code.ProgressOptions = {
        title: 'LTeX',
        location: Code.ProgressLocation.Notification,
        cancellable: false,
      };

  return Code.window.withProgress(progressOptions,
        async (progress: Code.Progress<{increment?: number, message?: string}>,
          token: Code.CancellationToken): Promise<void> => {
    const codeProgress: CodeProgress = new CodeProgress(
        'Downloading and extracting ltex-ls', progress);

    codeProgress.startTask(0.1, 'Preparing download of ltex-ls...');
    const jsonUrl: string = 'https://api.github.com/repos/valentjn/ltex-ls/releases';
    log(`Fetching list of ltex-ls releases from '${jsonUrl}'...`);
    const jsonData: any = await doJsonRequest(jsonUrl);

    let ltexLsVersions: string[] = [];

    jsonData.forEach((release: any) => {
      ltexLsVersions.push(release.tag_name);
    });

    const ltexLsVersion: string = getLatestCompatibleLtexLsVersion(ltexLsVersions);
    log(`Latest compatible release is 'ltex-ls-${ltexLsVersion}'.`);
    const ltexLsUrl: string = 'https://github.com/valentjn/ltex-ls/releases/download/' +
        `${ltexLsVersion}/ltex-ls-${ltexLsVersion}.tar.gz`;

    codeProgress.finishTask();

    codeProgress.startTask(0.9, 'Downloading and extracting ltex-ls...');
    await installDependency(context, ltexLsUrl, 'ltex-ls', codeProgress);
    codeProgress.finishTask();
  });
}

async function installJava(context: Code.ExtensionContext): Promise<void> {
  const progressOptions: Code.ProgressOptions = {
        title: 'LTeX',
        location: Code.ProgressLocation.Notification,
        cancellable: false,
      };

  return Code.window.withProgress(progressOptions,
      async (progress: Code.Progress<{increment?: number, message?: string}>,
        token: Code.CancellationToken): Promise<void> => {
    const codeProgress: CodeProgress = new CodeProgress(
        'Downloading and extracting Java', progress);

    let platform: string = 'linux';
    let arch: string = 'x64';
    let javaArchiveType: string = 'tar.gz';

    if (process.platform == 'win32') {
      platform = 'windows';
      javaArchiveType = 'zip';
    } else if (process.platform == 'darwin') {
      platform = 'mac';
    }

    if (process.arch == 'ia32') {
      arch = 'x86-32';
    } else if (process.arch == 'arm') {
      arch = 'arm';
    } else if (process.arch == 'arm64') {
      arch = 'aarch64';
    } else if (process.arch == 'ppc64') {
      arch = 'ppc64';
    } else if (process.arch == 's390x') {
      arch = 's390x';
    }

    const javaArchiveName: string =
        `OpenJDK11U-jre_${arch}_${platform}_hotspot_11.0.7_10.${javaArchiveType}`;
    log(`Guessed AdoptOpenJDK archive name '${javaArchiveName}' from your platform and ` +
        'architecture (may not exist).');
    const javaUrl: string = 'https://github.com/AdoptOpenJDK/openjdk11-binaries/releases/' +
        `download/jdk-11.0.7%2B10/${javaArchiveName}`;

    await installDependency(context, javaUrl, 'Java', codeProgress);
  });
}

function searchBundledLtexLs(libDirPath: string): string {
  const names: string[] = Fs.readdirSync(libDirPath);
  let ltexLsVersions: string[] = [];

  names.forEach((name) => {
    if (name.startsWith('ltex-ls-')) {
      ltexLsVersions.push(name.substr(8));
    }
  });

  const ltexLsVersion: string = getLatestCompatibleLtexLsVersion(ltexLsVersions);
  return ((ltexLsVersion != null) ? Path.join(libDirPath, `ltex-ls-${ltexLsVersion}`) : null);
}

function searchBundledJava(libDirPath: string): string {
  const javaPath: string = Path.join(libDirPath, 'jdk-11.0.7+10-jre');

  if (Fs.existsSync(javaPath)) {
    if (process.platform == 'darwin') {
      return Path.join(javaPath, 'Contents', 'Home');
    } else {
      return javaPath;
    }
  } else {
    return null;
  }
}

function getRenamedSetting(workspaceConfig: Code.WorkspaceConfiguration,
      newName: string, oldName: string) {
  const oldValue: any = workspaceConfig.get(oldName);
  return ((oldValue != null) ? oldValue : workspaceConfig.get(newName));
}

class Dependencies {
  public ltexLs: string;
  public java: string;
}

async function installDependencies(context: Code.ExtensionContext, clean: boolean = false):
      Promise<Dependencies> {
  try {
    let dependencies: Dependencies = new Dependencies();
    const libDirPath: string = Path.join(context.extensionPath, 'lib');
    const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');

    if (clean) {
      log(`Cleaning '${libDirPath}'...`);
      Rimraf.sync(libDirPath);
      Fs.mkdirSync(libDirPath);
      Fs.writeFileSync(Path.join(libDirPath, '.keep'), '\n');
    }

    // try 0: only use ltex.ltexLs.path (don't use lib/, don't download)
    // try 1: use ltex.ltexLs.path or lib/ (don't download)
    // try 2: use ltex.ltexLs.path or lib/ or download
    for (let i: number = 0; i < 3; i++) {
      log('');
      dependencies.ltexLs = workspaceConfig.get('ltex-ls.path');

      if (dependencies.ltexLs != null) {
        log(`ltex.ltex-ls.path set to ${dependencies.ltexLs}.`);
      } else if (i == 0) {
        log(`ltex.ltex-ls.path not set.`);
        continue;
      } else {
        log(`Searching for ltex-ls in '${libDirPath}'...`);
        dependencies.ltexLs = searchBundledLtexLs(libDirPath);

        if (dependencies.ltexLs != null) {
          log(`ltex-ls found in '${dependencies.ltexLs}'.`);
        } else {
          log(`Could not find compatible version of ltex-ls in '${libDirPath}'.`);

          if (i <= 1) {
            continue;
          } else {
            log('Initiating download of ltex-ls...');
            await installLtexLs(context);
            dependencies.ltexLs = searchBundledLtexLs(libDirPath);

            if (dependencies.ltexLs != null) {
              log(`ltex-ls found in '${dependencies.ltexLs}'.`);
            } else {
              log('Download or extraction of ltex-ls failed.');
              continue;
            }
          }
        }
      }
    }

    if (dependencies.ltexLs == null) {
      if (!clean) {
        return await installDependencies(context, true);
      } else {
        throw Error('Could not find/download/extract ltex-ls.');
      }
    }

    // try 0: only use ltex.java.path (don't use lib/, don't download)
    // try 1: use ltex.java.path or lib/ (don't download)
    // try 2: use ltex.java.path or lib/ or download
    for (let i: number = 0; i < 3; i++) {
      log('');
      dependencies.java = getRenamedSetting(workspaceConfig, 'java.path', 'javaHome');

      if (dependencies.java != null) {
        log(`ltex.java.path set to '${dependencies.java}'.`);
      } else if (i == 0) {
        log(`ltex.java.path not set.`);
      } else {
        log(`Searching for bundled Java in '${libDirPath}'.`);
        dependencies.java = searchBundledJava(libDirPath);

        if (dependencies.java != null) {
          log(`Bundled Java found in '${dependencies.java}'.`);
        } else {
          log(`Could not find bundled Java in '${libDirPath}'.`);

          if (i <= 1) {
            continue;
          } else {
            await installJava(context);
            dependencies.java = searchBundledJava(libDirPath);

            if (dependencies.java == null) {
              log('Download or extraction of Java failed. ' +
                  'Trying to run Java via PATH or JAVA_HOME.');
            }
          }
        }
      }

      log(`Using ltex-ls from '${dependencies.ltexLs}'.`);

      if (dependencies.java != null) {
        log(`Using Java from '${dependencies.java}'.`);
      } else {
        log('Using Java from PATH or JAVA_HOME (may fail if not installed).');
      }

      if (await testDependencies(dependencies)) {
        log('');
        return dependencies;
      }
    }

    if (!clean) {
      return await installDependencies(context, true);
    } else {
      throw Error('Could not run ltex-ls.');
    }
  } catch (e) {
    error('The installation of ltex-ls and/or Java failed!', e);
    log('You might want to try offline installation, ' +
        'see https://github.com/valentjn/vscode-ltex#offline-installation.');
  }
}

async function testDependencies(dependencies: Dependencies): Promise<boolean> {
  const executable: CodeLanguageClient.Executable = await getLtexLsExecutable(dependencies);
  executable.args.push("--test");
  const executableOptions: any = executable.options;
  executableOptions.timeout = 10000;

  log('Testing ltex-ls...');
  logExecutable(executable);
  const process: any = ChildProcess.spawnSync(
      executable.command, executable.args, executableOptions);

  const success: boolean = (process.status == 42);
  log(success ? 'Test successful!' : 'Test failed.');

  return success;
}

async function getLtexLsExecutable(dependencies: Dependencies):
      Promise<CodeLanguageClient.Executable> {
  let env: NodeJS.ProcessEnv = {};

  for (let name in process.env) {
    env[name] = process.env[name];
  }

  if (dependencies.java != null) {
    env['JAVA_HOME'] = dependencies.java;
  }

  const isWindows: boolean = (process.platform === 'win32');
  const ltexLsStartPath: string = Path.join(
    dependencies.ltexLs, 'bin', (isWindows ? 'ltex-ls.bat' : 'ltex-ls'));

  const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
  const initialJavaHeapSize: number = getRenamedSetting(workspaceConfig,
      'java.initialHeapSize', 'performance.initialJavaHeapSize');
  const maximumJavaHeapSize: number = getRenamedSetting(workspaceConfig,
      'java.maximumHeapSize', 'performance.maximumJavaHeapSize');
  env['LTEX_LS_OPTS'] = `-Xms${initialJavaHeapSize}m -Xmx${maximumJavaHeapSize}m`;

  return {command: ltexLsStartPath, args: [], options: {'env': env}};
}

function logExecutable(executable: CodeLanguageClient.Executable) {
  log('  Command: ' + JSON.stringify(executable.command));
  log('  Arguments: ' + JSON.stringify(executable.args));
  log('  env[\'JAVA_HOME\']: ' + JSON.stringify(executable.options.env['JAVA_HOME']));
  log('  env[\'LTEX_LS_OPTS\']: ' + JSON.stringify(executable.options.env['LTEX_LS_OPTS']));
}

async function startLanguageClient(context: Code.ExtensionContext, numberOfCrashes: number = 0):
      Promise<void> {
  const dependencies: Dependencies = await installDependencies(context);
  const serverOptions: CodeLanguageClient.ServerOptions = await getLtexLsExecutable(dependencies);

  // Options to control the language client
  const clientOptions: CodeLanguageClient.LanguageClientOptions = {
        documentSelector: [
          {scheme: 'file', language: 'markdown'},
          {scheme: 'untitled', language: 'markdown'},
          {scheme: 'file', language: 'latex'},
          {scheme: 'untitled', language: 'latex'},
          {scheme: 'file', language: 'rsweave'},
          {scheme: 'untitled', language: 'rsweave'},
        ],
        synchronize: {
          configurationSection: 'ltex',
        },
        // Until it is specified in the LSP that the locale is automatically sent with
        // the initialization request, we have to do that manually.
        // See https://github.com/microsoft/language-server-protocol/issues/754.
        initializationOptions: {
          locale: Code.env.language,
        },
        revealOutputChannelOn: CodeLanguageClient.RevealOutputChannelOn.Never,
        traceOutputChannel: clientOutputChannel,
        outputChannel: serverOutputChannel,
      };

  let languageClient: CodeLanguageClient.LanguageClient = new CodeLanguageClient.LanguageClient(
      'ltex', 'LTeX Language Server', serverOptions, clientOptions);

  // Hack to enable the server to execute commands that change the client configuration
  // (e.g., adding words to the dictionary).
  // The client configuration cannot be directly changed by the server, so we send a
  // telemetry notification to the client, which then changes the configuration.
  languageClient.onTelemetry(processTelemetry);

  log('Starting ltex-ls...');
  logExecutable(serverOptions);
  log('');

  languageClient.info('Starting ltex-ls...');
  let disposable: Code.Disposable = languageClient.start();

  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(disposable);
}

function processTelemetry(params: any) {
  if (!('commandName' in params) || !params['commandName'].startsWith('ltex.')) {
    log(`Unknown telemetry event '${params}'.`);
    return;
  }

  const resourceConfig: Code.WorkspaceConfiguration =
      Code.workspace.getConfiguration('ltex', Code.Uri.parse(params['uri']));

  if (params['commandName'] === 'ltex.addToDictionary') {
    const language: string = resourceConfig.get('language');
    let dictionary: string[] = resourceConfig.get(`languageSettings.${language}.dictionary`);
    dictionary = dictionary.concat(convertToStringArray(params['word']));
    dictionary.sort((a: string, b: string) =>
        a.localeCompare(b, undefined, {sensitivity: 'base'}));
    setConfigurationSetting(`languageSettings.${language}.dictionary`, dictionary,
        resourceConfig, 'addToDictionary');

  } else if (params['commandName'] === 'ltex.disableRule') {
    const language: string = resourceConfig.get('language');
    let disabledRules: string[] = resourceConfig.get(`languageSettings.${language}.disabledRules`);
    disabledRules = disabledRules.concat(convertToStringArray(params['ruleId']));
    disabledRules.sort((a: string, b: string) =>
        a.localeCompare(b, undefined, {sensitivity: 'base'}));
    setConfigurationSetting(`languageSettings.${language}.disabledRules`, disabledRules,
        resourceConfig, 'disableRule');

  } else if (params['commandName'] === 'ltex.ignoreRuleInSentence') {
    const ruleIds: string[] = convertToStringArray(params['ruleId']);
    const sentencePatterns: string[] = convertToStringArray(params['sentencePattern']);
    const ignoredRules: any[] = resourceConfig.get('ignoreRuleInSentence');

    for (let i: number = 0; i < ruleIds.length; i++) {
      ignoredRules.push({'rule': ruleIds[i], 'sentence': sentencePatterns[i]});
    }

    setConfigurationSetting('ignoreRuleInSentence', ignoredRules, resourceConfig,
        'ignoreRuleInSentence');
  }
}

export function activate(context: Code.ExtensionContext) {
  clientOutputChannel = Code.window.createOutputChannel('LTeX Language Client');
  serverOutputChannel = Code.window.createOutputChannel('LTeX Language Server');

  context.subscriptions.push(clientOutputChannel);
  context.subscriptions.push(serverOutputChannel);

  // Allow to enable languageTool in specific workspaces
  const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
  if (!workspaceConfig.get('enabled')) return;

  try {
    // create the language client
    startLanguageClient(context);
  } catch (e) {
    error('Could not start the language client!', e);
  }
}
