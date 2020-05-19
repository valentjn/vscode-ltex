import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';
import * as ChildProcess from 'child_process';
import * as extractZip from 'extract-zip';
import * as Fs from 'fs';
import * as Http from 'http';
import * as Https from 'https';
import * as Path from 'path';
import * as SemVer from 'semver';
import * as Tar from 'tar';
import * as Url from 'url';

import ProgressStack from './ProgressStack';
import Logger from './Logger';

export default class Dependencies {
  private _context: Code.ExtensionContext;
  private _ltexVersion: string;
  private _ltexLsPath: string | null = null;
  private _javaPath: string | null = null;

  public constructor(context: Code.ExtensionContext) {
    this._context = context;
    const ltex: Code.Extension<any> | undefined =
        Code.extensions.getExtension('valentjn.vscode-ltex');
    if (ltex == null) throw new Error('Could not get LTeX version.');
    this._ltexVersion = ltex.packageJSON.version;
  }

  private static parseUrl(urlStr: string): Https.RequestOptions {
    const url: Url.UrlWithStringQuery = Url.parse(urlStr);
    return {
          hostname: url.hostname,
          path: url.pathname + ((url.query != null) ? `?${url.query}` : ''),
          headers: {'User-Agent': 'vscode-ltex'},
        };
  }

  private static async doJsonRequest(urlStr: string): Promise<any> {
    const requestOptions: Https.RequestOptions = Dependencies.parseUrl(urlStr);

    if (Object.prototype.hasOwnProperty.call(process.env, 'LTEX_GITHUB_OAUTH_TOKEN')) {
      if (requestOptions.headers == null) requestOptions.headers = {};
      requestOptions.headers['Authorization'] = `token ${process.env['LTEX_GITHUB_OAUTH_TOKEN']}`;
    }

    return new Promise((resolve: (value: unknown) => void, reject: (reason: Error) => void) => {
      Https.get(requestOptions, (response: Http.IncomingMessage) => {
        const contentType: string | undefined = response.headers['content-type'];
        let error: Error | null = null;

        if (response.statusCode !== 200) {
          error = new Error(`Request failed with status code ${response.statusCode}.`);
        } else if ((contentType != null) && !/^application\/json/.test(contentType)) {
          error = new Error(`Request failed with content type ${contentType}.`);
        }

        response.setEncoding('utf8');
        let rawData: string = '';

        response.on('data', (chunk: any) => {
          rawData += chunk;
        });

        response.on('end', () => {
          if (error == null) {
            try {
              const jsonData: any = JSON.parse(rawData);
              resolve(jsonData);
            } catch (e) {
              reject(e);
            }
          } else {
            error.message += ` Response body: '${rawData}'.`;
            reject(error);
          }
        });
      }).on('error', (e: Error) => {
        reject(e);
      });
    });
  }

