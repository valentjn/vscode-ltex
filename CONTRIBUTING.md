<!--
   - Copyright (C) 2020 Julian Valentin, LTeX Development Community
   -
   - This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/.
   -->

# Contributing

## Ways of Contribution

Thank you for considering contributing to LTeX. There are many ways to do so:

- You can [report bugs](#how-to-report-bugs) to help make LTeX better.
- You can [request features](#how-to-request-features) to make LTeX more powerful.
- You can [contribute code](#how-to-contribute-code) to accelerate the pace of LTeX's development.
- You can [edit the documentation](#documentation) to make LTeX easier to use.

If you like LTeX, but are not able to contribute in any of these ways, there are still some quick and simple alternatives to show your gratitude:

- You can star the [repository on GitHub](https://github.com/valentjn/vscode-ltex).
- You can write a positive review on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex).

## How to Report Bugs

1. Make sure that your issue is really an LT<sub>E</sub>X bug.
2. Make sure that your issue can neither be found in the list of known issues below nor in the [list of all open and closed GitHub issues](https://github.com/valentjn/vscode-ltex/issues?q=is%3Aissue).
3. Create a minimal example document for which the bug occurs. To do so, take your original document, for which the bug occurs, and delete roughly half of it. If the bug does not occur anymore, undo the deletion and delete the other half instead. If the bug occurs, repeat by deleting half of the remaining half etc., until you arrive at a very small document, for which the bug still occurs. This is the minimal example document.
4. Create a minimal example configuration for which the bug occurs. To do so, proceed as for the minimal example document, except that you delete half of your `ltex.` settings.
5. Set the setting `"ltex.trace.server": "verbose"` in your `settings.json`.
6. Try to understand the bug by selecting `View` → `Output` → `LTeX Language Server`/`LTeX Language Client`.
7. Do one of the following:
   - Reproduce the bug and keep the document for which it occurs open. Execute the command [`LTeX: Report bug in LTeX`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-report-bug-in-ltex) inside Visual Studio Code from the Command Palette (`Ctrl+Shift+P`) and click on `Copy report and create issue`. This will copy a prefilled bug report to your clipboard and open the `New issue` page on GitHub in your browser (you may have to confirm that you really want to open the page). Enter a summary of the issue in the title field and paste the bug report from your clipboard into the description field. Before submitting the bug report, check that it doesn't contain any confidential data. OR
   - Manually [open an issue on GitHub](https://github.com/valentjn/vscode-ltex/issues/new/choose), select the `Bug report` template, and fill in as much info as you can (the [`LTeX: Report bug in LTeX`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-report-bug-in-ltex) command would do that for you). This will help us reproduce the issue.

**Important:** Please follow the issue template. Issues that don't follow the template or that don't contain the vital information requested in the template (especially minimal example document and settings) may be immediately closed as invalid.

### Known Issues and Limitations

- The LaTeX parser is not perfect. False positives are sometimes reported as errors. However, it is impossible to fully parse LaTeX without compiling it.
- Initial checking might take a while (up to two minutes), depending on the length of the document. [This is a limitation of LanguageTool.](https://valentjn.github.io/vscode-ltex/docs/faq.html#why-does-ltex-have-such-a-high-cpu-load)

## How to Request Features

1. Make sure that your feature is actually about LT<sub>E</sub>X (not about LanguageTool, for example).
2. Make sure that your feature is not in the [list of all open and closed GitHub issues](https://github.com/valentjn/vscode-ltex/issues?q=is%3Aissue).
3. Select the `Feature request` template when [opening an issue on GitHub](https://github.com/valentjn/vscode-ltex/issues/new/choose) and fill in as much info as you can. Using actual real-world examples that explain why you and many other users would benefit from the feature increases the request's chances of being implemented.

**Important:** Please follow the issue template. Issues that don't follow the template or that don't contain vital information requested in the template may be immediately closed as invalid.

## How to Contribute Code

[As explained in the FAQ](https://valentjn.github.io/vscode-ltex/docs/faq.html#whats-the-difference-between-vscode-ltex-ltex-ls-and-languagetool), LT<sub>E</sub>X consists of two components: [vscode-ltex](https://github.com/valentjn/vscode-ltex) and [ltex-ls](https://github.com/valentjn/ltex-ls). vscode-ltex is written in TypeScript and consists mostly of boilerplate code to find, download, and extract ltex-ls and Java. ltex-ls is written in Java and is the actual interface to the LanguageTool backend.

### Branches & Pull Requests

Both repositories currently have two main branches: `develop` and `release`. The `develop` branch is where new changes are integrated, so choose this as the target branch of your pull requests. The `release` branch always points to the latest release.

### Code Checks

In order for pull requests to be merged, a number of checks have to pass. This is automatically enforced by GitHub and Travis CI. The necessary checks depend on the project you contribute to:

- vscode-ltex:
  - Successful build (strict mode)
  - No ESLint warnings
  - Successful Mocha end-to-end and unit tests
  - Everything above is checked for Linux and Mac
- ltex-ls:
  - Successful build
  - No Checkstyle warnings (we use a slightly modified Google style)
  - No SpotBugs warnings
  - No Checker Framework warnings
  - Successful JUnit unit tests
  - Everything above is checked for Linux, Mac, and Windows
  - Code coverage of at least 90% (checked by Coveralls)

Look at `.travis.yml` in the root directory of the respective project to learn how to execute the checks locally on your machine.

### Versioning

LT<sub>E</sub>X uses [semantic versioning](https://semver.org/) since version 5.0.0. The versions of vscode-ltex and ltex-ls are tied together: vscode-ltex automatically downloads the newest version of ltex-ls which has a version smaller or equal version than itself (`max {ltex-ls-version | ltex-ls-version <= vscode-ltex-version}`). This means that when a new version of ltex-ls is released, a new version of vscode-ltex has to be released as well, using the same version number (but not vice versa).

This ensures that each version of vscode-ltex always uses the same version of ltex-ls, making downgrades possible, and that we don't have to worry about upgrading mechanisms, since Visual Studio Code will do that for us.

### Documentation

In addition, there is the possibility to work on the [documentation](https://valentjn.github.io/vscode-ltex). It's using GitHub Pages, Jekyll, and Markdown, and a bunch of Python scripts copies information over from the main repository (settings, changelog, etc.).

Analogously to the actual extension, there are two branches, which are stored in the [repository of vscode-ltex](https://github.com/valentjn/vscode-ltex): `gh-pages-develop` and `gh-pages-release`. Improvements go to `gh-pages-develop`, while `gh-pages-release` reflects the documentation for the latest release. Pushes to `gh-pages-release` will trigger Travis CI: It will hard-reset the actual `gh-pages` branch used for generating the site to `gh-pages-release`, and add a commit for updating the usage statistics on the homepage. To keep the statistics up-to-date, a cron job triggers this process once a day.

At the bottom of each page, you'll find an “Edit me” button that takes you directly to the corresponding Markdown document in the GitHub repo.

## Contribution Guidelines

### Guidelines About Issues

- **Stale issues** are closed seven days after they became stale. An issue becomes stale if:
  - The issue is missing information.
  - The issue is declared stale by a maintainer.
- **Discussions** may happen on any issue regardless of its state. Discussions don't prolong the lifetime of stale issues, and they must be about the original issue, otherwise a new issue must be opened.
- Issues may only be **reopened** if the reason for closing it doesn't exist anymore.
  - *Examples:* Missing information is provided, bug occurs again due to a regression, etc.
- Issues that don't follow the **template** may be closed immediately.
- Issues may be **locked** if they violate the [Code of Conduct](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html).

### Guidelines About Versioning

- **Semantic versioning** is used for vscode-ltex.
  - For bugfixes, the patch version is increased.
  - For new features, the minor version is increased.
  - For breaking changes, the major version is increased.
    - *Explanation:* Breaking changes are changes that may require action from users (e.g., most changes of existing LTeX settings).
- If a new release of vscode-ltex makes a **new version of ltex-ls** necessary, the version of ltex-ls is set to that of vscode-ltex.

### Guidelines About Fundamental Changes

- **Fundamental changes** are announced as an issue, in the documentation, and/or as message boxes in VS Code three months before their implementation.
  - *Explanation:* Fundamental changes are possibly breaking changes that change the foundation of LTeX (e.g., upgrade from Java 8 to Java 11).
- **Documentation of fundamental changes** and associated deprecated settings may be deleted three months after their implementation.
