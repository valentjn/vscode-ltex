<!--
   - Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
   -
   - This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/.
   -->

# LT<sub>E</sub>X Extension for VS Code: Grammar/Spell Checker Using LanguageTool with Support for L<sup>A</sup>T<sub>E</sub>X, Markdown, and Others

[![latest release](https://badgen.net/badge/-/release/585858?label=)![version number](https://badgen.net/vs-marketplace/v/valentjn.vscode-ltex?label=)![release date](https://badgen.net/github/last-commit/valentjn/vscode-ltex/release?label=)][website]&nbsp;
[![installs](https://badgen.net/vs-marketplace/i/valentjn.vscode-ltex)][website]&nbsp;
[![rating](https://badgen.net/vs-marketplace/rating/valentjn.vscode-ltex)][marketplace]

[![vscode-ltex](https://badgen.net/github/license/valentjn/vscode-ltex?label=vscode-ltex)](https://github.com/valentjn/vscode-ltex)&nbsp;
[![CI status](https://github.com/valentjn/vscode-ltex/workflows/CI/badge.svg?branch=release)](https://github.com/valentjn/vscode-ltex/actions?query=workflow%3A%22CI%22+branch%3Arelease)&nbsp;
[![stars](https://badgen.net/github/stars/valentjn/vscode-ltex)](https://github.com/valentjn/vscode-ltex)&nbsp;
[![open issues](https://badgen.net/github/open-issues/valentjn/vscode-ltex?label=open/closed%20issues&color=blue)](https://github.com/valentjn/vscode-ltex/issues)&nbsp;[![closed issues](https://badgen.net/github/closed-issues/valentjn/vscode-ltex?label=)](https://github.com/valentjn/vscode-ltex/issues)\
[![ltex-ls](https://badgen.net/github/license/valentjn/ltex-ls?label=ltex-ls)](https://github.com/valentjn/ltex-ls)&nbsp;
[![CI status](https://github.com/valentjn/ltex-ls/workflows/CI/badge.svg?branch=release)](https://github.com/valentjn/ltex-ls/actions?query=workflow%3A%22CI%22+branch%3Arelease)&nbsp;
[![coverage](https://badgen.net/coveralls/c/github/valentjn/ltex-ls/release)](https://coveralls.io/github/valentjn/ltex-ls)&nbsp;
[![stars](https://badgen.net/github/stars/valentjn/ltex-ls)](https://github.com/valentjn/ltex-ls)&nbsp;
[![open issues](https://badgen.net/github/open-issues/valentjn/ltex-ls?label=open/closed%20issues&color=blue)](https://github.com/valentjn/ltex-ls/issues)&nbsp;[![closed issues](https://badgen.net/github/closed-issues/valentjn/ltex-ls?label=)](https://github.com/valentjn/ltex-ls/issues)

**LT<sub>E</sub>X** provides offline grammar checking of various markup languages in Visual Studio Code using [LanguageTool (LT)](https://languagetool.org/). LT<sub>E</sub>X currently supports BibT<sub>E</sub>X, L<sup>A</sup>T<sub>E</sub>X, Markdown, Org, reStructuredText, R Sweave, and XHTML documents. In addition, LT<sub>E</sub>X can check comments in many popular programming languages (optional, opt-in).

The difference to regular spell checkers is that LT<sub>E</sub>X not only detects spelling errors, but also many grammar and stylistic errors such as:

- `This is an mistake.`
- `The bananas is tasty.`
- `We look forward to welcome you.`
- `Are human beings any different than animals?`

A classic use case of LT<sub>E</sub>X is checking scientific L<sup>A</sup>T<sub>E</sub>X papers in VS Code, but why not check your next blog post, book chapter, or long e-mail before you send it to someone else?

[Find more information and documentation about LT<sub>E</sub>X on the official website.][website]

LT<sub>E</sub>X is a successor (since it's a fork) of the abandoned [LanguageTool for Visual Studio Code extension](https://github.com/adamvoss/vscode-languagetool) by Adam Voss<sup>†</sup>.

## Features

![Grammar/Spell Checker for VS Code with LanguageTool and LaTeX Support](https://github.com/valentjn/vscode-ltex/raw/release/img/banner-ltex.png)

- **Supported markup languages:** BibT<sub>E</sub>X, L<sup>A</sup>T<sub>E</sub>X, Markdown, Org, reStructuredText, R Sweave, XHTML
- Comment checking in **many popular programming languages** (optional, opt-in)
- Comes with **everything included,** no need to install Java or LanguageTool
- **Offline checking:** Does not upload anything to the internet
- Supports **over 20 languages:** English, French, German, Dutch, Chinese, Russian, etc.
- **Issue highlighting** with hover description
- **Replacement suggestions** via quick fixes
- **User dictionaries**
- **Multilingual support** with babel commands or magic comments
- Possibility to use **external LanguageTool servers**
- **Extensive [documentation][website]**

## Requirements

- 64-bit operating system
- [VS Code 1.52.0 or newer](https://code.visualstudio.com/)
- Optional:
  - If you want to check documents written in a markup language that VS Code does not support out-of-the-box (e.g., L<sup>A</sup>T<sub>E</sub>X), install an extension that provides support for that language (e.g., [LaTeX Workshop Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop)) in addition to this extension.

## How to Use

1. Install the requirements listed above
2. Install this extension (see [download options](https://valentjn.github.io/vscode-ltex/docs/installation-and-usage.html#how-to-install-and-use))
3. Reload the VS Code window if necessary
4. Open a L<sup>A</sup>T<sub>E</sub>X or a Markdown document, or open a new file and change the language mode to `LaTeX` or `Markdown` (open the Command Palette and select `Change Language Mode`)
5. Wait until [ltex-ls](https://valentjn.github.io/vscode-ltex/docs/faq.html#whats-the-difference-between-vscode-ltex-ltex-ls-and-languagetool) and Java have been found; if necessary, LT<sub>E</sub>X downloads both for you. Alternatively, you can choose [offline installation](https://valentjn.github.io/vscode-ltex/docs/installation-and-usage.html#offline-installation).
6. Grammar/spelling errors will be displayed! (if there are any)

## Information & Documentation

- [General Information](https://valentjn.github.io/vscode-ltex/index.html)
  - [Overview](https://valentjn.github.io/vscode-ltex/index.html)
  - [Download — VS Marketplace](https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex)
  - [Code/Issues — GitHub](https://github.com/valentjn/vscode-ltex)
- [Documentation](https://valentjn.github.io/vscode-ltex/docs/installation-and-usage.html)
  - [Installation and Usage](https://valentjn.github.io/vscode-ltex/docs/installation-and-usage.html)
    - [Requirements](https://valentjn.github.io/vscode-ltex/docs/installation-and-usage.html#requirements)
    - [Download Providers](https://valentjn.github.io/vscode-ltex/docs/installation-and-usage.html#download-providers)
    - [How to Install and Use](https://valentjn.github.io/vscode-ltex/docs/installation-and-usage.html#how-to-install-and-use)
    - [Offline Installation](https://valentjn.github.io/vscode-ltex/docs/installation-and-usage.html#offline-installation)
      - [First Alternative: Download the Offline Version of LT<sub>E</sub>X](https://valentjn.github.io/vscode-ltex/docs/installation-and-usage.html#first-alternative-download-the-offline-version-of-ltex)
      - [Second Alternative: Download ltex-ls/Java Manually](https://valentjn.github.io/vscode-ltex/docs/installation-and-usage.html#second-alternative-download-ltex-lsjava-manually)
  - [Advanced Usage](https://valentjn.github.io/vscode-ltex/docs/advanced-usage.html)
    - [Multi-Scope Settings](https://valentjn.github.io/vscode-ltex/docs/advanced-usage.html#multi-scope-settings)
    - [External Setting Files](https://valentjn.github.io/vscode-ltex/docs/advanced-usage.html#external-setting-files)
    - [Magic Comments](https://valentjn.github.io/vscode-ltex/docs/advanced-usage.html#magic-comments)
    - [Multilingual L<sup>A</sup>T<sub>E</sub>X Documents with the babel Package](https://valentjn.github.io/vscode-ltex/docs/advanced-usage.html#multilingual-latex-documents-with-the-babel-package)
    - [Hiding False Positives with Regular Expressions](https://valentjn.github.io/vscode-ltex/docs/advanced-usage.html#hiding-false-positives-with-regular-expressions)
    - [Keyboard Shortcuts for Quick Fixes](https://valentjn.github.io/vscode-ltex/docs/advanced-usage.html#keyboard-shortcuts-for-quick-fixes)
    - [LanguageTool HTTP Servers](https://valentjn.github.io/vscode-ltex/docs/advanced-usage.html#languagetool-http-servers)
  - [Supported Languages](https://valentjn.github.io/vscode-ltex/docs/supported-languages.html)
    - [Code Languages](https://valentjn.github.io/vscode-ltex/docs/supported-languages.html#code-languages)
      - [Markup Languages](https://valentjn.github.io/vscode-ltex/docs/supported-languages.html#markup-languages)
      - [Programming Languages](https://valentjn.github.io/vscode-ltex/docs/supported-languages.html#programming-languages)
    - [Natural Languages](https://valentjn.github.io/vscode-ltex/docs/supported-languages.html#natural-languages)
  - [Settings](https://valentjn.github.io/vscode-ltex/docs/settings.html)
    - [`ltex.enabled`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexenabled)
    - [`ltex.language`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexlanguage)
    - [`ltex.dictionary`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexdictionary)
    - [`ltex.disabledRules`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexdisabledrules)
    - [`ltex.enabledRules`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexenabledrules)
    - [`ltex.hiddenFalsePositives`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexhiddenfalsepositives)
    - [`ltex.bibtex.fields`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexbibtexfields)
    - [`ltex.latex.commands`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexlatexcommands)
    - [`ltex.latex.environments`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexlatexenvironments)
    - [`ltex.markdown.nodes`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexmarkdownnodes)
    - [`ltex.configurationTarget`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexconfigurationtarget)
    - [`ltex.additionalRules.enablePickyRules`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexadditionalrulesenablepickyrules)
    - [`ltex.additionalRules.motherTongue`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexadditionalrulesmothertongue)
    - [`ltex.additionalRules.languageModel`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexadditionalruleslanguagemodel)
    - [`ltex.additionalRules.neuralNetworkModel`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexadditionalrulesneuralnetworkmodel)
    - [`ltex.additionalRules.word2VecModel`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexadditionalrulesword2vecmodel)
    - [`ltex.ltex-ls.path`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexltex-lspath)
    - [`ltex.ltex-ls.languageToolHttpServerUri`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexltex-lslanguagetoolhttpserveruri)
    - [`ltex.ltex-ls.logLevel`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexltex-lsloglevel)
    - [`ltex.java.path`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexjavapath)
    - [`ltex.java.forceTrySystemWide`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexjavaforcetrysystemwide)
    - [`ltex.java.initialHeapSize`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexjavainitialheapsize)
    - [`ltex.java.maximumHeapSize`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexjavamaximumheapsize)
    - [`ltex.sentenceCacheSize`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexsentencecachesize)
    - [`ltex.diagnosticSeverity`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexdiagnosticseverity)
    - [`ltex.checkFrequency`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexcheckfrequency)
    - [`ltex.clearDiagnosticsWhenClosingFile`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexcleardiagnosticswhenclosingfile)
    - [`ltex.statusBarItem`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltexstatusbaritem)
    - [`ltex.trace.server`](https://valentjn.github.io/vscode-ltex/docs/settings.html#ltextraceserver)
  - [Commands](https://valentjn.github.io/vscode-ltex/docs/commands.html)
    - [`LTeX: Activate Extension`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-activate-extension)
    - [`LTeX: Check Selection`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-check-selection)
    - [`LTeX: Check Current Document`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-check-current-document)
    - [`LTeX: Check All Documents in Workspace`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-check-all-documents-in-workspace)
    - [`LTeX: Clear Diagnostics in Current Document`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-clear-diagnostics-in-current-document)
    - [`LTeX: Clear All Diagnostics`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-clear-all-diagnostics)
    - [`LTeX: Show Status Information`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-show-status-information)
    - [`LTeX: Reset and Restart`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-reset-and-restart)
    - [`LTeX: Report Bug in LTeX`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-report-bug-in-ltex)
    - [`LTeX: Request Feature for LTeX`](https://valentjn.github.io/vscode-ltex/docs/commands.html#ltex-request-feature-for-ltex)
  - [FAQ](https://valentjn.github.io/vscode-ltex/docs/faq.html)
    - [What's the difference between vscode-ltex, ltex-ls, and LanguageTool?](https://valentjn.github.io/vscode-ltex/docs/faq.html#whats-the-difference-between-vscode-ltex-ltex-ls-and-languagetool)
    - [How can I prevent LT<sub>E</sub>X from redownloading ltex-ls and Java after every update?](https://valentjn.github.io/vscode-ltex/docs/faq.html#how-can-i-prevent-ltex-from-redownloading-ltex-ls-and-java-after-every-update)
    - [Why does LT<sub>E</sub>X have such a high CPU load?](https://valentjn.github.io/vscode-ltex/docs/faq.html#why-does-ltex-have-such-a-high-cpu-load)
    - [Where does LT<sub>E</sub>X save its settings (e.g., dictionary, false positives)?](https://valentjn.github.io/vscode-ltex/docs/faq.html#where-does-ltex-save-its-settings-eg-dictionary-false-positives)
    - [How can I check multiple languages at once?](https://valentjn.github.io/vscode-ltex/docs/faq.html#how-can-i-check-multiple-languages-at-once)
    - [Why does LT<sub>E</sub>X check in a different language than expected?](https://valentjn.github.io/vscode-ltex/docs/faq.html#why-does-ltex-check-in-a-different-language-than-expected)
    - [How can I fix multiple spelling errors at the same time?](https://valentjn.github.io/vscode-ltex/docs/faq.html#how-can-i-fix-multiple-spelling-errors-at-the-same-time)
    - [How can I prevent `\text{...}` in math mode from producing false positives?](https://valentjn.github.io/vscode-ltex/docs/faq.html#how-can-i-prevent-text-in-math-mode-from-producing-false-positives)
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
      - [Pre-Releases](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#pre-releases)
      - [Documentation](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#documentation)
      - [Internationalization (I18n)](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#internationalization-i18n)
    - [Contribution Guidelines](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#contribution-guidelines)
      - [Guidelines About Issues](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#guidelines-about-issues)
      - [Guidelines About Versioning](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#guidelines-about-versioning)
      - [Guidelines About Fundamental Changes](https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#guidelines-about-fundamental-changes)
  - [Code of Conduct](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html)
    - [Our Pledge](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html#our-pledge)
    - [Our Standards](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html#our-standards)
    - [Enforcement Responsibilities](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html#enforcement-responsibilities)
    - [Scope](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html#scope)
    - [Enforcement](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html#enforcement)
    - [Enforcement Guidelines](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html#enforcement-guidelines)
      - [1. Correction](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html#1-correction)
      - [2. Warning](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html#2-warning)
      - [3. Temporary Ban](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html#3-temporary-ban)
      - [4. Permanent Ban](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html#4-permanent-ban)
    - [Attribution](https://valentjn.github.io/vscode-ltex/docs/code-of-conduct.html#attribution)
  - [Acknowledgments](https://valentjn.github.io/vscode-ltex/docs/acknowledgments.html)
    - [LanguageTool Extension for Visual Studio Code](https://valentjn.github.io/vscode-ltex/docs/acknowledgments.html#languagetool-extension-for-visual-studio-code)
    - [ltex-ls](https://valentjn.github.io/vscode-ltex/docs/acknowledgments.html#ltex-ls)

[marketplace]: https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex
[website]: https://valentjn.github.io/vscode-ltex/
