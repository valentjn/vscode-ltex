import * as glob from 'glob';
import * as Mocha from 'mocha';
import * as Path from 'path';

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
        ui: 'tdd',
      });
  mocha.useColors(true);

  const testsRoot = Path.resolve(__dirname, '..');

  return new Promise((resolve: () => void, reject: (reason?: any) => void) => {
    glob('**/**.test.js', {cwd: testsRoot}, (e: Error | null, files: string[]) => {
      if (e != null) {
        return reject(e);
      }

      // Add files to the test suite
      files.forEach((x: string) => mocha.addFile(Path.resolve(testsRoot, x)));

      try {
        // Run the mocha test
        mocha.run((failures: number): void => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`));
          } else {
            resolve();
          }
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  });
}
