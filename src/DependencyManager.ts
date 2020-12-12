/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';
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

  private static readonly _toBeDownloadedLtexLsVersion: string = '8.1.1';
  private static readonly _toBeDownloadedLtexLsHashDigest: string =
      '395683ae72af006f516d7de05c6f3584da0ef5b1d29102c59c49291619a7e279';

  private static readonly _toBeDownloadedJavaVersion: string = '11.0.9+11';
  private static readonly _toBeDownloadedJavaHashDigests: {[fileName: string]: string} = {
    'OpenJDK11U-jre_aarch64_linux_hotspot_11.0.9_11.tar.gz':
      '69de813552b33859dc28034de69d5c3cedc13480cba4e9b2a29a5752ad8cbbaa',
    'OpenJDK11U-jre_arm_linux_hotspot_11.0.9_11.tar.gz':
      '8e52de3c7a24edb74e423631fa90a09f7af3193aa9e6e4837b337192669530b0',
    'OpenJDK11U-jre_ppc64_aix_hotspot_11.0.9_11.tar.gz':
      'b57ade07a0d591db113094d80a13a6b3a046dfe27ea73dcd4c804e4beef61b64',
    'OpenJDK11U-jre_ppc64le_linux_hotspot_11.0.9_11.tar.gz':
      '0af961d70523d95e4b42cc74646653294e8d9eb51e9e7538f8e8c4b61a4d1ac5',
    'OpenJDK11U-jre_s390x_linux_hotspot_11.0.9_11.tar.gz':
      'aab4b30307da51cdbcd266a35bf21e7cd2c981fc472441bec7a7b316c45fc86c',
    'OpenJDK11U-jre_x64_linux_hotspot_11.0.9_11.tar.gz':
      '57e0e54850487e68f9f99f3678f9a829568e33baa662f4b3a926645b258a3d1c',
    'OpenJDK11U-jre_x64_mac_hotspot_11.0.9_11.tar.gz':
      'd750ee42014cf84611c6602edce3641ad271d005b271e0cf91998dad2d41ff88',
    'OpenJDK11U-jre_x64_windows_hotspot_11.0.9_11.zip':
      'a78c74cf895e46e66beb215b2b5871698ac9872a2c28facf76f9c12849d562cf',
    'OpenJDK11U-jre_x86-32_windows_hotspot_11.0.9_11.zip':
      '29614c7df6fac8cb2613b5e5d98bc055bafd77ff587fd21dd3cde4d12b9e2938',
  };

  public constructor(context: Code.ExtensionContext) {
    this._context = context;
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
          const match: RegExpMatchArray | null = versionInfo['java'].match(/(\d+)\.(\d+)/);

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
