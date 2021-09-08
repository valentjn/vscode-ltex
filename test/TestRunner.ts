/* Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// #if TARGET == 'vscode'
import * as ChildProcess from 'child_process';
import * as CodeTest from 'vscode-test';
import * as CodeTestRunTest from 'vscode-test/out/runTest';
import * as Fs from 'fs';
import * as Path from 'path';
import * as Rimraf from 'rimraf';

import {version as ltexVersion} from '../package.json';

let ltexDirPath: string;
let vscodeExecutablePath: string;
let cliPath: string;

const originalPath: string | undefined = process.env['PATH'];
const originalJavaHome: string | undefined = process.env['JAVA_HOME'];

async function runTestIteration(testIteration: number): Promise<void> {
  const useOfflinePackage: boolean = ((testIteration & 1) != 0);

  console.log('');
  console.log(`Running test iteration ${testIteration}...`);
  console.log('');
  console.log(`useOfflinePackage = ${useOfflinePackage}`);
  console.log('');

  const tmpDirPrefix: string = Path.join(ltexDirPath, 'tmp-');
  console.log(`Creating temporary directory with prefix '${tmpDirPrefix}'...`);
  const tmpDirPath: string = Fs.mkdtempSync(tmpDirPrefix);
  console.log(`Created temporary directory '${tmpDirPath}'.`);

  const ltexLibDirPath: string = Path.join(ltexDirPath, 'lib');
  const gitCleanArgs: string[] = ['-C', ltexDirPath, 'clean', '-f', '-x', ltexLibDirPath];
  console.log(`Cleaning '${ltexLibDirPath}'...`);
  const childProcess: ChildProcess.SpawnSyncReturns<string> = ChildProcess.spawnSync(
      'git', gitCleanArgs, {encoding: 'utf-8', timeout: 10000});

  if (childProcess.status != 0) {
    throw new Error(`Could not clean '${ltexLibDirPath}'. `
        + `Exit code: ${childProcess.status}. stdout: '${childProcess.stdout}'. `
        + `stderr: '${childProcess.stderr}'.`);
  }

  try {
    const userDataDirPath: string = Path.join(tmpDirPath, 'user');
    const extensionsDirPath: string = Path.join(tmpDirPath, 'extensions');
    const workspaceDirPath: string = Path.join(tmpDirPath, 'workspace');
    Fs.mkdirSync(workspaceDirPath);

    const cliArgs: string[] = [
          '--user-data-dir', userDataDirPath,
          '--extensions-dir', extensionsDirPath,
          '--install-extension', 'james-yu.latex-workshop',
        ];

    if (useOfflinePackage) {
      let platform: string = 'linux';
      if (process.platform == 'darwin') platform = 'mac';
      else if (process.platform == 'win32') platform = 'windows';
      cliArgs.push('--install-extension', Path.join(ltexDirPath,
          `vscode-ltex-${ltexVersion}-offline-${platform}-x64.vsix`));
    }

    console.log('Calling Code CLI for extension installation...');
    const childProcess: ChildProcess.SpawnSyncReturns<string> = ChildProcess.spawnSync(
        cliPath, cliArgs, {encoding: 'utf-8', stdio: 'inherit'});

    if (childProcess.status != 0) throw new Error('Could not install extensions.');

    if (originalPath != null) {
      process.env['PATH'] = originalPath;
    } else if (process.env['PATH'] != null) {
      delete process.env['PATH'];
    }

    if (originalJavaHome != null) {
      process.env['JAVA_HOME'] = originalJavaHome;
    } else if (process.env['JAVA_HOME'] != null) {
      delete process.env['JAVA_HOME'];
    }

    if (useOfflinePackage) {
      console.log(`Removing '${ltexLibDirPath}'...`);
      Rimraf.sync(ltexLibDirPath);
      const ltexOfflineLibDirPath: string =
          Path.join(extensionsDirPath, `valentjn.vscode-ltex-${ltexVersion}`, 'lib');
      console.log(`Moving '${ltexOfflineLibDirPath}' to '${ltexLibDirPath}'...`);
      Fs.renameSync(ltexOfflineLibDirPath, ltexLibDirPath);
    }

    const testOptions: CodeTestRunTest.TestOptions = {
          vscodeExecutablePath: vscodeExecutablePath,
          launchArgs: [
            '--user-data-dir', userDataDirPath,
            '--extensions-dir', extensionsDirPath,
            workspaceDirPath,
          ],
          extensionDevelopmentPath: ltexDirPath,
          extensionTestsPath: Path.join(__dirname, './index'),
        };

    console.log('Running tests...');
    const exitCode: number = await CodeTest.runTests(testOptions);

    if (exitCode != 0) throw new Error(`Test returned exit code ${exitCode}.`);
  } finally {
    if (tmpDirPath != null) {
      try {
        Rimraf.sync(tmpDirPath);
      } catch {
        console.log(`Could not delete temporary directory '${tmpDirPath}', leaving on disk.`);
      }
    }
  }

  return Promise.resolve();
}

async function main(): Promise<void> {
  let fastMode: boolean = false;
  let onlyTestIteration: number | null = null;

  for (let i: number = 0; i < process.argv.length; i++) {
    const arg: string = process.argv[i];

    if (arg == '--fast') {
      fastMode = true;
    } else if ((arg == '--iteration') && (i < process.argv.length - 1)) {
      onlyTestIteration = parseInt(process.argv[i + 1]);
      i++;
    }
  }

  ltexDirPath = Path.resolve(__dirname, '..', '..');
  const codeVersion: string = '1.57.1';
  let codePlatform: string | undefined;

  console.log('Downloading and installing VS Code...');
  vscodeExecutablePath = await CodeTest.downloadAndUnzipVSCode(codeVersion, codePlatform);

  console.log('Resolving CLI path to VS Code...');
  cliPath = CodeTest.resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath);

  for (let testIteration: number = 0; testIteration < 2; testIteration++) {
    if (fastMode && (testIteration != 1)) continue;
    if ((onlyTestIteration != null) && (testIteration != onlyTestIteration)) continue;
    await runTestIteration(testIteration);
  }

  return Promise.resolve();
}

main();
// #endif
