/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient/node';
import * as ChildProcess from 'child_process';
import * as Crypto from 'crypto';
import extractZip from 'extract-zip';
import * as Fs from 'fs';
import * as Http from 'http';
import * as Https from 'https';
import * as Os from 'os';
import * as Path from 'path';
import * as SemVer from 'semver';
import * as Tar from 'tar';
import * as Url from 'url';

import {i18n} from './I18n';
import Logger from './Logger';
import ProgressStack from './ProgressStack';

export default class DependencyManager {
  private _context: Code.ExtensionContext;
  private _vscodeLtexVersion: string;
  private _ltexLsPath: string | null = null;
  private _javaPath: string | null = null;
  private _ltexLsVersion: string | null = null;
  private _javaVersion: string | null = null;

  private static readonly _offlineInstructionsUrl: string = 'https://valentjn.github.io/'
      + 'vscode-ltex/docs/installation-and-usage.html#offline-installation';

  private static readonly _toBeDownloadedLtexLsVersion: string = '11.0.0-alpha.1';
  private static readonly _toBeDownloadedLtexLsHashDigest: string =
      'f8aa086f7ad6660722deaa0899518f16c7c5603345975240f55cd9785d159133';

  private static readonly _toBeDownloadedJavaVersion: string = '11.0.10+9';
  private static readonly _toBeDownloadedJavaHashDigests: {[fileName: string]: string} = {
    'OpenJDK11U-jre_aarch64_linux_hotspot_11.0.10_9.tar.gz':
      '5f9a894bd694f598f2befa4a605169685ac8bcb8ec68d25e587e8db4d2307b74',
    'OpenJDK11U-jre_arm_linux_hotspot_11.0.10_9.tar.gz':
      '2f2da2149c089c84f00b0eda63c31b77c8b51a1c080e18a70ecb5a78ba40d8c6',
    'OpenJDK11U-jre_ppc64_aix_hotspot_11.0.10_9.tar.gz':
      '9bfee39d1da317fdef5ad903e04c52f2336f4f16cbee94635e030b81b311c124',
    'OpenJDK11U-jre_ppc64le_linux_hotspot_11.0.10_9.tar.gz':
      'd269b646af32eb41d74b3a5259f634921a063c67642ab5c227142463824b2a6d',
    'OpenJDK11U-jre_s390x_linux_hotspot_11.0.10_9.tar.gz':
      '2c9ec28b10bf1628b20a157c746988f323e0dcbf1053b616aa6593923e3a70df',
    'OpenJDK11U-jre_x64_linux_hotspot_11.0.10_9.tar.gz':
      '25fdcf9427095ac27c8bdfc82096ad2e615693a3f6ea06c700fca7ffb271131a',
    'OpenJDK11U-jre_x64_mac_hotspot_11.0.10_9.tar.gz':
      '215e94323d7c74fe31e5383261e3bfc8e9ca3dc03212738c48d29868b02fe875',
    'OpenJDK11U-jre_x64_windows_hotspot_11.0.10_9.zip':
      'bab0d47f4764520a96890d00ef5f27d3eb350f77e8dd15e6adf560993fb12595',
    'OpenJDK11U-jre_x86-32_windows_hotspot_11.0.10_9.zip':
      'bfeef4db7942f920d3f08ff7cf6a618728df6c0dcdf23323ea68f33f912ce881',
  };

  public constructor(context: Code.ExtensionContext) {
    this._context = context;
    // deprecated: replace with context.extension starting with VS Code 1.55.0
    const vscodeLtexExtension: Code.Extension<any> | undefined =
        Code.extensions.getExtension('valentjn.vscode-ltex');
    if (vscodeLtexExtension == null) throw new Error(i18n('couldNotGetVscodeLtexVersion'));
    this._vscodeLtexVersion = vscodeLtexExtension.packageJSON.version;
  }

  private static isValidPath(path: string | null): boolean {
    return ((path != null) && (path.length > 0));
  }

  private static normalizePath(path: string | null | undefined): string | null {
    if (path == null) return null;
    const homeDirPath: string = Os.homedir();
    return path.replace(/^~($|\/|\\)/, `${homeDirPath}$1`);
  }

  private static parseUrl(urlStr: string): Https.RequestOptions {
    const url: Url.UrlWithStringQuery = Url.parse(urlStr);
    return {
          hostname: url.hostname,
          path: url.pathname + ((url.query != null) ? `?${url.query}` : ''),
          headers: {'User-Agent': 'vscode-ltex'},
        };
  }

