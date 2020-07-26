/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';
import * as ChildProcess from 'child_process';
import extractZip from 'extract-zip';
import * as Fs from 'fs';
import * as Http from 'http';
import * as Https from 'https';
import * as Path from 'path';
import * as SemVer from 'semver';
import * as Tar from 'tar';
import * as Url from 'url';

import {i18n} from './I18n';
import Logger from './Logger';
import ProgressStack from './ProgressStack';

export default class Dependencies {
  private _context: Code.ExtensionContext;
  private _ltexVersion: string;
  private _ltexLsPath: string | null = null;
  private _javaPath: string | null = null;
  private _ltexLsVersion: string | null = null;
  private _javaVersion: string | null = null;

  private static readonly _offlineInstructionsUrl: string = 'https://valentjn.github.io/' +
      'vscode-ltex/docs/installation-how-to-use.html#offline-installation';
  private static readonly _javaVersion: string = '11.0.8+10';

  public constructor(context: Code.ExtensionContext) {
    this._context = context;
    const ltexExtension: Code.Extension<any> | undefined =
        Code.extensions.getExtension('valentjn.vscode-ltex');
    if (ltexExtension == null) throw new Error(i18n('couldNotGetLtexVersion'));
    this._ltexVersion = ltexExtension.packageJSON.version;
  }

  private static isValidPath(path: string | null): boolean {
    return ((path != null) && (path.length > 0));
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
          error = new Error(i18n('requestFailedWithStatusCode', response.statusCode));
        } else if ((contentType != null) && !/^application\/json/.test(contentType)) {
          error = new Error(i18n('requestFailedWithContentType', contentType));
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
            error.message += ` ${i18n('responseBody', rawData)}`;
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
            reject(new Error(i18n('receivedRedirectionStatusCodeWithoutLocationHeader',
                response.statusCode)));
            return;
          }

