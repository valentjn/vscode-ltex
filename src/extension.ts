'use strict';

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
const log: (line: string) => void = (line: string) => {clientOutputChannel.appendLine(line)};
const ltexVersion = Code.extensions.getExtension('valentjn.vscode-ltex').packageJSON.version;

async function setConfigurationSetting(settingName: string, settingValue: any,
      resourceConfig: Code.WorkspaceConfiguration, commandName: string): Promise<void> {
  const configurationTargetString: string = resourceConfig['configurationTarget'][commandName];
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

  public updateTask(progress: number) {
    this.taskProgressStack[this.taskProgressStack.length - 1] = progress;
    this.showProgress();
  }

  public finishTask() {
    const n: number = this.taskProgressStack.length - 1;
    if (n == 0) throw Error("Could not finish task, task stack already empty.")
    this.taskProgressStack.pop();
    this.taskProgressStack[n - 1] += this.taskSizeStack.pop();
    this.taskNameStack.pop();
    this.showProgress();
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
      let downloadedSize: number = 0;
      response.pipe(file);

      response.on('data', (chunk: any) => {
        downloadedSize += chunk.length;
        codeProgress.updateTask(downloadedSize / fileSize);
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

async function installDependency(
      context: Code.ExtensionContext, urlStr: string, name: string, removeIfExists: boolean,
      codeProgress: CodeProgress): Promise<void> {
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
    let doMove: boolean = true;

    if (Fs.existsSync(targetDirPath)) {
      if (removeIfExists) {
        log(`Target '${targetDirPath}' already exists, removing...`);
        Rimraf.sync(targetDirPath);
      } else {
        log(`Did not move '${extractedDirPath}' to '${targetDirPath}', as target already exists.`);
        doMove = false;
      }
    }

    codeProgress.updateTask(0.9);

    if (doMove) {
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

async function installLtexLs(
      context: Code.ExtensionContext, removeIfExists: boolean): Promise<void> {
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
    await installDependency(context, ltexLsUrl, 'ltex-ls', removeIfExists, codeProgress);
    codeProgress.finishTask();

    return Promise.resolve();
  });
}

async function installJava(
      context: Code.ExtensionContext, removeIfExists: boolean): Promise<void> {
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

    await installDependency(context, javaUrl, 'Java', removeIfExists, codeProgress);

    return Promise.resolve();
  });
}

function searchBundledLtexLs(context: Code.ExtensionContext): string {
  const names: string[] = Fs.readdirSync(Path.join(context.extensionPath, 'lib'));
  let ltexLsVersions: string[] = [];

  names.forEach((name) => {
    if (name.startsWith('ltex-ls-')) {
      ltexLsVersions.push(name.substr(8));
    }
  });

  const ltexLsVersion: string = getLatestCompatibleLtexLsVersion(ltexLsVersions);
  return ((ltexLsVersion != null) ?
      Path.join(context.extensionPath, 'lib', `ltex-ls-${ltexLsVersion}`) : null);
}

function searchBundledJava(context: Code.ExtensionContext): string {
  const javaPath: string = Path.join(context.extensionPath, 'lib', 'jdk-11.0.7+10-jre');

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

async function startLanguageClient(
      context: Code.ExtensionContext, numberOfCrashes: number = 0): Promise<void> {
  const libPath: string = Path.join(context.extensionPath, 'lib');

  if (numberOfCrashes >= 2) {
    log(`Crashed at least two times in a row, cleaning '${libPath}'...`);
    Rimraf.sync(libPath);
    Fs.mkdirSync(libPath);
    Fs.writeFileSync(Path.join(libPath, '.keep'), '\n');
  }

  const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
  let ltexLsPath: string;

  if ((workspaceConfig['ltex-ls'] != null) && (workspaceConfig['ltex-ls']['path'] != null)) {
    ltexLsPath = workspaceConfig['ltex-ls']['path'];
    log(`ltex.ltex-ls.path set to ${ltexLsPath}.`);
  } else {
    log(`ltex.ltex-ls.path not set, searching for ltex-ls in '${libPath}'.`);
    ltexLsPath = searchBundledLtexLs(context);

    if (ltexLsPath == null) {
      log(`Could not find compatible version of ltex-ls in '${libPath}'. Initiating download.`);
      await installLtexLs(context, false);
      ltexLsPath = searchBundledLtexLs(context);

      if (ltexLsPath == null) {
        throw new Error('Download or extraction of ltex-ls failed. Aborting!');
      }
    }
  }

  log(`Using ltex-ls from '${ltexLsPath}'.`);

  let javaHome: string;

  if ((workspaceConfig['java'] != null) && (workspaceConfig['java']['path'] != null)) {
    javaHome = process.env['JAVA_HOME'];
    log(`ltex.java.path set to '${javaHome}'.`);
  } else if (numberOfCrashes >= 1) {
    log(`ltex.java.path not set and crashed before, searching for bundled Java in '${libPath}'.`);
    javaHome = searchBundledJava(context);

    if (javaHome == null) {
      log(`Could not find bundled Java in '${libPath}'. Initiating download.`);
      await installJava(context, false);
      javaHome = searchBundledJava(context);

      if (javaHome == null) {
        log('Download or extraction of Java failed. Trying to run Java via PATH or JAVA_HOME.');
      }
    }
  } else {
    log('ltex.java.path not set. Trying to run Java via PATH or JAVA_HOME.');
  }

  if (javaHome != null) {
    log(`Using Java from '${javaHome}', setting JAVA_HOME to this value.`);
    process.env['JAVA_HOME'] = javaHome;
  }

  const isWindows: boolean = (process.platform === 'win32');
  const ltexLsStartPath: string = Path.join(
      ltexLsPath, 'bin', (isWindows ? 'ltex-ls.bat' : 'ltex-ls'));

  const initialJavaHeapSize: number = workspaceConfig['java']['initialHeapSize'];
  const maximumJavaHeapSize: number = workspaceConfig['java']['maximumHeapSize'];
  process.env['LTEX_LS_OPTS'] = '-Xms' + initialJavaHeapSize + 'm -Xmx' + maximumJavaHeapSize + 'm';

  const serverOptions: CodeLanguageClient.ServerOptions = {
    command: ltexLsStartPath,
    args: [],
    options: {'env': process.env},
  };

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
  languageClient.clientOptions.errorHandler =
      new LanguageClientErrorHandler(context, languageClient, numberOfCrashes);

  // Hack to enable the server to execute commands that change the client configuration
  // (e.g., adding words to the dictionary).
  // The client configuration cannot be directly changed by the server, so we send a
  // telemetry notification to the client, which then changes the configuration.
  languageClient.onTelemetry(processTelemetry);

  log('Starting ltex-ls with Java...');
  log('');
  languageClient.info('Starting ltex-ls with Java...');
  let disposable: Code.Disposable = languageClient.start();

  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(disposable);

  return Promise.resolve();
}

class LanguageClientErrorHandler implements CodeLanguageClient.ErrorHandler {
  private context: Code.ExtensionContext;
  private languageClient: CodeLanguageClient.LanguageClient;
  private defaultErrorHandler: CodeLanguageClient.ErrorHandler;
  private startTime: number;
  private numberOfCrashes: number;

  public constructor(context: Code.ExtensionContext,
        languageClient: CodeLanguageClient.LanguageClient, numberOfCrashes: number) {
    this.context = context;
    this.languageClient = languageClient;
    this.defaultErrorHandler = languageClient.createDefaultErrorHandler();
    this.startTime = Date.now();
    this.numberOfCrashes = numberOfCrashes;
  }

  error(error: Error, message: CodeLanguageClient.Message, count: number):
        CodeLanguageClient.ErrorAction {
    return this.defaultErrorHandler.error(error, message, count);
  }

  closed(): CodeLanguageClient.CloseAction {
    let closeAction: CodeLanguageClient.CloseAction = this.defaultErrorHandler.closed();
    const hasCrashed: boolean = (Date.now() - this.startTime < 60000);
    const ignoreLogLineMessage: string = 'There will be a log entry emitted by VS Code telling ' +
        'you following log entry that the server won\'t be restarted. ' +
        'You can safely ignore that log entry once. ltex-ls *will* be restarted.';

    if (hasCrashed) {
      this.numberOfCrashes++;

      if (closeAction == CodeLanguageClient.CloseAction.Restart) {
        log(`ltex-ls crashed (try ${this.numberOfCrashes}), restarting.`);
        this.languageClient.info(ignoreLogLineMessage);
        startLanguageClient(this.context, this.numberOfCrashes);
      } else {
        log('ltex-ls crashed, will not restart.');
      }
    } else {
      if (closeAction == CodeLanguageClient.CloseAction.Restart) {
        log('ltex-ls closed, restarting.');
        this.languageClient.info(ignoreLogLineMessage);
        startLanguageClient(this.context);
      } else {
        log('ltex-ls closed, will not restart.');
      }
    }

    return CodeLanguageClient.CloseAction.DoNotRestart;
  }
}

function processTelemetry(params: any) {
  if (!('commandName' in params) || !params['commandName'].startsWith('ltex.')) {
    log(`Unknown telemetry event '${params}'.`);
    return;
  }

  const resourceConfig: Code.WorkspaceConfiguration =
      Code.workspace.getConfiguration('ltex', Code.Uri.parse(params['uri']));

  if (params['commandName'] === 'ltex.addToDictionary') {
    const language: string = resourceConfig['languageSettings']['language'];
    let dictionary: string[] = resourceConfig[language]['dictionary'];
    dictionary = dictionary.concat(convertToStringArray(params['word']));
    dictionary.sort((a: string, b: string) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' }));
    setConfigurationSetting(`languageSettings.${language}.dictionary`, dictionary,
        resourceConfig, 'addToDictionary');

  } else if (params['commandName'] === 'ltex.disableRule') {
    const language: string = resourceConfig['language'];
    let disabledRules: string[] = resourceConfig['languageSettings'][language]['disabledRules'];
    disabledRules = disabledRules.concat(convertToStringArray(params['ruleId']));
    disabledRules.sort((a: string, b: string) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' }));
    setConfigurationSetting(`languageSettings.${language}.disabledRules`, disabledRules,
        resourceConfig, 'disableRule');

  } else if (params['commandName'] === 'ltex.ignoreRuleInSentence') {
    const ruleIds: string[] = convertToStringArray(params['ruleId']);
    const sentencePatterns: string[] = convertToStringArray(params['sentencePattern']);

    for (let i: number = 0; i < ruleIds.length; i++) {
      resourceConfig['ignoreRuleInSentence'].push({'rule': ruleIds[i],
          'sentence': sentencePatterns[i]});
    }

    setConfigurationSetting('ignoreRuleInSentence', resourceConfig['ignoreRuleInSentence'],
        resourceConfig, 'ignoreRuleInSentence');
  }
}

export function activate(context: Code.ExtensionContext) {
  clientOutputChannel = Code.window.createOutputChannel('LTeX Language Client');
  serverOutputChannel = Code.window.createOutputChannel('LTeX Language Server');

  // Allow to enable languageTool in specific workspaces
  const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
  if (!workspaceConfig['enabled']) return;

  // create the language client
  startLanguageClient(context);
}
