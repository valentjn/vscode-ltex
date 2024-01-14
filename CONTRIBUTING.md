<!--
   - Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
   -
   - This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/.
   -->

# Contributing

## Ways of Contribution

Thank you for considering contributing to LT<sub>E</sub>X. There are many ways to do so:

- You can [report bugs](#how-to-report-bugs) to help make LT<sub>E</sub>X better.
- You can [request features](#how-to-request-features) to make LT<sub>E</sub>X more powerful.
- You can [contribute code](#how-to-contribute-code) to accelerate the pace of LT<sub>E</sub>X's development.
- You can [test pre-release versions](#how-to-test-pre-releases) to help find bugs before they affect thousands of users.
- You can [edit the documentation](#how-to-edit-the-documentation) to make LT<sub>E</sub>X easier to use.
- You can [translate the user interface](#how-to-translate-the-user-interface) into your mother tongue to make LT<sub>E</sub>X more accessible.

If you like LT<sub>E</sub>X, but are not able to contribute in any of these ways, there are still some quick and simple alternatives to show your gratitude:

- You can star the [repository on GitHub](https://github.com/valentjn/vscode-ltex).
- You can write a positive review on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex) or on [Open VSX](https://open-vsx.org/extension/valentjn/vscode-ltex).

## How to Report Bugs

1. Make sure that your issue is really an LT<sub>E</sub>X bug.
2. Make sure that your issue can neither be found in the list of known issues below nor in the [list of all open and closed GitHub issues](https://github.com/valentjn/vscode-ltex/issues?q=is%3Aissue).
3. Create a minimal example document for which the bug occurs. To do so, take your original document, for which the bug occurs, and delete roughly half of it. If the bug does not occur anymore, undo the deletion and delete the other half instead. If the bug occurs, repeat by deleting half of the remaining half etc., until you arrive at a very small document, for which the bug still occurs. This is the minimal example document.
4. Create a minimal example configuration for which the bug occurs. To do so, proceed as for the minimal example document, except that you delete half of your `ltex.` settings.
5. Set the setting `"ltex.trace.server": "verbose"` in your `settings.json`.
6. Try to understand the bug by selecting `View` → `Output` → `LTeX Language Server`/`LTeX Language Client`.
7. Do one of the following:
   - Reproduce the bug and keep the document for which it occurs open. Execute the command [`LTeX: Report Bug in LTeX`](https://valentjn.github.io/ltex/vscode-ltex/commands.html#ltex-report-bug-in-ltex) inside VS Code from the Command Palette (`Ctrl+Shift+P`) and click on `Copy report and create issue`. This will copy a prefilled bug report to your clipboard and open the `New Issue` page on GitHub in your browser (you may have to confirm that you really want to open the page). Enter a summary of the issue in the title field and paste the bug report from your clipboard into the description field. Before submitting the bug report, check that it doesn't contain any confidential data. OR
   - Manually [open an issue on GitHub](https://github.com/valentjn/vscode-ltex/issues/new/choose), select the `Bug Report` template, and fill in as much info as you can (the [`LTeX: Report Bug in LTeX`](https://valentjn.github.io/ltex/vscode-ltex/commands.html#ltex-report-bug-in-ltex) command would do that for you). This will help us reproduce the issue.

**Important:** Please follow the issue template. Issues that don't follow the template or that don't contain the vital information requested in the template (especially minimal example document and settings) may be immediately closed as invalid.

### Known Issues and Limitations

- The LaTeX parser is not perfect. False positives are sometimes reported as errors. However, it is impossible to fully parse LaTeX's output without compiling the source. This follows from the [Turing-completeness of TeX](https://en.wikipedia.org/w/index.php?title=TeX&oldid=979062806#Typesetting_system) and the [halting problem](https://en.wikipedia.org/w/index.php?title=Halting_problem&oldid=979261081).
- Initial checking might take a while (up to two minutes), depending on the length of the document. [This is a limitation of LanguageTool.](https://valentjn.github.io/ltex/faq.html#why-does-ltex-have-such-a-high-cpu-load)

## How to Request Features

1. Make sure that your feature is actually about LT<sub>E</sub>X (not about LanguageTool, for example).
2. Make sure that your feature is not in the [list of all open and closed GitHub issues](https://github.com/valentjn/vscode-ltex/issues?q=is%3Aissue).
3. Do one of the following:
   - Execute the command [`LTeX: Request Feature for LTeX`](https://valentjn.github.io/ltex/vscode-ltex/commands.html#ltex-request-feature-for-ltex) inside VS Code from the Command Palette (`Ctrl+Shift+P`) and click on `Create issue`. This will open the `New Issue` page on GitHub in your browser (you may have to confirm that you really want to open the page). OR
   - Manually [open an issue on GitHub](https://github.com/valentjn/vscode-ltex/issues/new/choose) and select the `Feature Request` template.
4. Enter a summary of the feature in the title field and fill out the template in the description field. Fill in as much info as you can. Using actual real-world examples that explain why you and many other users would benefit from the feature increases the request's chances of being implemented.

**Important:** Please follow the issue template. Issues that don't follow the template or that don't contain vital information requested in the template may be immediately closed as invalid.

## How to Set Up the Project

[As explained in the FAQ](https://valentjn.github.io/ltex/faq.html#whats-the-difference-between-vscode-ltex-ltex-ls-and-languagetool), LT<sub>E</sub>X consists of two components: [vscode-ltex](https://github.com/valentjn/vscode-ltex) and [ltex-ls](https://github.com/valentjn/ltex-ls). This guide is only about the vscode-ltex part. If you want to change ltex-ls as well, [be sure to read and follow the contribution guidelines of ltex-ls](https://valentjn.github.io/ltex/ltex-ls/contributing.html).

1. Install VS Code, Git, and npm.
2. Fork vscode-ltex on GitHub.
3. Clone the fork: `git clone https://github.com/<YOUR_USERNAME>/vscode-ltex.git`
4. Open the cloned folder in VS Code.
5. Install the npm dependencies: `cd vscode-ltex && npm install`
6. Run the `Launch extension` task to launch and debug the extension.

### Setup Windows WSL env

`Python` is required to develop this project. For reference you can check out [Get started using Python for web development on Windows](https://learn.microsoft.com/en-us/windows/python/web-frameworks).

```sh
sudo apt update && sudo apt upgrade

sudo apt install libxshmfence1 libnss3 libatk1.0-0 libatk-bridge2.0-0 librust-gdk-pixbuf-sys-dev libgtk-3-0 libgbm1 libasound2 openjdk-21-jdk

sudo apt upgrade python3

sudo apt install python3-pip

# optional
sudo apt install python3-venv

# required as python2 is deprecated
sudo apt install python-is-python3

pip install semver jsonschema
```

## How to Contribute Code

1. [Set up the project.](#how-to-set-up-the-project)
2. Implement your changes.
3. Use commit messages in the following form: First line in imperative, first letter upper case, no trailing period, maximum 50 characters. Second line is blank. Additional information (if any) is in third and following lines. If the change is related to an issue, use `See #1234.` or `Fixes #1234.` as a separate final paragraph.
4. Check if the extension builds: `npm run compile`.
5. Check if there are no linter errors: `npm run lint`.
6. Open a pull request with the `develop` branch as the target branch.
7. If the GitHub Actions CI reports any errors, fix them.
8. Wait until a maintainer reviews your PR.

## How to Test Pre-Releases

You can help find bugs before they affect thousands of LT<sub>E</sub>X users by testing pre-releases.

1. Check whether a pre-release is available on the [releases pages of vscode-ltex](https://github.com/valentjn/vscode-ltex/releases) (pre-releases, if there are any, are at the top of the page).
2. Download the `*.vsix` file corresponding to your platform.
3. Install the `*.vsix` file in VS Code via `Extensions: Install from VSIX...` on the Command Palette.
4. Reload the window of VS Code.
5. Check if all currently listed changes in the [changelog on the `develop` branch](https://github.com/valentjn/vscode-ltex/blob/develop/changelog.xml) work as announced.

The availability of pre-releases varies. Pre-releases are only available if a pre-release tag (a tag with the name of a version number with a dash in it, e.g., `8.0.0-alpha.3`) has been pushed to the repository. Pre-releases are only available for a limited time; they will be deleted once the regular release has been taken place.

Of course, pre-releases are not for productive work, they even may be harmful and mess up your settings, etc. Therefore, it's best to use a clean installation/profile of VS Code. You can do that by starting VS Code via `code --extensions-dir /tmp/code-extensions --user-data-dir /tmp/code-user`. If you do use your existing installation, you can downgrade again by removing the extension and reinstalling it from the Marketplace. Close VS Code after removing the extension if X does not behave normally.

## How to Edit the Documentation

You can improve the [documentation](https://valentjn.github.io/ltex):

1. Check whether the page you want to edit is listed in the table below.
   - If yes, then follow the corresponding link to the source.
   - If no, then click on “Edit me on GitHub” at the bottom of the page you want to edit.
2. Implement your changes.
3. [Use commit messages in the form as mentioned above.](#how-to-contribute-code)
4. Open a pull request with the `develop` branch as the target branch.
5. If the GitHub Actions CI reports any errors, fix them.
6. Wait until a maintainer reviews your PR.

| Page | Sources |
| ---- | ------- |
| [Settings](https://valentjn.github.io/ltex/settings.html) | [`package.json`](https://github.com/valentjn/vscode-ltex/blob/develop/package.json), [`package.nls.json`](https://github.com/valentjn/vscode-ltex/blob/develop/package.nls.json) |
| [Code of Conduct](https://valentjn.github.io/ltex/code-of-conduct.html) | [`CODE_OF_CONDUCT.md`](https://github.com/valentjn/vscode-ltex/blob/develop/CODE_OF_CONDUCT.md) |
| [vscode-ltex / coc-ltex → Commands](https://valentjn.github.io/ltex/vscode-ltex/commands.html) | [`package.json`](https://github.com/valentjn/vscode-ltex/blob/develop/package.json), [`package.nls.json`](https://github.com/valentjn/vscode-ltex/blob/develop/package.nls.json) |
| [vscode-ltex / coc-ltex → Changelog](https://valentjn.github.io/ltex/vscode-ltex/changelog.html) | [`vscode-ltex/changelog.xml`](https://github.com/valentjn/vscode-ltex/blob/develop/changelog.xml) |
| [vscode-ltex / coc-ltex → Contributing](https://valentjn.github.io/ltex/vscode-ltex/contributing.html) | [`vscode-ltex/CONTRIBUTING.md`](https://github.com/valentjn/vscode-ltex/blob/develop/CONTRIBUTING.md) |

## How to Translate the User Interface

The user interface of LT<sub>E</sub>X is currently available in the following languages:

- English
- German

You're welcome to help extend this list. To do so, only fluent proficiency (CEFR C1-level) in the target language is required, no programming skills.

1. Duplicate [`package.nls.de.json`](https://github.com/valentjn/vscode-ltex/blob/develop/package.nls.de.json), replacing `de` with the [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) of your language.
2. For each of the entries in the duplicated file: Look up the English original of the entry in the corresponding English file, and replace the German translation with the translation into your language.
3. [Use commit messages in the form as mentioned above.](#how-to-contribute-code)
4. Open a pull request with the `develop` branch as the target branch.
5. If the GitHub Actions CI reports any errors, fix them.
6. Wait until a maintainer reviews your PR.

Of course, it's also possible to duplicate the English language files instead, but you only need to translate the strings that are shown in the user interface (the other ones are for logging, debugging, etc.). The German language files already provide the correct subset of strings.
