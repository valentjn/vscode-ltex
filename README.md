# LT<sub>E</sub>X Extension for Visual Studio Code: LanguageTool Grammar Checking with L<sup>A</sup>T<sub>E</sub>X Support

[![Installs](https://img.shields.io/visual-studio-marketplace/i/valentjn.vscode-ltex?logo=visual-studio-code)][marketplace]&nbsp;
[![Rating](https://img.shields.io/visual-studio-marketplace/stars/valentjn.vscode-ltex?logo=visual-studio-code)][marketplace]

[![vscode-ltex](https://img.shields.io/badge/vscode--ltex-grey)](https://github.com/valentjn/vscode-ltex)&nbsp;
[![Travis CI build status of vscode-ltex](https://img.shields.io/travis/valentjn/vscode-ltex/master?logo=travis)](https://www.travis-ci.org/valentjn/vscode-ltex)&nbsp;
[![Coverage of vscode-ltex](https://img.shields.io/coveralls/github/valentjn/vscode-ltex/master?logo=coveralls)](https://coveralls.io/github/valentjn/vscode-ltex)&nbsp;
[![GitHub stars](https://img.shields.io/github/stars/valentjn/vscode-ltex?logo=github)](https://github.com/valentjn/vscode-ltex)&nbsp;
[![GitHub issues](https://img.shields.io/github/issues/valentjn/vscode-ltex?logo=github)](https://github.com/valentjn/vscode-ltex/issues)\
[![ltex-ls](https://img.shields.io/badge/ltex--ls-grey)](https://github.com/valentjn/ltex-ls)&nbsp;
[![Travis CI build status of ltex-ls](https://img.shields.io/travis/valentjn/ltex-ls/master?logo=travis)](https://www.travis-ci.org/valentjn/ltex-ls)&nbsp;
[![Coverage of ltex-ls](https://img.shields.io/coveralls/github/valentjn/ltex-ls/master?logo=coveralls)](https://coveralls.io/github/valentjn/ltex-ls)

**LT<sub>E</sub>X** provides offline grammar checking in Visual Studio Code using [LanguageTool (LT)](https://languagetool.org/), supporting L<sup>A</sup>T<sub>E</sub>X and Markdown documents.

This extension is a fork of the abandoned [LanguageTool for Visual Studio Code extension](https://github.com/adamvoss/vscode-languagetool) by Adam Voss with L<sup>A</sup>T<sub>E</sub>X support, lots of new features (user dictionaries, ignore errors, etc.), and updated dependencies (LanguageTool).

## Note for Transitioning to LT<sub>E</sub>X 5.x

LT<sub>E</sub>X has undergone a major rewrite in version 5.0. The most important change is that it now comes with everything included:

- All languages are now directly included in LT<sub>E</sub>X, which eliminates the need for language support extensions (e.g., `LTeX - English support`). If you still have any of them installed, you may uninstall them now.
- Due to file size restrictions of the Visual Studio Marketplace, LT<sub>E</sub>X has to download its core component (which includes LanguageTool) when activated for the first time. Read below for instructions on offline installation.
- A separate Java installation is not necessary anymore. LT<sub>E</sub>X will automatically download a Java distribution and store it in the extension folder if no suitable Java installation (Java 8 or later) has been found on your computer.
- A few settings have been renamed. Check your `settings.json` for deprecated entries.

Find more information in the [changelog](https://github.com/valentjn/vscode-ltex/blob/master/CHANGELOG.md).

## Features

![LanguageTool Grammar Checking for VS Code with LaTeX Support](https://github.com/valentjn/vscode-ltex/raw/master/img/LTeX-banner.png)

- Checks **L<sup>A</sup>T<sub>E</sub>X** and **Markdown** documents
- Comes with **everything included,** no need to install Java or LanguageTool
- Supports **over 20 languages**
- **Issue highlighting** with hover description
- **Replacement suggestions** via quick fixes
- **User dictionaries**

## Requirements

- 64-bit operating system
- [VS Code 1.39 or newer](https://code.visualstudio.com/)
- [LaTeX Workshop Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop) (if you want to check L<sup>A</sup>T<sub>E</sub>X documents)

## How to Use

1. Install the requirements listed above
2. Install this extension
3. Reload the VS Code window if necessary
4. Open a L<sup>A</sup>T<sub>E</sub>X or a Markdown document, or open a new file and change the language mode to `LaTeX` or `Markdown` (open the Command Palette and select `Change Language Mode`)
5. Wait until ltex-ls and Java have been found; if necessary, LT<sub>E</sub>X downloads both for you.
6. Grammar/spelling errors will be displayed! (if there are any)

## Documentation

- [General Information](https://valentjn.github.io/vscode-ltexhttps://valentjn.github.io/vscode-ltex/index.html)
  - [Overview](https://valentjn.github.io/vscode-ltex/index.html)
    - [Features](https://valentjn.github.io/vscode-ltex#features)
  - [Download — VS Marketplace](https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex)
  - [GitHub — Code/Issues](https://github.com/valentjn/vscode-ltex)
- [Documentation](https://valentjn.github.io/vscode-ltexhttps://valentjn.github.io/vscode-ltex/docs/installation-how-to-use.html)
  - [Installation & How to Use](https://valentjn.github.io/vscode-ltex/docs/installation-how-to-use.html)
    - [Requirements](https://valentjn.github.io/vscode-ltex#requirements)
    - [How to Use](https://valentjn.github.io/vscode-ltex#how-to-use)
    - [Offline Installation](https://valentjn.github.io/vscode-ltex#offline-installation)
      - [First Alternative](https://valentjn.github.io/vscode-ltex#first-alternative)
      - [Second Alternative](https://valentjn.github.io/vscode-ltex#second-alternative)
  - [Transitioning to LT<sub>E</sub>X 5.x](https://valentjn.github.io/vscode-ltex/docs/transitioning-to-ltex-5x.html)
  - [Settings](https://valentjn.github.io/vscode-ltex/docs/settings.html)
    - [`ltex.enabled`](https://valentjn.github.io/vscode-ltex#ltexenabled)
    - [`ltex.language`](https://valentjn.github.io/vscode-ltex#ltexlanguage)
    - [`ltex.dictionary`](https://valentjn.github.io/vscode-ltex#ltexdictionary)
    - [`ltex.disabledRules`](https://valentjn.github.io/vscode-ltex#ltexdisabledrules)
    - [`ltex.enabledRules`](https://valentjn.github.io/vscode-ltex#ltexenabledrules)
    - [`ltex.ltex-ls.path`](https://valentjn.github.io/vscode-ltex#ltexltex-lspath)
    - [`ltex.java.path`](https://valentjn.github.io/vscode-ltex#ltexjavapath)
    - [`ltex.java.initialHeapSize`](https://valentjn.github.io/vscode-ltex#ltexjavainitialheapsize)
    - [`ltex.java.maximumHeapSize`](https://valentjn.github.io/vscode-ltex#ltexjavamaximumheapsize)
    - [`ltex.commands.ignore`](https://valentjn.github.io/vscode-ltex#ltexcommandsignore)
    - [`ltex.commands.dummy`](https://valentjn.github.io/vscode-ltex#ltexcommandsdummy)
    - [`ltex.environments.ignore`](https://valentjn.github.io/vscode-ltex#ltexenvironmentsignore)
    - [`ltex.markdown.ignore`](https://valentjn.github.io/vscode-ltex#ltexmarkdownignore)
    - [`ltex.markdown.dummy`](https://valentjn.github.io/vscode-ltex#ltexmarkdowndummy)
    - [`ltex.ignoreRuleInSentence`](https://valentjn.github.io/vscode-ltex#ltexignoreruleinsentence)
    - [`ltex.configurationTarget`](https://valentjn.github.io/vscode-ltex#ltexconfigurationtarget)
    - [`ltex.additionalRules.motherTongue`](https://valentjn.github.io/vscode-ltex#ltexadditionalrulesmothertongue)
    - [`ltex.additionalRules.languageModel`](https://valentjn.github.io/vscode-ltex#ltexadditionalruleslanguagemodel)
    - [`ltex.additionalRules.neuralNetworkModel`](https://valentjn.github.io/vscode-ltex#ltexadditionalrulesneuralnetworkmodel)
    - [`ltex.additionalRules.word2VecModel`](https://valentjn.github.io/vscode-ltex#ltexadditionalrulesword2vecmodel)
    - [`ltex.sentenceCacheSize`](https://valentjn.github.io/vscode-ltex#ltexsentencecachesize)
    - [`ltex.diagnosticSeverity`](https://valentjn.github.io/vscode-ltex#ltexdiagnosticseverity)
    - [`ltex.trace.server`](https://valentjn.github.io/vscode-ltex#ltextraceserver)
  - [Advanced Features](https://valentjn.github.io/vscode-ltex/docs/advanced-features.html)
    - [Magic Comments](https://valentjn.github.io/vscode-ltex#magic-comments)
    - [Ignoring False Positives with Regular Expressions](https://valentjn.github.io/vscode-ltex#ignoring-false-positives-with-regular-expressions)
  - [Changelog](https://valentjn.github.io/vscode-ltex/docs/changelog.html)
  - [Contributing Code/Issues](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html)
    - [How to Report Bugs](https://valentjn.github.io/vscode-ltex#how-to-report-bugs)
    - [Known Issues](https://valentjn.github.io/vscode-ltex#known-issues)
  - [Acknowledgments](https://valentjn.github.io/vscode-ltex/docs/acknowledgments.html)
    - [LanguageTool Extension for Visual Studio Code](https://valentjn.github.io/vscode-ltex#languagetool-extension-for-visual-studio-code)
    - [ltex-ls](https://valentjn.github.io/vscode-ltex#ltex-ls)

[marketplace]: https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex
