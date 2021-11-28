/* Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// #if TARGET == 'vscode'
import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient/node';
// #elseif TARGET == 'coc.nvim'
// import * as Code from 'coc.nvim';
// import CodeLanguageClient = Code;
// #endif
import * as ChildProcess from 'child_process';
import * as Crypto from 'crypto';
import extractZip from 'extract-zip';
import * as Fs from 'fs';
import * as Http from 'http';
import * as Https from 'https';
import * as Net from 'net';
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

  private static readonly _toBeDownloadedLtexLsTag: string =
      '15.2.0';
  private static readonly _toBeDownloadedLtexLsVersion: string =
      '15.2.0';
  private static readonly _toBeDownloadedLtexLsHashDigests: {[fileName: string]: string} = {
    'ltex-ls-15.2.0-linux-x64.tar.gz':
      '04d7e2ba6ef0ff91f84983554e39181ada59518f7b6268e559bed6efae0827fc',
    'ltex-ls-15.2.0-mac-x64.tar.gz':
      'd89b547722f165ca2343962065cbe7ee4a832316825b04266d1d2db3e46487b3',
    'ltex-ls-15.2.0-windows-x64.zip':
      '66a8449840fd09d7cde27c1e23ecfe94c0cbe6622769c19d36b007965c0c0124',
  };

  public constructor(context: Code.ExtensionContext) {
    this._context = context;
    // deprecated: replace with context.extension starting with VS Code 1.55.0
    const vscodeLtexExtension: Code.Extension<any> | undefined =
        // #if TARGET == 'vscode'
        Code.extensions.getExtension('valentjn.vscode-ltex');
        // #elseif TARGET == 'coc.nvim'
        // Code.extensions.all.find(
          // (extension: Code.Extension<Code.ExtensionApi>) => extension.id == 'coc-ltex');
        // #endif
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
    const url: Url.URL = new Url.URL(urlStr);
    return {
          hostname: url.hostname,
          path: url.pathname + url.search,
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
    const url: Url.URL = new Url.URL(urlStr);
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
        } catch (e: unknown) {
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
    } catch (e: unknown) {
      Logger.warn(i18n('couldNotDeleteLeavingTemporaryDirectoryOnDisk', tmpDirPath), e);
    }

    codeProgress.finishTask();

    return Promise.resolve();
  }

  private async installLtexLs(): Promise<void> {
    const progressOptions: Code.ProgressOptions = {
          title: 'LTeX',
          // #if TARGET == 'vscode'
          location: Code.ProgressLocation.Notification,
          // #endif
          cancellable: false,
        };

    return Code.window.withProgress(progressOptions,
          async (progress: Code.Progress<{increment?: number; message?: string}>):
            Promise<void> => {
      const codeProgress: ProgressStack = new ProgressStack(
          i18n('downloadingAndExtractingLtexLs'), progress);

      let platform: string = 'linux';
      const arch: string = 'x64';
      let archiveType: string = 'tar.gz';

      if (process.platform == 'win32') {
        platform = 'windows';
        archiveType = 'zip';
      } else if (process.platform == 'darwin') {
        platform = 'mac';
      }

      const ltexLsArchiveName: string = 'ltex-ls-'
          + `${DependencyManager._toBeDownloadedLtexLsVersion}-${platform}-${arch}.${archiveType}`;
      const ltexLsUrl: string = 'https://github.com/valentjn/ltex-ls/releases/download/'
          + `${DependencyManager._toBeDownloadedLtexLsTag}/${ltexLsArchiveName}`;
      const ltexLsHashDigest: string =
          DependencyManager._toBeDownloadedLtexLsHashDigests[ltexLsArchiveName];

      await this.installDependency(ltexLsUrl, ltexLsHashDigest,
          `ltex-ls ${DependencyManager._toBeDownloadedLtexLsVersion}`, codeProgress);
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

  public async install(): Promise<boolean> {
    const libDirPath: string = Path.join(this._context.extensionPath, 'lib');
    const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');

    if (!Fs.existsSync(libDirPath)) {
      Logger.log(i18n('creating', libDirPath));
      Fs.mkdirSync(libDirPath);
    }

    try {
      // try 0: use ltex.ltex-ls.path
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
    } catch (e: unknown) {
      Logger.error(i18n('downloadOrExtractionOfLtexLsFailed'), e);
      Logger.log(i18n('youMightWantToTryOfflineInstallationSee',
          DependencyManager._offlineInstructionsUrl));
      Logger.showClientOutputChannel();
      return this.showOfflineInstallationInstructions(i18n('couldNotInstallLtexLs'));
    }

    Logger.log('');
    Logger.log(i18n('usingLtexLsFrom', this._ltexLsPath));
    this._javaPath = DependencyManager.normalizePath(workspaceConfig.get('java.path'));

    if (DependencyManager.isValidPath(this._javaPath)) {
      Logger.log(i18n('usingJavaFrom', this._javaPath));
    } else {
      Logger.log(i18n('usingJavaBundledWithLtexLs'));
    }

    if (await this.test()) {
      Logger.log('');
      return true;
    } else {
      Logger.log(i18n('youMightWantToTryOfflineInstallationSee',
          DependencyManager._offlineInstructionsUrl));
      Logger.showClientOutputChannel();
      return await this.showOfflineInstallationInstructions(i18n('couldNotRunLtexLs'));
    }
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
          // #if TARGET == 'vscode'
          Code.env.openExternal(Code.Uri.parse(DependencyManager._offlineInstructionsUrl));
          // #elseif TARGET == 'coc.nvim'
          // Code.workspace.openResource(
              // Code.Uri.parse(DependencyManager._offlineInstructionsUrl).toString());
          // #endif
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
          timeout: 15000,
        };

    if (executable.options != null) {
      executableOptions.cwd = executable.options.cwd;
      executableOptions.env = executable.options.env;
    }

    Logger.log(i18n('testingLtexLs'));
    Logger.logExecutable(executable);

    let childProcess: ChildProcess.SpawnSyncReturns<string> | null = null;

    try {
      childProcess = ChildProcess.spawnSync(executable.command, executable.args, executableOptions);
    } catch (e: unknown) {
      Logger.error(i18n('testFailed'), e);
      return Promise.resolve(false);
    }

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
      } catch (e: unknown) {
        // don't throw error as debug info is printed below
      }
    }

    if (success) {
      Logger.log(i18n('testSuccessful'));
      this._ltexLsVersion = ltexLsVersion;
      this._javaVersion = javaVersion;
      return Promise.resolve(true);
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
      return Promise.resolve(false);
    }
  }

  public async getLtexLsExecutable(): Promise<CodeLanguageClient.Executable> {
    if (!DependencyManager.isValidPath(this._ltexLsPath)) {
      return Promise.reject(new Error(i18n('couldNotGetLtexLsExecutable')));
    }

    const env: NodeJS.ProcessEnv = {};

    for (const name in process.env) {
      if ((Object.prototype.hasOwnProperty.call(process.env, name)) && (name != 'JAVA_HOME')) {
        env[name] = process.env[name];
      }
    }

    if (DependencyManager.isValidPath(this._javaPath)) {
      env['JAVA_HOME'] = this._javaPath!;
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

  public static getDebugServerOptions(): CodeLanguageClient.ServerOptions | null {
    const executableOptions: ChildProcess.SpawnSyncOptionsWithStringEncoding = {
          encoding: 'utf-8',
          timeout: 15000,
        };
    const childProcess: ChildProcess.SpawnSyncReturns<string> = ((process.platform == 'win32')
        ? ChildProcess.spawnSync('wmic', ['process', 'list', 'FULL'], executableOptions)
        : ChildProcess.spawnSync('ps', ['-A', '-o', 'args'], executableOptions));
    if (childProcess.status != 0) return null;
    const output: string = childProcess.stdout;

    const matchPos: number = output.search(
        /LtexLanguageServerLauncher.*--server-type(?: +|=)tcpSocket/);
    if (matchPos == -1) return null;
    const startPos: number = output.lastIndexOf('\n', matchPos);
    const endPos: number = output.indexOf('\n', matchPos);
    const line: string = output.substring(((startPos != -1) ? startPos : 0),
        ((endPos != -1) ? endPos : output.length));

    const match: RegExpMatchArray | null = line.match(/--port(?: +|=)([0-9]+)/);
    if (match == null) return null;
    const port: number = parseInt(match[1]);
    if (port == 0) return null;

    const socket: Net.Socket = new Net.Socket();
    socket.connect(port, 'localhost');

    return () => {
      return Promise.resolve({writer: socket, reader: socket});
    };
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
