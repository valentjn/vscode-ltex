/* Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';

export default class TestTools {
  public static async createNewFile(codeLanguage: string, contents?: string):
      Promise<Code.TextDocument> {
    return await Code.workspace.openTextDocument({language: codeLanguage, content: contents});
  }

  public static async sleep(ms: number): Promise<void> {
    return new Promise((resolve: () => void) => setTimeout(resolve, ms));
  }
}