  private static async downloadFile(urlStr: string, path: string, codeProgress: ProgressStack):
        Promise<void> {
    const file: Fs.WriteStream = Fs.createWriteStream(path);
    const origTaskName: string = codeProgress.getTaskName();

    return new Promise((resolve: () => void, reject: (reason?: any) => void) => {
      Https.get(DependencyManager.parseUrl(urlStr), (response: Http.IncomingMessage) => {
        if ((response.statusCode === 301) || (response.statusCode === 302)
              || (response.statusCode === 307)) {
          if (response.headers.location == null) {
            reject(new Error(i18n('receivedRedirectionStatusCodeWithoutLocationHeader',
                response.statusCode)));
            return;
          }

          Logger.log(i18n('redirectedTo', response.headers.location));
          DependencyManager.downloadFile(response.headers.location, path, codeProgress)
              .then(resolve).catch(reject);
          return;
        } else if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(i18n('requestFailedWithStatusCode', response.statusCode)));
          return;
        }

        const totalBytes: number = ((response.headers['content-length'] != null)
            ? parseInt(response.headers['content-length']) : 0);
        const totalMb: number = Math.round(totalBytes / 1e6);
        let downloadedBytes: number = 0;
        let lastTaskNameUpdate: number = Date.now();
        codeProgress.updateTask(0, ((totalBytes > 0)
            ? `${origTaskName}  0MB/${totalMb}MB` : origTaskName));

        response.pipe(file);

        if (totalBytes > 0) {
          response.on('data', (chunk: any) => {
            downloadedBytes += chunk.length;
            const now: number = Date.now();

            if (now - lastTaskNameUpdate >= 500) {
              lastTaskNameUpdate = now;
              const downloadedMb: number = Math.round(downloadedBytes / 1e6);
              const taskName: string = `${origTaskName}  ${downloadedMb}MB/${totalMb}MB`;
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

  private static async verifyFile(path: string, hashDigest: string): Promise<void> {
    return new Promise((resolve: () => void, reject: (reason?: any) => void) => {
      const hash: Crypto.Hash = Crypto.createHash('sha256');
      const readStream: Fs.ReadStream = Fs.createReadStream(path);

      readStream.on('data', (d: any) => hash.update(d));

      readStream.on('end', () => {
        const actualHashDigest: string = hash.digest('hex');

        if (actualHashDigest === hashDigest) {
          resolve();
        } else {
          reject(new Error(i18n('couldNotVerifyDownloadedFile',
              path, hashDigest, actualHashDigest)));
        }
      });

      readStream.on('error', (e: Error) => reject(e));
    });
  }

  private getLatestLtexLsVersion(versions: string[]): string | null {
    let latestVersion: string | null = null;

    versions.forEach((version: string) => {
      if (SemVer.valid(version) && ((latestVersion == null) || SemVer.gt(version, latestVersion))) {
        latestVersion = version;
      }
    });

    return latestVersion;
  }

  private async installDependency(urlStr: string, hashDigest: string, name: string,
        codeProgress: ProgressStack): Promise<void> {
    codeProgress.startTask(0.1, i18n('downloading', name));
    const url: Url.UrlWithStringQuery = Url.parse(urlStr);
    if (url.pathname == null) throw new Error(i18n('couldNotGetPathNameFromUrl', urlStr));
    const archiveName: string = Path.basename(url.pathname);
    const archiveType: string = ((Path.extname(archiveName) == '.zip') ? 'zip' : 'tar.gz');
    const tmpDirPath: string = Fs.mkdtempSync(Path.join(this._context.extensionPath, 'tmp-'));
    const archivePath: string = Path.join(tmpDirPath, archiveName);
    codeProgress.finishTask();

    codeProgress.startTask(0.7, i18n('downloading', name));
    Logger.log(i18n('downloadingFromTo', name, urlStr, archivePath));
    await DependencyManager.downloadFile(urlStr, archivePath, codeProgress);
    codeProgress.finishTask();

    codeProgress.startTask(0.1, i18n('verifying', name));
    await DependencyManager.verifyFile(archivePath, hashDigest);
    codeProgress.finishTask();

    codeProgress.startTask(0.1, i18n('extracting', name));
    Logger.log(i18n('extractingTo', archivePath, tmpDirPath));

    if (archiveType == 'zip') {
      await extractZip(archivePath, {dir: tmpDirPath});
    } else {
      await Tar.extract({file: archivePath, cwd: tmpDirPath});
    }

    codeProgress.updateTask(0.8);

    const fileNames: string[] = Fs.readdirSync(tmpDirPath);
    let extractedDirPath: string | null = null;
    Logger.log(i18n('searchingForDirectory', tmpDirPath));

    for (let i: number = 0; i < fileNames.length; i++) {
      const filePath: string = Path.join(tmpDirPath, fileNames[i]);
      const stats: Fs.Stats = Fs.lstatSync(filePath);

      if (stats.isDirectory()) {
        if (extractedDirPath == null) {
          extractedDirPath = filePath;
        } else {
          Logger.warn(i18n('foundMultipleDirectoriesAfterExtraction', extractedDirPath, filePath));
        }
      } else {
        try {
          Logger.log(i18n('deleting', filePath));
          Fs.unlinkSync(filePath);
        } catch (e) {
          Logger.warn(i18n('couldNotDeleteLeavingTemporaryFileOnDisk', filePath), e);
        }
      }
    }

    if (extractedDirPath == null) {
      throw new Error(i18n('couldNotFindDirectoryAfterExtractingArchive'));
    }

    Logger.log(i18n('foundExtractedDirectory', extractedDirPath));
    codeProgress.updateTask(0.85);

    const targetDirPath: string = Path.join(
        this._context.extensionPath, 'lib', Path.basename(extractedDirPath));
    const targetExists: boolean = Fs.existsSync(targetDirPath);
    codeProgress.updateTask(0.9);

    if (targetExists) {
      Logger.warn(i18n('didNotMoveAsTargetAlreadyExists', extractedDirPath, targetDirPath));
    } else {
      Logger.log(i18n('movingTo', extractedDirPath, targetDirPath));
      Fs.renameSync(extractedDirPath, targetDirPath);
    }

    codeProgress.updateTask(0.95);

    try {
      Logger.log(i18n('deleting', tmpDirPath));
      Fs.rmdirSync(tmpDirPath);
    } catch (e) {
      Logger.warn(i18n('couldNotDeleteLeavingTemporaryDirectoryOnDisk', tmpDirPath), e);
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
          i18n('downloadingAndExtractingLtexLs'), progress);

      const ltexLsUrl: string = 'https://github.com/valentjn/ltex-ls/releases/download/'
          + `${DependencyManager._toBeDownloadedLtexLsVersion}/`
          + `ltex-ls-${DependencyManager._toBeDownloadedLtexLsVersion}.tar.gz`;
      await this.installDependency(ltexLsUrl, DependencyManager._toBeDownloadedLtexLsHashDigest,
          `ltex-ls ${DependencyManager._toBeDownloadedLtexLsVersion}`, codeProgress);
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
          i18n('downloadingAndExtractingJava'), progress);

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

      const javaArchiveName: string = `OpenJDK11U-jre_${arch}_${platform}_hotspot_`
          + `${DependencyManager._toBeDownloadedJavaVersion.replace('+', '_')}.${javaArchiveType}`;
      Logger.log(i18n('guessedAdoptOpenJdkArchiveName', javaArchiveName));
      const javaUrl: string = 'https://github.com/AdoptOpenJDK/openjdk11-binaries/releases/'
          + `download/jdk-${encodeURIComponent(DependencyManager._toBeDownloadedJavaVersion)}/`
          + javaArchiveName;
      const javaHashDigest: string =
          DependencyManager._toBeDownloadedJavaHashDigests[javaArchiveName];

      await this.installDependency(javaUrl, javaHashDigest,
          `Java ${DependencyManager._toBeDownloadedJavaVersion}`, codeProgress);
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

    const ltexLsVersion: string | null = this.getLatestLtexLsVersion(ltexLsVersions);
    return ((ltexLsVersion != null) ? Path.join(libDirPath, `ltex-ls-${ltexLsVersion}`) : null);
  }

  private static searchBundledJava(libDirPath: string): string | null {
    const javaPath: string = Path.join(libDirPath,
        `jdk-${DependencyManager._toBeDownloadedJavaVersion}-jre`);

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

  public async install(): Promise<boolean> {
    const libDirPath: string = Path.join(this._context.extensionPath, 'lib');
    const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');

    if (!Fs.existsSync(libDirPath)) {
      Logger.log(i18n('creating', libDirPath));
      Fs.mkdirSync(libDirPath);
    }

    try {
      // try 0: use ltex.ltexLs.path
      // try 1: use lib/ (don't download)
      // try 2: download and use lib/
      Logger.log('');
      this._ltexLsPath = DependencyManager.normalizePath(workspaceConfig.get('ltex-ls.path', ''));

      if (DependencyManager.isValidPath(this._ltexLsPath)) {
        Logger.log(i18n('ltexLtexLsPathSetTo', this._ltexLsPath));
      } else {
        Logger.log(i18n('ltexLtexLsPathNotSet'));
        Logger.log(i18n('searchingForLtexLsIn', libDirPath));
        this._ltexLsPath = this.searchBundledLtexLs(libDirPath);

        if (DependencyManager.isValidPath(this._ltexLsPath)) {
          Logger.log(i18n('ltexLsFoundIn', this._ltexLsPath));
        } else {
          Logger.log(i18n('couldNotFindVersionOfLtexLsIn', libDirPath));
          Logger.log(i18n('initiatingDownloadOfLtexLs'));
          await this.installLtexLs();
          this._ltexLsPath = this.searchBundledLtexLs(libDirPath);

          if (DependencyManager.isValidPath(this._ltexLsPath)) {
            Logger.log(i18n('ltexLsFoundIn', this._ltexLsPath));
          } else {
            throw Error(i18n('couldNotDownloadOrExtractLtexLs'));
          }
        }
      }
    } catch (e) {
      Logger.error(i18n('downloadOrExtractionOfLtexLsFailed'), e);
      Logger.log(i18n('youMightWantToTryOfflineInstallationSee',
          DependencyManager._offlineInstructionsUrl));
      Logger.showClientOutputChannel();
      return this.showOfflineInstallationInstructions(i18n('couldNotInstallLtexLs'));
    }

    const forceTrySystemWideJava: boolean = workspaceConfig.get('java.forceTrySystemWide', false);

    // try 0: use ltex.java.path
    // try 1: use lib/ (don't download)
    // try 2: download and use lib/
    for (let i: number = 0; i < 3; i++) {
      try {
        Logger.log('');
        this._javaPath = DependencyManager.normalizePath(workspaceConfig.get('java.path'));

        if (DependencyManager.isValidPath(this._javaPath)) {
          Logger.log(i18n('ltexJavaPathSetTo', this._javaPath));
        } else if (i == 0) {
          // On Mac, running the java command if Java is not installed will result in a popup
          // prompting to install Java. Therefore, skip trying the system-wide Java on Mac
          // by default (except when ltex.java.forceTrySystemWide is set to true).
          if ((process.platform == 'darwin') && !forceTrySystemWideJava) {
            Logger.log(i18n('skippingTryingSystemWideJava'));
            continue;
          }

          Logger.log(i18n('ltexJavaPathNotSet'));
        } else {
          Logger.log(i18n('searchingForJavaIn', libDirPath));
          this._javaPath = DependencyManager.searchBundledJava(libDirPath);

          if (DependencyManager.isValidPath(this._javaPath)) {
            Logger.log(i18n('javaFoundIn', this._javaPath));
          } else {
            Logger.log(i18n('couldNotFindJavaIn', libDirPath));

            if (i <= 1) {
              continue;
            } else {
              await this.installJava();
              this._javaPath = DependencyManager.searchBundledJava(libDirPath);

              if (DependencyManager.isValidPath(this._javaPath)) {
                Logger.log(i18n('javaFoundIn', this._javaPath));
              } else {
                Logger.log(i18n('downloadOrExtractionOfJavaFailed'));
              }
            }
          }
        }

        Logger.log(i18n('usingLtexLsFrom', this._ltexLsPath));

        if (DependencyManager.isValidPath(this._javaPath)) {
          Logger.log(i18n('usingJavaFrom', this._javaPath));
        } else {
          Logger.log(i18n('usingJavaFromPathOrJavaHome'));
        }

        if (await this.test()) {
          Logger.log('');
          return true;
        }
      } catch (e) {
        Logger.error(i18n('downloadExtractionRunOfJavaFailed', e));
      }
    }

    Logger.error(i18n('downloadExtractionRunOfJavaFailed'));
    Logger.log(i18n('youMightWantToTryOfflineInstallationSee',
        DependencyManager._offlineInstructionsUrl));
    Logger.showClientOutputChannel();
    return await this.showOfflineInstallationInstructions(i18n('couldNotDownloadExtractRunJava'));
  }

  private async showOfflineInstallationInstructions(message: string): Promise<boolean> {
    return new Promise((resolve: (value: boolean) => void) => {
      Code.window.showErrorMessage(`${message} ${i18n('youMightWantToTryOfflineInstallation')}`,
            i18n('tryAgain'), i18n('offlineInstructions')).then(
            async (selectedItem: string | undefined) => {
        if (selectedItem == i18n('tryAgain')) {
          resolve(await this.install());
          return;
        } else if (selectedItem == i18n('offlineInstructions')) {
          Code.env.openExternal(Code.Uri.parse(DependencyManager._offlineInstructionsUrl));
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

    Logger.log(i18n('testingLtexLs'));
    Logger.logExecutable(executable);
    const childProcess: ChildProcess.SpawnSyncReturns<string> = ChildProcess.spawnSync(
        executable.command, executable.args, executableOptions);
    let success: boolean = false;
    let ltexLsVersion: string = '';
    let javaVersion: string = '';
    let javaMajorVersion: number = -1;

    if ((childProcess.status == 0) && childProcess.stdout.includes('ltex-ls')) {
      try {
        const versionInfo: any = JSON.parse(childProcess.stdout);

        if (Object.prototype.hasOwnProperty.call(versionInfo, 'ltex-ls')) {
          ltexLsVersion = versionInfo['ltex-ls'];
        }

        if (Object.prototype.hasOwnProperty.call(versionInfo, 'java')) {
          const match: RegExpMatchArray | null = versionInfo['java'].match(/(\d+)(?:\.(\d+))?/);

          if ((match != null) && (match.length >= 3)) {
            javaVersion = versionInfo['java'];
            javaMajorVersion = parseInt(match[1]);
            if (javaMajorVersion == 1) javaMajorVersion = parseInt(match[2]);
          }
        }

        if ((ltexLsVersion.length > 0) && (javaVersion.length > 0)) {
          success = true;
        }
      } catch (e) {
        // don't throw error as debug info is printed below
      }
    }

    if (success) {
      Logger.log(i18n('testSuccessful'));
      this._ltexLsVersion = ltexLsVersion;
      this._javaVersion = javaVersion;
      return true;
    } else {
      Logger.error(i18n('testFailed'), childProcess.error);

      if ((childProcess.status != null) && (childProcess.status != 0)) {
        Logger.log(i18n('ltexLsTerminatedWithNonZeroExitCode', childProcess.status));
      } else if (childProcess.signal != null) {
        Logger.log(i18n('ltexLsTerminatedDueToSignal', childProcess.signal));
      } else {
        Logger.log(i18n('ltexLsDidNotPrintExpectVersionInformation'));
      }

      Logger.log(i18n('stdoutOfLtexLs'));
      Logger.log(childProcess.stdout);
      Logger.log(i18n('stderrOfLtexLs'));
      Logger.log(childProcess.stderr);
      return false;
    }
  }

  public async getLtexLsExecutable(): Promise<CodeLanguageClient.Executable> {
    if (!DependencyManager.isValidPath(this._ltexLsPath)) {
      return Promise.reject(new Error(i18n('couldNotGetLtexLsExecutable')));
    }

    const env: NodeJS.ProcessEnv = {};

    for (const name in process.env) {
      if (Object.prototype.hasOwnProperty.call(process.env, name)) {
        env[name] = process.env[name];
      }
    }

    if (DependencyManager.isValidPath(this._javaPath)) {
      env['JAVA_HOME'] = this._javaPath!;
    } else if ((env['LTEX_JAVA_HOME'] != null)
          && DependencyManager.isValidPath(env['LTEX_JAVA_HOME'])) {
      env['JAVA_HOME'] = DependencyManager.normalizePath(env['LTEX_JAVA_HOME'])!;
    }

    const isWindows: boolean = (process.platform === 'win32');
    const ltexLsScriptPath: string = Path.join(
        this._ltexLsPath!, 'bin', (isWindows ? 'ltex-ls.bat' : 'ltex-ls'));

    const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
    const initialJavaHeapSize: number | undefined = workspaceConfig.get('java.initialHeapSize');
    const maximumJavaHeapSize: number | undefined = workspaceConfig.get('java.maximumHeapSize');
    const javaArguments: string[] = [];

    if (initialJavaHeapSize != null) javaArguments.push(`-Xms${initialJavaHeapSize}m`);
    if (maximumJavaHeapSize != null) javaArguments.push(`-Xmx${maximumJavaHeapSize}m`);
    env['JAVA_OPTS'] = javaArguments.join(' ');

    return {command: ltexLsScriptPath, args: [], options: {'env': env}};
  }

  public get vscodeLtexVersion(): string {
    return this._vscodeLtexVersion;
  }

  public get ltexLsVersion(): string | null {
    return this._ltexLsVersion;
  }

  public get javaVersion(): string | null {
    return this._javaVersion;
  }
}