          Logger.log(i18n('redirectedTo', response.headers.location));
          Dependencies.downloadFile(response.headers.location, path, codeProgress)
              .then(resolve).catch(reject);
          return;
        } else if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(i18n('requestFailedWithStatusCode', response.statusCode)));
          return;
        }

        const totalBytes: number = ((response.headers['content-length'] != null) ?
            parseInt(response.headers['content-length']) : 0);
        const totalMb: number = Math.round(totalBytes / 1e6);
        let downloadedBytes: number = 0;
        let lastTaskNameUpdate: number = Date.now();
        codeProgress.updateTask(0, ((totalBytes > 0) ?
            `${origTaskName}  0MB/${totalMb}MB` : origTaskName));

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
    codeProgress.startTask(0.1, i18n('downloading', name));
    const url: Url.UrlWithStringQuery = Url.parse(urlStr);
    if (url.pathname == null) throw new Error(i18n('couldNotGetPathNameFromUrl', urlStr));
    const archiveName: string = Path.basename(url.pathname);
    const archiveType: string = ((Path.extname(archiveName) == '.zip') ? 'zip' : 'tar.gz');
    const tmpDirPath: string = Fs.mkdtempSync(Path.join(this._context.extensionPath, 'tmp-'));
    const archivePath: string = Path.join(tmpDirPath, archiveName);
    codeProgress.finishTask();

    codeProgress.startTask(0.8, i18n('downloading', name));
    Logger.log(i18n('downloadingFromTo', name, urlStr, archivePath));
    await Dependencies.downloadFile(urlStr, archivePath, codeProgress);
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

      codeProgress.startTask(0.1, i18n('preparingDownloadOfLtexLs'));
      const jsonUrl: string = 'https://api.github.com/repos/valentjn/ltex-ls/releases';
      Logger.log(i18n('fetchingListOfLtexLsReleases', jsonUrl));
      const jsonData: any = await Dependencies.doJsonRequest(jsonUrl);

      const ltexLsVersions: string[] = [];

      jsonData.forEach((release: any) => {
        ltexLsVersions.push(release.tag_name);
      });

      const ltexLsVersion: string | null = this.getLatestCompatibleLtexLsVersion(ltexLsVersions);

      if (ltexLsVersion == null) {
        throw Error(i18n('couldNotFindCompatibleVersionOfLtexLsOnGitHub',
            this._ltexVersion, JSON.stringify(ltexLsVersions)));
      }

      Logger.log(i18n('latestCompatibleReleaseIsLtexLsVersion', ltexLsVersion));
      const ltexLsUrl: string = 'https://github.com/valentjn/ltex-ls/releases/download/' +
          `${ltexLsVersion}/ltex-ls-${ltexLsVersion}.tar.gz`;

      codeProgress.finishTask();

      codeProgress.startTask(0.9, i18n('downloadingAndExtractingLtexLsVersion', ltexLsVersion));
      await this.installDependency(ltexLsUrl, `ltex-ls ${ltexLsVersion}`, codeProgress);
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

      const javaArchiveName: string = `OpenJDK11U-jre_${arch}_${platform}_hotspot_` +
          `${Dependencies._javaVersion.replace('+', '_')}.${javaArchiveType}`;
      Logger.log(i18n('guessedAdoptOpenJdkArchiveName', javaArchiveName));
      const javaUrl: string = 'https://github.com/AdoptOpenJDK/openjdk11-binaries/releases/' +
          `download/jdk-${encodeURIComponent(Dependencies._javaVersion)}/${javaArchiveName}`;

      await this.installDependency(javaUrl, `Java ${Dependencies._javaVersion}`, codeProgress);
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
    const javaPath: string = Path.join(libDirPath, `jdk-${Dependencies._javaVersion}-jre`);

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
      Logger.log(i18n('creating', libDirPath));
      Fs.mkdirSync(libDirPath);
    }

    try {
      // try 0: use ltex.ltexLs.path
      // try 1: use lib/ (don't download)
      // try 2: download and use lib/
      Logger.log('');
      this._ltexLsPath = workspaceConfig.get('ltex-ls.path', '');

      if (Dependencies.isValidPath(this._ltexLsPath)) {
        Logger.log(i18n('ltexLtexLsPathSetTo', this._ltexLsPath));
      } else {
        Logger.log(i18n('ltexLtexLsPathNotSet'));
        Logger.log(i18n('searchingForLtexLsIn', libDirPath));
        this._ltexLsPath = this.searchBundledLtexLs(libDirPath);

        if (Dependencies.isValidPath(this._ltexLsPath)) {
          Logger.log(i18n('ltexLsFoundIn', this._ltexLsPath));
        } else {
          Logger.log(i18n('couldNotFindCompatibleVersionOfLtexLsIn', libDirPath));
          Logger.log(i18n('initiatingDownloadOfLtexLs'));
          await this.installLtexLs();
          this._ltexLsPath = this.searchBundledLtexLs(libDirPath);

          if (Dependencies.isValidPath(this._ltexLsPath)) {
            Logger.log(i18n('ltexLsFoundIn', this._ltexLsPath));
          } else {
            throw Error(i18n('couldNotDownloadOrExtractLtexLs'));
          }
        }
      }
    } catch (e) {
      Logger.error(i18n('downloadOrExtractionOfLtexLsFailed'), e);
      Logger.log(i18n('youMightWantToTryOfflineInstallationSee',
          Dependencies._offlineInstructionsUrl));
      Logger.showClientOutputChannel();
      return this.showOfflineInstallationInstructions(i18n('couldNotInstallLtexLs'));
    }

    // try 0: use ltex.java.path, Java 11+ only
    // try 1: use lib/ (don't download), Java 11+ only
    // try 2: download and use lib/, Java 11+ only
    // try 3: use ltex.java.path
    // try 4: use lib/ (don't download)
    // try 5: download and use lib/
    for (let i: number = 0; i < 6; i++) {
      try {
        Logger.log('');
        this._javaPath = Dependencies.getRenamedSetting(workspaceConfig, 'java.path', 'javaHome');

        if (Dependencies.isValidPath(this._javaPath)) {
          Logger.log(i18n('ltexJavaPathSetTo', this._javaPath));
        } else if (i % 3 == 0) {
          Logger.log(i18n('ltexJavaPathNotSet'));
        } else {
          Logger.log(i18n('searchingForJavaIn', libDirPath));
          this._javaPath = Dependencies.searchBundledJava(libDirPath);

          if (Dependencies.isValidPath(this._javaPath)) {
            Logger.log(i18n('javaFoundIn', this._javaPath));
          } else {
            Logger.log(i18n('couldNotFindJavaIn', libDirPath));

            if (i % 3 <= 1) {
              continue;
            } else {
              await this.installJava();
              this._javaPath = Dependencies.searchBundledJava(libDirPath);

              if (Dependencies.isValidPath(this._javaPath)) {
                Logger.log(i18n('javaFoundIn', this._javaPath));
              } else {
                Logger.log(i18n('downloadOrExtractionOfJavaFailed'));
              }
            }
          }
        }

        Logger.log(i18n('usingLtexLsFrom', this._ltexLsPath));

        if (Dependencies.isValidPath(this._javaPath)) {
          Logger.log(i18n('usingJavaFrom', this._javaPath));
        } else {
          Logger.log(i18n('usingJavaFromPathOrJavaHome'));
        }

        const requireJava11: boolean = (i < 3);

        if (await this.test(requireJava11)) {
          Logger.log('');
          return true;
        }
      } catch (e) {
        Logger.error(i18n('downloadExtractionRunOfJavaFailed', e));
      }
    }

    Logger.error(i18n('downloadExtractionRunOfJavaFailed'));
    Logger.log(i18n('youMightWantToTryOfflineInstallationSee',
        Dependencies._offlineInstructionsUrl));
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
          Code.env.openExternal(Code.Uri.parse(Dependencies._offlineInstructionsUrl));
        }

        resolve(false);
      });
    });
  }

  private async test(requireJava11: boolean): Promise<boolean> {
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

    if (!success) {
      Logger.log(i18n('testFailed'));
      Logger.log(i18n('exitCodeOfLtexLs', childProcess.status));
      Logger.log(i18n('stdoutOfLtexLs'));
      Logger.log(childProcess.stdout);
      Logger.log(i18n('stderrOfLtexLs'));
      Logger.log(childProcess.stderr);
      return false;
    } else if (javaMajorVersion >= 11) {
      Logger.log(i18n('testSuccessful'));
      this._ltexLsVersion = ltexLsVersion;
      this._javaVersion = javaVersion;
      return true;
    } else if (requireJava11) {
      Logger.log(i18n('testFailedDueToTooOldJava', javaMajorVersion, javaVersion));
      return false;
    } else {
      Logger.log(i18n('testSuccessfulButJavaIsTooOld', javaMajorVersion, javaVersion));
      Code.window.showWarningMessage(i18n('couldNotDownloadOrExtractJava11', javaMajorVersion,
          javaVersion));
      this._ltexLsVersion = ltexLsVersion;
      this._javaVersion = javaVersion;
      return true;
    }
  }

  public async getLtexLsExecutable(): Promise<CodeLanguageClient.Executable> {
    if (!Dependencies.isValidPath(this._ltexLsPath)) {
      return Promise.reject(new Error(i18n('couldNotGetLtexLsExecutable')));
    }

    const env: NodeJS.ProcessEnv = {};

    for (const name in process.env) {
      if (Object.prototype.hasOwnProperty.call(process.env, name)) {
        env[name] = process.env[name];
      }
    }

    if (Dependencies.isValidPath(this._javaPath)) {
      env['JAVA_HOME'] = this._javaPath!;
    } else if ((env['LTEX_JAVA_HOME'] != null) && Dependencies.isValidPath(env['LTEX_JAVA_HOME'])) {
      env['JAVA_HOME'] = env['LTEX_JAVA_HOME'];
    }

    const isWindows: boolean = (process.platform === 'win32');
    const ltexLsScriptPath: string = Path.join(
        this._ltexLsPath!, 'bin', (isWindows ? 'ltex-ls.bat' : 'ltex-ls'));

    const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
    const initialJavaHeapSize: number = Dependencies.getRenamedSetting(workspaceConfig,
        'java.initialHeapSize', 'performance.initialJavaHeapSize');
    const maximumJavaHeapSize: number = Dependencies.getRenamedSetting(workspaceConfig,
        'java.maximumHeapSize', 'performance.maximumJavaHeapSize');
    env['JAVA_OPTS'] = `-Xms${initialJavaHeapSize}m -Xmx${maximumJavaHeapSize}m`;

    return {command: ltexLsScriptPath, args: [], options: {'env': env}};
  }

  public get ltexLsVersion(): string | null {
    return this._ltexLsVersion;
  }

  public get javaVersion(): string | null {
    return this._javaVersion;
  }
}