  private static async downloadFile(urlStr: string, path: string, codeProgress: ProgressStack):
        Promise<void> {
    const file: Fs.WriteStream = Fs.createWriteStream(path);
    const origTaskName: string = codeProgress.getTaskName();

    return new Promise((resolve: () => void, reject: (reason?: any) => void) => {
      Https.get(Dependencies.parseUrl(urlStr), (response: Http.IncomingMessage) => {
        if ((response.statusCode === 301) || (response.statusCode === 302) ||
              (response.statusCode === 307)) {
          if (response.headers.location == null) {
            reject(new Error(`Received redirection status code ${response.statusCode}', ` +
                'but no location header.'));
            return;
          }

          Logger.log(`Redirected to '${response.headers.location}'...`);
          Dependencies.downloadFile(response.headers.location, path, codeProgress)
              .then(resolve).catch(reject);
          return;
        } else if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`Request failed with status code ${response.statusCode}.`));
          return;
        }

        const totalBytes: number = ((response.headers['content-length'] != null) ?
            parseInt(response.headers['content-length']) : 0);
        const totalMb: number = Math.round(totalBytes / 1e6);
        let downloadedBytes: number = 0;
        let downloadedMb: number = -1;
        codeProgress.updateTask(0, ((totalBytes > 0) ?
            `${origTaskName} 0MB/${totalMb}MB` : origTaskName));

        response.pipe(file);

        if (totalBytes > 0) {
          response.on('data', (chunk: any) => {
            downloadedBytes += chunk.length;
            const newDownloadedMb: number = Math.round(downloadedBytes / 1e6);

            if (newDownloadedMb != downloadedMb) {
              downloadedMb = newDownloadedMb;
              const taskName: string = `${origTaskName} ${downloadedMb}MB/${totalMb}MB`;
              codeProgress.updateTask(downloadedBytes / totalBytes, taskName);
            }
          });
        }

        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (e: Error) => {
        Fs.unlinkSync(path);
        reject(e);
      });
    });
  }

  private getLatestCompatibleLtexLsVersion(versions: string[]): string | null {
    let latestVersion: string | null = null;

    versions.forEach((version: string) => {
      if (SemVer.valid(version) && SemVer.lte(version, this._ltexVersion) &&
            ((latestVersion == null) || SemVer.gt(version, latestVersion))) {
        latestVersion = version;
      }
    });

    return latestVersion;
  }

  private async installDependency(urlStr: string, name: string, codeProgress: ProgressStack):
        Promise<void> {
    codeProgress.startTask(0.1, `Downloading ${name}...`);
    const url: Url.UrlWithStringQuery = Url.parse(urlStr);
    if (url.pathname == null) throw new Error(`Could not get path name from URL '${urlStr}'.`);
    const archiveName: string = Path.basename(url.pathname);
    const archiveType: string = ((Path.extname(archiveName) == '.zip') ? 'zip' : 'tar.gz');
    const tmpDirPath: string = Fs.mkdtempSync(Path.join(this._context.extensionPath, 'tmp-'));
    const archivePath: string = Path.join(tmpDirPath, archiveName);
    codeProgress.finishTask();

    codeProgress.startTask(0.8, `Downloading ${name}...`);
    Logger.log(`Downloading ${name} from '${urlStr}' to '${archivePath}'...`);
    await Dependencies.downloadFile(urlStr, archivePath, codeProgress);
    codeProgress.finishTask();

    codeProgress.startTask(0.1, `Extracting ${name}...`);
    Logger.log(`Extracting ${name} archive to '${tmpDirPath}'...`);

    if (archiveType == 'zip') {
      await extractZip(archivePath, {dir: tmpDirPath});
    } else {
      await Tar.extract({file: archivePath, cwd: tmpDirPath});
    }

    codeProgress.updateTask(0.8);

    const fileNames: string[] = Fs.readdirSync(tmpDirPath);
    let extractedDirPath: string | null = null;

    for (let i: number = 0; i < fileNames.length; i++) {
      const filePath: string = Path.join(tmpDirPath, fileNames[i]);
      const stats: Fs.Stats = Fs.lstatSync(filePath);

      if (stats.isDirectory()) {
        if (extractedDirPath == null) {
          extractedDirPath = filePath;
        } else {
          Logger.warn('Found multiple directories after extraction: ' +
              `'${extractedDirPath}' and '${filePath}', using the former.`);
        }
      } else {
        try {
          Logger.log(`Deleting '${filePath}'...`);
          Fs.unlinkSync(filePath);
        } catch (e) {
          Logger.warn(`Could not delete '${filePath}', leaving temporary file on disk.`, e);
        }
      }
    }

    if (extractedDirPath == null) {
      throw new Error('Could not find a directory after extracting the archive.');
    }

    Logger.log(`Found extracted directory '${extractedDirPath}'.`);
    codeProgress.updateTask(0.85);

    const targetDirPath: string = Path.join(
        this._context.extensionPath, 'lib', Path.basename(extractedDirPath));
    const targetExists: boolean = Fs.existsSync(targetDirPath);
    codeProgress.updateTask(0.9);

    if (targetExists) {
      Logger.warn(`Did not move '${extractedDirPath}' to '${targetDirPath}', ` +
          'as target already exists.');
    } else {
      Logger.log(`Moving '${extractedDirPath}' to '${targetDirPath}'...`);
      Fs.renameSync(extractedDirPath, targetDirPath);
    }

    codeProgress.updateTask(0.95);

    try {
      Logger.log(`Deleting '${tmpDirPath}'...`);
      Fs.rmdirSync(tmpDirPath);
    } catch (e) {
      Logger.warn(`Could not delete '${tmpDirPath}', leaving temporary directory on disk.`, e);
    }

    codeProgress.finishTask();

    return Promise.resolve();
  }

  private async installLtexLs(): Promise<void> {
    const progressOptions: Code.ProgressOptions = {
          title: 'LTeX',
          location: Code.ProgressLocation.Notification,
          cancellable: false,
        };

    return Code.window.withProgress(progressOptions,
          async (progress: Code.Progress<{increment?: number; message?: string}>):
            Promise<void> => {
      const codeProgress: ProgressStack = new ProgressStack(
          'Downloading and extracting ltex-ls', progress);

      codeProgress.startTask(0.1, 'Preparing download of ltex-ls...');
      const jsonUrl: string = 'https://api.github.com/repos/valentjn/ltex-ls/releases';
      Logger.log(`Fetching list of ltex-ls releases from '${jsonUrl}'...`);
      const jsonData: any = await Dependencies.doJsonRequest(jsonUrl);

      const ltexLsVersions: string[] = [];

      jsonData.forEach((release: any) => {
        ltexLsVersions.push(release.tag_name);
      });

      const ltexLsVersion: string | null = this.getLatestCompatibleLtexLsVersion(ltexLsVersions);

      if (ltexLsVersion == null) {
        throw Error('Could not find a compatible version of ltex-ls on GitHub. ' +
            `LTeX version is '${this._ltexVersion}', available ltex-ls versions are ` +
            `'${JSON.stringify(ltexLsVersions)}'.`);
      }

      Logger.log(`Latest compatible release is 'ltex-ls-${ltexLsVersion}'.`);
      const ltexLsUrl: string = 'https://github.com/valentjn/ltex-ls/releases/download/' +
          `${ltexLsVersion}/ltex-ls-${ltexLsVersion}.tar.gz`;

      codeProgress.finishTask();

      codeProgress.startTask(0.9, 'Downloading and extracting ltex-ls...');
      await this.installDependency(ltexLsUrl, 'ltex-ls', codeProgress);
      codeProgress.finishTask();
    });
  }

  private async installJava(): Promise<void> {
    const progressOptions: Code.ProgressOptions = {
          title: 'LTeX',
          location: Code.ProgressLocation.Notification,
          cancellable: false,
        };

    return Code.window.withProgress(progressOptions,
          async (progress: Code.Progress<{increment?: number; message?: string}>):
            Promise<void> => {
      const codeProgress: ProgressStack = new ProgressStack(
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
      Logger.log(`Guessed AdoptOpenJDK archive name '${javaArchiveName}' from your platform and ` +
          'architecture (may not exist).');
      const javaUrl: string = 'https://github.com/AdoptOpenJDK/openjdk11-binaries/releases/' +
          `download/jdk-11.0.7%2B10/${javaArchiveName}`;

      await this.installDependency(javaUrl, 'Java', codeProgress);
    });
  }

  private searchBundledLtexLs(libDirPath: string): string | null {
    const names: string[] = Fs.readdirSync(libDirPath);
    const ltexLsVersions: string[] = [];

    names.forEach((name: string) => {
      if (name.startsWith('ltex-ls-')) {
        ltexLsVersions.push(name.substr(8));
      }
    });

    const ltexLsVersion: string | null = this.getLatestCompatibleLtexLsVersion(ltexLsVersions);
    return ((ltexLsVersion != null) ? Path.join(libDirPath, `ltex-ls-${ltexLsVersion}`) : null);
  }

  private static searchBundledJava(libDirPath: string): string | null {
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

  private static getRenamedSetting(workspaceConfig: Code.WorkspaceConfiguration,
        newName: string, oldName: string): any {
    const oldValue: any = workspaceConfig.get(oldName);
    return ((oldValue != null) ? oldValue : workspaceConfig.get(newName));
  }

  public async install(): Promise<boolean> {
    const libDirPath: string = Path.join(this._context.extensionPath, 'lib');
    const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');

    if (!Fs.existsSync(libDirPath)) {
      Logger.log(`Creating '${libDirPath}'...`);
      Fs.mkdirSync(libDirPath);
    }

    try {
      // try 0: only use ltex.ltexLs.path (don't use lib/, don't download)
      // try 1: use ltex.ltexLs.path or lib/ (don't download)
      // try 2: use ltex.ltexLs.path or lib/ or download
      Logger.log('');
      this._ltexLsPath = workspaceConfig.get('ltex-ls.path', null);

      if (this._ltexLsPath != null) {
        Logger.log(`ltex.ltex-ls.path set to ${this._ltexLsPath}.`);
      } else {
        Logger.log('ltex.ltex-ls.path not set.');
        Logger.log(`Searching for ltex-ls in '${libDirPath}'...`);
        this._ltexLsPath = this.searchBundledLtexLs(libDirPath);

        if (this._ltexLsPath != null) {
          Logger.log(`ltex-ls found in '${this._ltexLsPath}'.`);
        } else {
          Logger.log(`Could not find a compatible version of ltex-ls in '${libDirPath}'.`);
          Logger.log('Initiating download of ltex-ls...');
          await this.installLtexLs();
          this._ltexLsPath = this.searchBundledLtexLs(libDirPath);

          if (this._ltexLsPath != null) {
            Logger.log(`ltex-ls found in '${this._ltexLsPath}'.`);
          } else {
            throw Error('Could not download or extract ltex-ls.');
          }
        }
      }
    } catch (e) {
      Logger.error('The download or extraction of ltex-ls failed!', e);
      Logger.log('You might want to try offline installation, ' +
          'see https://github.com/valentjn/vscode-ltex#offline-installation.');
      Logger.showClientOutputChannel();
      return this.showOfflineInstallationInstructions('Could not install ltex-ls.');
    }

    try {
      // try 0: only use ltex.java.path (don't use lib/, don't download)
      // try 1: use ltex.java.path or lib/ (don't download)
      // try 2: use ltex.java.path or lib/ or download
      for (let i: number = 0; i < 3; i++) {
        Logger.log('');
        this._javaPath = Dependencies.getRenamedSetting(workspaceConfig, 'java.path', 'javaHome');

        if (this._javaPath != null) {
          Logger.log(`ltex.java.path set to '${this._javaPath}'.`);
        } else if (i == 0) {
          Logger.log('ltex.java.path not set.');
        } else {
          Logger.log(`Searching for bundled Java in '${libDirPath}'.`);
          this._javaPath = Dependencies.searchBundledJava(libDirPath);

          if (this._javaPath != null) {
            Logger.log(`Bundled Java found in '${this._javaPath}'.`);
          } else {
            Logger.log(`Could not find bundled Java in '${libDirPath}'.`);

            if (i <= 1) {
              continue;
            } else {
              await this.installJava();
              this._javaPath = Dependencies.searchBundledJava(libDirPath);

              if (this._javaPath == null) {
                Logger.log('Download or extraction of Java failed. ' +
                    'Trying to run Java via PATH or JAVA_HOME.');
              }
            }
          }
        }

        Logger.log(`Using ltex-ls from '${this._ltexLsPath}'.`);

        if (this._javaPath != null) {
          Logger.log(`Using Java from '${this._javaPath}'.`);
        } else {
          Logger.log('Using Java from PATH or JAVA_HOME (may fail if not installed).');
        }

        if (await this.test()) {
          Logger.log('');
          return true;
        }
      }

      throw Error('Could not run ltex-ls.');
    } catch (e) {
      Logger.error('The download/extraction/run of Java failed!', e);
      Logger.log('You might want to try offline installation, ' +
          'see https://github.com/valentjn/vscode-ltex#offline-installation.');
      return await this.showOfflineInstallationInstructions('Could not download/extract/run Java.');
    }
  }

  private async showOfflineInstallationInstructions(message: string): Promise<boolean> {
    return new Promise((resolve: (value: boolean) => void) => {
      Code.window.showErrorMessage(`${message} You might want to try offline installation.`,
            'Try again', 'Offline instructions').then(async (selectedItem: string | undefined) => {
        if (selectedItem == 'Try again') {
          resolve(await this.install());
          return;
        } else if (selectedItem == 'Offline instructions') {
          Code.env.openExternal(Code.Uri.parse(
              'https://github.com/valentjn/vscode-ltex#offline-installation'));
        }

        resolve(false);
      });
    });
  }

  private async test(): Promise<boolean> {
    const executable: CodeLanguageClient.Executable = await this.getLtexLsExecutable();
    if (executable.args == null) executable.args = [];
    executable.args.push('--version');
    const executableOptions: ChildProcess.SpawnSyncOptionsWithStringEncoding = {
          encoding: 'utf-8',
          timeout: 10000,
        };

    if (executable.options != null) {
      executableOptions.cwd = executable.options.cwd;
      executableOptions.env = executable.options.env;
    }

    Logger.log('Testing ltex-ls...');
    Logger.logExecutable(executable);
    const process: ChildProcess.SpawnSyncReturns<string> = ChildProcess.spawnSync(
        executable.command, executable.args, executableOptions);

    const success: boolean = ((process.status == 0) && process.stdout.includes('ltex-ls'));

    if (success) {
      Logger.log('Test successful!');
    } else {
      Logger.log('Test failed.');
      Logger.log(`Exit code of ltex-ls: ${process.status}`);
      Logger.log('stdout of ltex-ls:');
      Logger.log(process.stdout);
      Logger.log('stderr of ltex-ls:');
      Logger.log(process.stderr);
    }

    return success;
  }

  public async getLtexLsExecutable(): Promise<CodeLanguageClient.Executable> {
    if (this._ltexLsPath == null) {
      return Promise.reject(new Error('Could not get ltex-ls executable, ' +
          'has to be installed first.'));
    }

    const env: NodeJS.ProcessEnv = {};

    for (const name in process.env) {
      if (Object.prototype.hasOwnProperty.call(process.env, name)) {
        env[name] = process.env[name];
      }
    }

    if (this._javaPath != null) {
      env['JAVA_HOME'] = this._javaPath;
    }

    const isWindows: boolean = (process.platform === 'win32');
    const ltexLsScriptPath: string = Path.join(
        this._ltexLsPath, 'bin', (isWindows ? 'ltex-ls.bat' : 'ltex-ls'));

    const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
    const initialJavaHeapSize: number = Dependencies.getRenamedSetting(workspaceConfig,
        'java.initialHeapSize', 'performance.initialJavaHeapSize');
    const maximumJavaHeapSize: number = Dependencies.getRenamedSetting(workspaceConfig,
        'java.maximumHeapSize', 'performance.maximumJavaHeapSize');
    env['LTEX_LS_OPTS'] = `-Xms${initialJavaHeapSize}m -Xmx${maximumJavaHeapSize}m`;

    return {command: ltexLsScriptPath, args: [], options: {'env': env}};
  }
}
