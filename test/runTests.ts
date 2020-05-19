import * as ChildProcess from 'child_process';
import * as CodeTest from 'vscode-test';
import * as CodeTestRunTest from 'vscode-test/out/runTest';
import * as Fs from 'fs';
import * as Path from 'path';
import * as Rimraf from 'rimraf';

import {version as ltexVersion} from '../package.json';

async function main(): Promise<void> {
  const ltexDirPath: string = Path.resolve(__dirname, '..', '..');
  let codeVersion: string = 'stable';
  let codePlatform: string | undefined;

  if (process.platform == 'win32') {
    codeVersion = '1.35.1';
    codePlatform = 'win32-x64-archive';
  }

  console.log('Downloading and installing VS Code...');
  const vscodeExecutablePath: string = await CodeTest.downloadAndUnzipVSCode(
      codeVersion, codePlatform);

  console.log('Resolving CLI path to VS Code...');
  const cliPath: string = CodeTest.resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath);

  for (let i: number = 0; i < 2; i++) {
    let exitCode: number = 1;
    let tmpDirPath: string | undefined;

    try {
      const tmpDirPrefix: string = Path.join(Path.dirname(vscodeExecutablePath), 'tmp-');
      console.log(`Creating temporary directory with prefix '${tmpDirPrefix}'...`);
      tmpDirPath = Fs.mkdtempSync(tmpDirPrefix);
      console.log(`Created temporary directory '${tmpDirPath}'.`);

      const userDataDirPath: string = Path.join(tmpDirPath, 'user');
      const extensionsDirPath: string = Path.join(tmpDirPath, 'extensions');
      const cliArgs: string[] = [
            '--user-data-dir', userDataDirPath,
            '--extensions-dir', extensionsDirPath,
            '--install-extension', 'james-yu.latex-workshop',
          ];

      if (i == 1) {
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

      const env: NodeJS.ProcessEnv = {};

      for (const name in process.env) {
        if (Object.prototype.hasOwnProperty.call(process.env, name)) {
          env[name] = process.env[name];
        }
      }

      env['LTEX_DEBUG'] = '1';

      const testOptions: CodeTestRunTest.TestOptions = {
            vscodeExecutablePath: vscodeExecutablePath,
            launchArgs: [
              '--user-data-dir', userDataDirPath,
              '--extensions-dir', extensionsDirPath,
            ],
            extensionDevelopmentPath: ltexDirPath,
            extensionTestsPath: Path.join(__dirname, './index'),
            extensionTestsEnv: env,
          };

      console.log('Running tests...');
      exitCode = await CodeTest.runTests(testOptions);
    } catch (e) {
      console.error(`Failed to run tests: '${e}'`);
    } finally {
      if (tmpDirPath != null) Rimraf.sync(tmpDirPath);
    }

    if (exitCode != 0) process.exit(exitCode);
  }
}

main();
