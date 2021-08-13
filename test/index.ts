/* Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import glob from 'glob';
import Mocha from 'mocha';
import * as Path from 'path';

export function run(): Promise<void> {
  const mocha: Mocha = new Mocha({
        ui: 'bdd',
        timeout: 300000,
        color: true,
      });

  const testsRoot: string = Path.resolve(__dirname, '..');

  return new Promise((resolve: () => void, reject: (reason?: any) => void) => {
    glob('**/**.test.js', {cwd: testsRoot}, (e: Error | null, files: string[]) => {
      if (e != null) {
        return reject(e);
      }

      files.forEach((x: string) => mocha.addFile(Path.resolve(testsRoot, x)));

      try {
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
