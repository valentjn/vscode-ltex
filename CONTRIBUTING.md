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
- You can [test pre-release versions](#pre-releases) to help find bugs before they affect thousands of users.
- You can [edit the documentation](#documentation) to make LTeX easier to use.
- You can [translate strings](#internationalization-i18n) into your mother tongue to make LTeX more accessible.

If you like LTeX, but are not able to contribute in any of these ways, there are still some quick and simple alternatives to show your gratitude:

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
   - Reproduce the bug and keep the document for which it occurs open. Execute the command [`LTeX: Report Bug in LTeX`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-report-bug-in-ltex) inside VS Code from the Command Palette (`Ctrl+Shift+P`) and click on `Copy report and create issue`. This will copy a prefilled bug report to your clipboard and open the `New Issue` page on GitHub in your browser (you may have to confirm that you really want to open the page). Enter a summary of the issue in the title field and paste the bug report from your clipboard into the description field. Before submitting the bug report, check that it doesn't contain any confidential data. OR
   - Manually [open an issue on GitHub](https://github.com/valentjn/vscode-ltex/issues/new/choose), select the `Bug Report` template, and fill in as much info as you can (the [`LTeX: Report Bug in LTeX`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-report-bug-in-ltex) command would do that for you). This will help us reproduce the issue.

**Important:** Please follow the issue template. Issues that don't follow the template or that don't contain the vital information requested in the template (especially minimal example document and settings) may be immediately closed as invalid.

### Known Issues and Limitations

- The LaTeX parser is not perfect. False positives are sometimes reported as errors. However, it is impossible to fully parse LaTeX's output without compiling the source. This follows from the [Turing-completeness of TeX](https://en.wikipedia.org/w/index.php?title=TeX&oldid=979062806#Typesetting_system) and the [halting problem](https://en.wikipedia.org/w/index.php?title=Halting_problem&oldid=979261081).
- Initial checking might take a while (up to two minutes), depending on the length of the document. [This is a limitation of LanguageTool.](https://valentjn.github.io/vscode-ltex/docs/faq.html#why-does-ltex-have-such-a-high-cpu-load)

## How to Request Features

1. Make sure that your feature is actually about LT<sub>E</sub>X (not about LanguageTool, for example).
2. Make sure that your feature is not in the [list of all open and closed GitHub issues](https://github.com/valentjn/vscode-ltex/issues?q=is%3Aissue).
3. Do one of the following:
   - Execute the command [`LTeX: Request Feature for LTeX`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-request-feature-for-ltex) inside VS Code from the Command Palette (`Ctrl+Shift+P`) and click on `Create issue`. This will open the `New Issue` page on GitHub in your browser (you may have to confirm that you really want to open the page). OR
   - Manually [open an issue on GitHub](https://github.com/valentjn/vscode-ltex/issues/new/choose) and select the `Feature Request` template.
4. Enter a summary of the feature in the title field and fill out the template in the description field. Fill in as much info as you can. Using actual real-world examples that explain why you and many other users would benefit from the feature increases the request's chances of being implemented.

**Important:** Please follow the issue template. Issues that don't follow the template or that don't contain vital information requested in the template may be immediately closed as invalid.

## How to Contribute Code

[As explained in the FAQ](https://valentjn.github.io/vscode-ltex/docs/faq.html#whats-the-difference-between-vscode-ltex-ltex-ls-and-languagetool), LT<sub>E</sub>X consists of two components: [vscode-ltex](https://github.com/valentjn/vscode-ltex) and [ltex-ls](https://github.com/valentjn/ltex-ls). vscode-ltex is written in TypeScript and consists mostly of boilerplate code to find, download, and extract ltex-ls and Java. ltex-ls is written in Java and is the actual interface to the LanguageTool backend.

### Branches & Pull Requests

Both repositories currently have two main branches: `develop` and `release`. The `develop` branch is where new changes are integrated, so choose this as the target branch of your pull requests. The `release` branch always points to the latest release.

### Code Checks

In order for pull requests to be merged, a number of checks have to pass. This is enforced by GitHub, and the checks are automatically performed by a GitHub Actions workflow. The necessary checks depend on the project you contribute to:

- vscode-ltex (see [`vscode-ltex-ci.yml`](https://github.com/valentjn/vscode-ltex/blob/develop/.github/workflows/vscode-ltex-ci.yml)):
  - Successful build (strict mode)
  - No ESLint warnings
  - Successful Mocha end-to-end and unit tests
  - Everything above is checked for Linux and Windows
  - No CodeQL warnings
- ltex-ls (see [`ltex-ls-ci.yml`](https://github.com/valentjn/ltex-ls/blob/develop/.github/workflows/ltex-ls-ci.yml)):
  - Successful build
  - No Checkstyle warnings (we use a slightly modified Google style)
  - No SpotBugs warnings
  - No Checker Framework warnings
  - Successful JUnit unit tests
  - Everything above is checked for Linux, Mac, and Windows
  - Code coverage of at least 90% (coverage reports are uploaded to [Coveralls](https://coveralls.io/github/valentjn/ltex-ls))
  - No CodeQL warnings

Look at the `*.yml` definition of the respective GitHub Actions workflow to learn how to execute the checks locally on your machine.

### Versioning

vscode-ltex uses [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) since vscode-ltex 5.0.0. The versions of vscode-ltex and ltex-ls used to be tied together, but ltex-ls uses Semantic Versioning 2.0.0 independently of vscode-ltex since vscode-ltex 8.2.0 and ltex-ls 9.0.0. vscode-ltex automatically downloads ltex-ls on the first start, and the version of ltex-ls is hard-coded into vscode-ltex. This means that when a new version of ltex-ls is released, a new version of vscode-ltex has to be released as well, but not vice versa.

This ensures that each version of vscode-ltex always uses the same version of ltex-ls, making downgrades possible, and that we don't have to worry about upgrading mechanisms, since VS Code will do that for us.

### Pre-Releases

You can help find bugs before they affect thousands of LTeX users by testing pre-releases.

The availability of pre-releases varies. Pre-releases are only available if a pre-release tag (a tag with the name of a version number with a dash in it, e.g., `8.0.0-alpha.3`) has been pushed to the repositories of vscode-ltex or ltex-ls. Pre-releases are only available for a limited time; they will be deleted once the regular release has been taken place.

You can check whether pre-releases are available by checking the top of the releases pages of [vscode-ltex](https://github.com/valentjn/vscode-ltex/releases) and [ltex-ls](https://github.com/valentjn/ltex-ls/releases) on GitHub. If any pre-releases are available, they will always be displayed above the latest release.

Of course, pre-releases are not for productive work, they even may be harmful and mess up your settings, etc. Therefore, it's best to use a clean installation/profile of VS Code. You can do that by starting VS Code via `code --extensions-dir /tmp/code-extensions --user-data-dir /tmp/code-user`. If you do use your existing installation, you can downgrade again by removing the extension and reinstalling it from the Marketplace. Close VS Code after removing the extension if LTeX does not behave normally.

If you want to test a pre-release of vscode-ltex, [download the `*.vsix` file from GitHub](https://github.com/valentjn/vscode-ltex/releases), install it in VS Code via `Extensions: Install from VSIX...` on the Command Palette, and reload the window. Both the online and offline versions should work, as they either download or contain the corresponding pre-release version of ltex-ls, so there is no need to download ltex-ls yourself.

Sometimes, only a pre-release (especially when there are no major changes) of ltex-ls is available. In this case, you can test the pre-release of ltex-ls by [downloading the ltex-ls archive from GitHub](https://github.com/valentjn/ltex-ls/releases), extracting it, and pointing [`ltex.ltex-ls.path`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexltex-lspath) to the extracted directory.

Be sure to check the list of current changes in the [changelog on the `develop` branch](https://github.com/valentjn/vscode-ltex/blob/develop/changelog.xml) to know what to look for when testing.

### Documentation

In addition, there is the possibility to work on the [documentation](https://valentjn.github.io/vscode-ltex). It's using GitHub Pages, Jekyll, and Markdown, and a bunch of Python scripts copies information over from the main repository.

Analogously to the actual extension, there are two branches, which are stored in the [repository of vscode-ltex](https://github.com/valentjn/vscode-ltex): `gh-pages-develop` and `gh-pages-release`. Improvements go to `gh-pages-develop`, while `gh-pages-release` reflects the documentation for the latest release. Pushes to `gh-pages-release` will trigger a GitHub Actions workflow: It will hard-reset the actual `gh-pages` branch used for generating the site to `gh-pages-release`, and add a commit for updating the usage statistics on the homepage. To keep the statistics up-to-date, a cron job triggers this process once a day.

At the bottom of each page, you'll find an “Edit me” button that takes you directly to the corresponding Markdown document in the GitHub repo. However, note that some pages are automatically generated. Changes in the Markdown documents linked by the “Edit me” buttons on these pages would be overwritten by the Python scripts. Therefore, if you want to edit one of these pages, please edit the source(s) instead:

| Page | Sources |
| ---- | ------- |
| [Settings](https://valentjn.github.io/vscode-ltex/docs/settings.html) | [`package.json`](https://github.com/valentjn/vscode-ltex/blob/develop/package.json), [`package.nls.json`](https://github.com/valentjn/vscode-ltex/blob/develop/package.nls.json) |
| [Commands](https://valentjn.github.io/vscode-ltex/docs/commands.html) | [`package.json`](https://github.com/valentjn/vscode-ltex/blob/develop/package.json), [`package.nls.json`](https://github.com/valentjn/vscode-ltex/blob/develop/package.nls.json) |
| [Changelog](https://valentjn.github.io/vscode-ltex/docs/changelog.html) | [`changelog.xml`](https://github.com/valentjn/vscode-ltex/blob/develop/changelog.xml) |
| [Contributing Code/Issues](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html) | [`CONTRIBUTING.md`](https://github.com/valentjn/vscode-ltex/blob/develop/CONTRIBUTING.md) |
| [Code of Conduct](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html) | [`CODE_OF_CONDUCT.md`](https://github.com/valentjn/vscode-ltex/blob/develop/CODE_OF_CONDUCT.md) |
| [Acknowledgments](https://valentjn.github.io/vscode-ltex/docs/acknowledgments.html) | [`ACKNOWLEDGMENTS.md`](https://github.com/valentjn/vscode-ltex/blob/develop/ACKNOWLEDGMENTS.md) |

### Internationalization (I18n)

The user interface of LTeX is currently available in the following languages:

- English
- German

You're welcome to help extend this list. To do so, only fluent proficiency (CEFR C1-level) in the target language is required, no programming skills. The following three files contain all English strings of LTeX:

- [`vscode-ltex/package.nls.json`](https://github.com/valentjn/vscode-ltex/blob/develop/package.nls.json), e.g., German: [`vscode-ltex/package.nls.de.json`](https://github.com/valentjn/vscode-ltex/blob/develop/package.nls.de.json)
- [`vscode-ltex/i18n/messages.nls.json`](https://github.com/valentjn/vscode-ltex/blob/develop/i18n/messages.nls.de.json), e.g., German: [`vscode-ltex/i18n/messages.nls.de.json`](https://github.com/valentjn/vscode-ltex/blob/develop/i18n/messages.nls.de.json)
- [`ltex-ls/ltexls-core/src/main/resources/MessagesBundle.properties`](https://github.com/valentjn/ltex-ls/blob/develop/ltexls-core/src/main/resources/MessagesBundle.properties), e.g., German: [`ltex-ls/ltexls-core/src/main/resources/MessagesBundle_de.properties`](https://github.com/valentjn/ltex-ls/blob/develop/ltexls-core/src/main/resources/MessagesBundle_de.properties)

You can translate LTeX into your language as follows: First, duplicate each of the German language files, replacing `de` with the [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) of your language. Then, for each of the strings in the newly created files, look up the English original of the entry in the corresponding English file, and replace the German translation with the translation into your language.

Of course, it's also possible to duplicate the English language files instead, but you only need to translate the strings that are shown in the user interface (the other ones are for logging, debugging, etc.). The German language files already provide the correct subset of strings.

## Contribution Guidelines

### Guidelines About Issues

- **Stale issues** are closed seven days after they became stale. An issue becomes stale if:
  - The issue is missing information.
  - The issue is declared stale by a maintainer.
- **Discussions** may happen on any issue regardless of its state. Discussions don't prolong the lifetime of stale issues, and they must be about the original issue, otherwise a new issue must be opened.
- Issues may only be **reopened** if the reason for closing it doesn't exist anymore.
  - *Examples:* Missing information is provided, bug occurs again due to a regression, etc.
- Issue comments that do not contribute to the discussion (e.g., “I'm affected, too” on confirmed bug reports) may be hidden. Instead, reactions (e.g., thumbs-up) should be used to upvote issues.
- Issues that don't follow the **template** may be closed immediately.
- Issues may be **locked** if they violate the [Code of Conduct](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html).

### Guidelines About Versioning

- **Semantic versioning** is used for vscode-ltex and ltex-ls. The two versions are independent of each other.
  - For bug fixes, the patch version is increased.
  - For new features, the minor version is increased.
  - For breaking changes, the major version is increased.
    - *Explanation:* Breaking changes are changes that may require action from users (e.g., most changes of existing LTeX settings).

### Guidelines About Fundamental Changes

- **Fundamental changes** are announced as an issue, in the documentation, and/or as message boxes in VS Code three months before their implementation.
  - *Explanation:* Fundamental changes are possibly breaking changes that change the foundation of LTeX (e.g., upgrade from Java 8 to Java 11).
- **Documentation of fundamental changes** and associated deprecated settings may be deleted three months after their implementation.
