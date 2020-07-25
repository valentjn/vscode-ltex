<!--
   - Copyright (C) 2020 Julian Valentin, LTeX Development Community
   -
   - This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/.
   -->

# LT<sub>E</sub>X Extension for Visual Studio Code: LanguageTool Grammar Checking with L<sup>A</sup>T<sub>E</sub>X Support

[![latest release](https://badgen.net/badge/-/release/585858?label=)![version number](https://badgen.net/vs-marketplace/v/valentjn.vscode-ltex?label=)![release date](https://badgen.net/github/last-commit/valentjn/vscode-ltex/release?label=)][marketplace]&nbsp;
[![installs](https://badgen.net/vs-marketplace/i/valentjn.vscode-ltex)][marketplace]&nbsp;
[![rating](https://badgen.net/vs-marketplace/rating/valentjn.vscode-ltex)][marketplace]

[![vscode-ltex](https://badgen.net/github/license/valentjn/vscode-ltex?label=vscode-ltex)](https://github.com/valentjn/vscode-ltex)&nbsp;
[![build status](https://badgen.net/travis/valentjn/vscode-ltex/release)](https://www.travis-ci.org/valentjn/vscode-ltex)&nbsp;
[![stars](https://badgen.net/github/stars/valentjn/vscode-ltex)](https://github.com/valentjn/vscode-ltex)&nbsp;
[![open issues](https://badgen.net/github/open-issues/valentjn/vscode-ltex?label=open/closed%20issues&color=blue)](https://github.com/valentjn/vscode-ltex/issues)&nbsp;[![closed issues](https://badgen.net/github/closed-issues/valentjn/vscode-ltex?label=)](https://github.com/valentjn/vscode-ltex/issues)\
[![ltex-ls](https://badgen.net/github/license/valentjn/ltex-ls?label=ltex-ls)](https://github.com/valentjn/ltex-ls)&nbsp;
[![build status](https://badgen.net/travis/valentjn/vscode-ltex/release)](https://www.travis-ci.org/valentjn/ltex-ls)&nbsp;
[![coverage](https://badgen.net/coveralls/c/github/valentjn/ltex-ls/release)](https://coveralls.io/github/valentjn/ltex-ls)

**LT<sub>E</sub>X** provides offline grammar checking in Visual Studio Code using [LanguageTool (LT)](https://languagetool.org/), supporting L<sup>A</sup>T<sub>E</sub>X and Markdown documents.

This extension is a fork of the abandoned [LanguageTool for Visual Studio Code extension](https://github.com/adamvoss/vscode-languagetool) by Adam Voss with L<sup>A</sup>T<sub>E</sub>X support, lots of new features (user dictionaries, ignore errors, etc.), and updated dependencies (LanguageTool).

## Features

![LanguageTool Grammar Checking for VS Code with LaTeX Support](https://github.com/valentjn/vscode-ltex/raw/release/img/banner-ltex.png)

- Checks **L<sup>A</sup>T<sub>E</sub>X** and **Markdown** documents
- Comes with **everything included,** no need to install Java or LanguageTool
- Supports **over 20 languages**
- **Issue highlighting** with hover description
- **Replacement suggestions** via quick fixes
- **User dictionaries**
- **Multilingual support** with babel commands or magic comments
- Possibility to use **external LanguageTool servers**

## Requirements

- 64-bit operating system
- [VS Code 1.39 or newer](https://code.visualstudio.com/)
- [LaTeX Workshop Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop) (if you want to check L<sup>A</sup>T<sub>E</sub>X documents)

## How to Use

1. Install the requirements listed above
2. Install this extension
3. Reload the VS Code window if necessary
4. Open a L<sup>A</sup>T<sub>E</sub>X or a Markdown document, or open a new file and change the language mode to `LaTeX` or `Markdown` (open the Command Palette and select `Change Language Mode`)
5. Wait until [ltex-ls](https://valentjn.github.io/vscode-ltex/docs/faq.html#whats-the-difference-between-vscode-ltex-ltex-ls-and-languagetool) and Java have been found; if necessary, LT<sub>E</sub>X downloads both for you. Alternatively, you can choose [offline installation](https://valentjn.github.io/vscode-ltex/docs/installation-how-to-use.html#offline-installation).
6. Grammar/spelling errors will be displayed! (if there are any)

## Note for Transitioning from LT<sub>E</sub>X 4.x

LT<sub>E</sub>X has undergone a major rewrite in version 5.0.0. The most important change is that it now comes with everything included:

- All languages are now directly included in LT<sub>E</sub>X, which eliminates the need for language support extensions (e.g., `LTeX - English support`). If you still have any of them installed, you may uninstall them now.
- Due to file size restrictions of the Visual Studio Marketplace, LT<sub>E</sub>X has to download its core component (which includes LanguageTool) when activated for the first time. Read below for instructions on offline installation.
- A separate Java installation is not necessary anymore. LT<sub>E</sub>X will automatically download a Java distribution and store it in the extension folder if no suitable Java installation (Java 8 or later) has been found on your computer.
- A few settings have been renamed. Check your `settings.json` for deprecated entries.

Find more information in the [changelog](https://valentjn.github.io/vscode-ltex/docs/changelog.html). In addition, you might find helpful information in the more extensive [documentation](https://valentjn.github.io/vscode-ltex/).

## Information & Documentation

- [General Information](https://valentjn.github.io/vscode-ltex/index.html)
  - [Overview](https://valentjn.github.io/vscode-ltex/index.html)
  - [Download — VS Marketplace](https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex)
  - [Code/Issues — GitHub](https://github.com/valentjn/vscode-ltex)
- [Documentation](https://valentjn.github.io/vscode-ltex/docs/installation-how-to-use.html)
  - [Installation & How to Use](https://valentjn.github.io/vscode-ltex/docs/installation-how-to-use.html)
    - [Requirements](https://valentjn.github.io/vscode-ltex/docs/installation-how-to-use.html#requirements)
    - [How to Use](https://valentjn.github.io/vscode-ltex/docs/installation-how-to-use.html#how-to-use)
    - [Offline Installation](https://valentjn.github.io/vscode-ltex/docs/installation-how-to-use.html#offline-installation)
      - [First Alternative: Download the Offline Version of LT<sub>E</sub>X](https://valentjn.github.io/vscode-ltex/docs/installation-how-to-use.html#first-alternative-download-the-offline-version-of-ltex)
      - [Second Alternative: Download ltex-ls/Java Manually](https://valentjn.github.io/vscode-ltex/docs/installation-how-to-use.html#second-alternative-download-ltex-lsjava-manually)
  - [Deprecation of Java 8](https://valentjn.github.io/vscode-ltex/docs/deprecation-of-java-8.html)
    - [What Do I Have to Do?](https://valentjn.github.io/vscode-ltex/docs/deprecation-of-java-8.html#what-do-i-have-to-do)
    - [Details on How LT<sub>E</sub>X Decides Which Java Installation to Use](https://valentjn.github.io/vscode-ltex/docs/deprecation-of-java-8.html#details-on-how-ltex-decides-which-java-installation-to-use)
  - [Transitioning from LT<sub>E</sub>X 4.x](https://valentjn.github.io/vscode-ltex/docs/transitioning-from-ltex-4x.html)
  - [Settings](https://valentjn.github.io/vscode-ltex/docs/settings.html)
    - [`ltex.enabled`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexenabled)
    - [`ltex.language`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexlanguage)
    - [`ltex.dictionary`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexdictionary)
    - [`ltex.disabledRules`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexdisabledrules)
    - [`ltex.enabledRules`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexenabledrules)
    - [`ltex.ltex-ls.path`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexltex-lspath)
    - [`ltex.ltex-ls.languageToolHttpServerUri`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexltex-lslanguagetoolhttpserveruri)
    - [`ltex.java.path`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexjavapath)
    - [`ltex.java.initialHeapSize`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexjavainitialheapsize)
    - [`ltex.java.maximumHeapSize`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexjavamaximumheapsize)
    - [`ltex.commands.ignore`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexcommandsignore)
    - [`ltex.commands.dummy`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexcommandsdummy)
    - [`ltex.environments.ignore`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexenvironmentsignore)
    - [`ltex.markdown.ignore`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexmarkdownignore)
    - [`ltex.markdown.dummy`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexmarkdowndummy)
    - [`ltex.ignoreRuleInSentence`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexignoreruleinsentence)
    - [`ltex.configurationTarget`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexconfigurationtarget)
    - [`ltex.additionalRules.motherTongue`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexadditionalrulesmothertongue)
    - [`ltex.additionalRules.languageModel`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexadditionalruleslanguagemodel)
    - [`ltex.additionalRules.neuralNetworkModel`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexadditionalrulesneuralnetworkmodel)
    - [`ltex.additionalRules.word2VecModel`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexadditionalrulesword2vecmodel)
    - [`ltex.sentenceCacheSize`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexsentencecachesize)
    - [`ltex.diagnosticSeverity`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexdiagnosticseverity)
    - [`ltex.trace.server`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltextraceserver)
  - [Advanced Features](https://valentjn.github.io/vscode-ltex/docs/advanced-features.html)
    - [Magic Comments](https://valentjn.github.io/vscode-ltex/docs/advanced-features.html#magic-comments)
    - [LanguageTool HTTP Servers](https://valentjn.github.io/vscode-ltex/docs/advanced-features.html#languagetool-http-servers)
    - [Ignoring False Positives with Regular Expressions](https://valentjn.github.io/vscode-ltex/docs/advanced-features.html#ignoring-false-positives-with-regular-expressions)
  - [FAQ](https://valentjn.github.io/vscode-ltex/docs/faq.html)
    - [What's the difference between vscode-ltex, ltex-ls, and LanguageTool?](https://valentjn.github.io/vscode-ltex/docs/faq.html#whats-the-difference-between-vscode-ltex-ltex-ls-and-languagetool)
    - [What happened to the Language Support Extensions?](https://valentjn.github.io/vscode-ltex/docs/faq.html#what-happened-to-the-language-support-extensions)
    - [How can I prevent LT<sub>E</sub>X from redownloading ltex-ls and Java after every update?](https://valentjn.github.io/vscode-ltex/docs/faq.html#how-can-i-prevent-ltex-from-redownloading-ltex-ls-and-java-after-every-update)
    - [Why does LT<sub>E</sub>X have such a high CPU load?](https://valentjn.github.io/vscode-ltex/docs/faq.html#why-does-ltex-have-such-a-high-cpu-load)
    - [How can I check multiple languages at once?](https://valentjn.github.io/vscode-ltex/docs/faq.html#how-can-i-check-multiple-languages-at-once)
    - [What does LT<sub>E</sub>X stand for?](https://valentjn.github.io/vscode-ltex/docs/faq.html#what-does-ltex-stand-for)
    - [Where can I ask a question that's not answered here?](https://valentjn.github.io/vscode-ltex/docs/faq.html#where-can-i-ask-a-question-thats-not-answered-here)
  - [Changelog](https://valentjn.github.io/vscode-ltex/docs/changelog.html)
  - [Contributing Code/Issues](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html)
    - [Ways of Contribution](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#ways-of-contribution)
    - [How to Report Bugs](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#how-to-report-bugs)
      - [Known Issues and Limitations](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#known-issues-and-limitations)
    - [How to Request Features](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#how-to-request-features)
    - [How to Contribute Code](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#how-to-contribute-code)
      - [Branches & Pull Requests](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#branches--pull-requests)
      - [Code Checks](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#code-checks)
      - [Versioning](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#versioning)
      - [Documentation](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#documentation)
  - [Acknowledgments](https://valentjn.github.io/vscode-ltex/docs/acknowledgments.html)
    - [LanguageTool Extension for Visual Studio Code](https://valentjn.github.io/vscode-ltex/docs/acknowledgments.html#languagetool-extension-for-visual-studio-code)
    - [ltex-ls](https://valentjn.github.io/vscode-ltex/docs/acknowledgments.html#ltex-ls)

[marketplace]: https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex
