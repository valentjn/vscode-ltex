import * as ChildProcess from 'child_process';
import * as CodeTest from 'vscode-test';
import * as Fs from 'fs';
import * as Path from 'path';
import * as Rimraf from 'rimraf';

import {version as ltexVersion} from '../package.json';

async function main(): Promise<void> {
  let tmpDirPath: string | undefined;

  try {
    const vscodeExecutablePath: string = await CodeTest.downloadAndUnzipVSCode('stable');
    const cliPath: string = CodeTest.resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath);
    tmpDirPath = Fs.mkdtempSync(Path.join(Path.dirname(vscodeExecutablePath), 'tmp-'));
    const userDataDirPath: string = Path.join(tmpDirPath, 'user');
    const extensionsDirPath: string = Path.join(tmpDirPath, 'extensions');

    const process: ChildProcess.SpawnSyncReturns<string> = ChildProcess.spawnSync(cliPath, [
          '--user-data-dir', userDataDirPath,
          '--extensions-dir', extensionsDirPath,
          '--install-extension', 'james-yu.latex-workshop',
          '--install-extension', Path.join(__dirname, `../../vscode-ltex-${ltexVersion}.vsix`),
        ], {
          encoding: 'utf-8',
          stdio: 'inherit',
        });
    if (process.status != 0) throw new Error('Could not install extensions.');

    await CodeTest.runTests({
          vscodeExecutablePath: vscodeExecutablePath,
          launchArgs: [
            '--user-data-dir', userDataDirPath,
            '--extensions-dir', extensionsDirPath,
          ],
          extensionDevelopmentPath: Path.join(__dirname, '../../'),
          extensionTestsPath: Path.join(__dirname, './index'),
        });
  } catch (e) {
    console.error('Failed to run tests');
    console.error(e);
    process.exit(1);
  } finally {
    if (tmpDirPath != null) Rimraf.sync(tmpDirPath);
  }
}

main();
