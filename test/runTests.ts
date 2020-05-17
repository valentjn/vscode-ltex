import * as ChildProcess from 'child_process';
import * as CodeTest from 'vscode-test';
import * as Fs from 'fs';
import * as Path from 'path';
import * as Rimraf from 'rimraf';

import {version as ltexVersion} from '../package.json';

async function main(): Promise<void> {
  let exitCode: number = 1;
  let tmpDirPath: string | undefined;

  try {
    console.log('Downloading and installing VS Code...');
    const vscodeExecutablePath: string = await CodeTest.downloadAndUnzipVSCode('stable');

    console.log('Downloading and installing VS Code...');
    const cliPath: string = CodeTest.resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath);

    const tmpDirPrefix: string = Path.join(Path.dirname(vscodeExecutablePath), 'tmp-');
    console.log(`Creating temporary directory with prefix '${tmpDirPrefix}'...`);
    tmpDirPath = Fs.mkdtempSync(tmpDirPrefix);
    console.log(`Created temporary directory '${tmpDirPath}'.`);

    const userDataDirPath: string = Path.join(tmpDirPath, 'user');
    const extensionsDirPath: string = Path.join(tmpDirPath, 'extensions');

    console.log('Installing extensions...');
    const childProcess: ChildProcess.SpawnSyncReturns<string> = ChildProcess.spawnSync(cliPath, [
          '--user-data-dir', userDataDirPath,
          '--extensions-dir', extensionsDirPath,
          '--install-extension', 'james-yu.latex-workshop',
          '--install-extension', Path.join(__dirname, '..', '..',
            `vscode-ltex-${ltexVersion}.vsix`),
        ], {
          encoding: 'utf-8',
          stdio: 'inherit',
        });

    if (childProcess.status != 0) throw new Error('Could not install extensions.');

    console.log('Running tests...');
    exitCode = await CodeTest.runTests({
          vscodeExecutablePath: vscodeExecutablePath,
          launchArgs: [
            '--user-data-dir', userDataDirPath,
            '--extensions-dir', extensionsDirPath,
          ],
          extensionDevelopmentPath: Path.join(__dirname, '..', '..'),
          extensionTestsPath: Path.join(__dirname, './index'),
        });
  } catch (e) {
    console.error('Failed to run tests');
    console.error(`Error name: ${e.name}`);
    console.error(`Error message: ${e.message}`);
    console.error(`Error stack: ${e.stack}`);
  } finally {
    if (tmpDirPath != null) Rimraf.sync(tmpDirPath);
  }

  process.exit(exitCode);
}

main();
