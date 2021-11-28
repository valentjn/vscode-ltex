<!--
   - Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
   -
   - This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/.
   -->

<!-- #if TARGET == 'vscode' -->
# LT<sub>E</sub>X Extension for VS Code: Grammar/Spell Checker Using LanguageTool with Support for L<sup>A</sup>T<sub>E</sub>X, Markdown, and Others
<!-- #elseif TARGET == 'coc.nvim' -->
<!-- # LT<sub>E</sub>X Extension for coc.nvim: Grammar/Spell Checker Using LanguageTool with Support for L<sup>A</sup>T<sub>E</sub>X, Markdown, and Others -->
<!-- #endif -->

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

<!-- #if TARGET == 'vscode' -->
**LT<sub>E</sub>X** provides offline grammar checking of various markup languages in Visual Studio Code using [LanguageTool (LT)](https://languagetool.org/). LT<sub>E</sub>X currently supports BibT<sub>E</sub>X, ConT<sub>E</sub>Xt, L<sup>A</sup>T<sub>E</sub>X, Markdown, Org, reStructuredText, R Sweave, and XHTML documents. In addition, LT<sub>E</sub>X can check comments in many popular programming languages (optional, opt-in).
<!-- #elseif TARGET == 'coc.nvim' -->
<!-- **LT<sub>E</sub>X** provides offline grammar checking of various markup languages in Vim/Neovim using [LanguageTool (LT)](https://languagetool.org/) and [coc.nvim](https://github.com/neoclide/coc.nvim). LT<sub>E</sub>X currently supports BibT<sub>E</sub>X, ConT<sub>E</sub>Xt, L<sup>A</sup>T<sub>E</sub>X, Markdown, Org, reStructuredText, R Sweave, and XHTML documents. In addition, LT<sub>E</sub>X can check comments in many popular programming languages (optional, opt-in). -->
<!-- #endif -->

The difference to regular spell checkers is that LT<sub>E</sub>X not only detects spelling errors, but also many grammar and stylistic errors such as:

- `This is an mistake.`
- `The bananas is tasty.`
- `We look forward to welcome you.`
- `Are human beings any different than animals?`

A classic use case of LT<sub>E</sub>X is checking scientific L<sup>A</sup>T<sub>E</sub>X papers, but why not check your next blog post, book chapter, or long e-mail before you send it to someone else?

[Find more information and documentation about LT<sub>E</sub>X on the official website.][website]

LT<sub>E</sub>X is a successor (since it's a fork) of the abandoned [LanguageTool for Visual Studio Code extension](https://github.com/adamvoss/vscode-languagetool) by Adam Voss<sup>†</sup>.

## Features

![Grammar/Spell Checker for VS Code with LanguageTool and LaTeX Support](https://github.com/valentjn/vscode-ltex/raw/release/img/banner-ltex.png)

- **Supported markup languages:** BibT<sub>E</sub>X, ConT<sub>E</sub>Xt, L<sup>A</sup>T<sub>E</sub>X, Markdown, Org, reStructuredText, R Sweave, XHTML
- Comment checking in **many popular programming languages** (optional, opt-in)
- Comes with **everything included,** no need to install Java or LanguageTool
- **Offline checking:** Does not upload anything to the internet
- Supports **over 20 languages:** English, French, German, Dutch, Chinese, Russian, etc.
- **Issue highlighting** with hover description
- **Replacement suggestions** via quick fixes
- **User dictionaries**
- **Multilingual support** with babel commands or magic comments
- Possibility to use **external LanguageTool servers**
- **[Extensive documentation][website]**

## Requirements

<!-- #if TARGET == 'vscode' -->
- 64-bit Linux, Mac, or Windows operating system
- [VS Code 1.52.0 or newer](https://code.visualstudio.com/)
- Optional:
  - If you want to check documents written in a markup language that VS Code does not support out-of-the-box (e.g., L<sup>A</sup>T<sub>E</sub>X), install an extension that provides support for that language (e.g., [LaTeX Workshop Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop)) in addition to this extension.
<!-- #elseif TARGET == 'coc.nvim' -->
<!-- - 64-bit Linux, Mac, or Windows operating system -->
<!-- - [Node.js 14.16.0 or later](https://nodejs.org/) -->
<!-- - [Vim](https://www.vim.org/) or [Neovim](https://neovim.io/) with [coc.nvim 0.0.80 or newer](https://github.com/neoclide/coc.nvim) -->
<!-- #endif -->

## How to Use

<!-- #if TARGET == 'vscode' -->
1. Install the requirements listed above
2. Install this extension (see [download options](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-vscode-ltex.html#how-to-install-and-use))
3. Reload the VS Code window if necessary
4. Open a L<sup>A</sup>T<sub>E</sub>X or a Markdown document, or open a new file and change the language mode to `LaTeX` or `Markdown` (open the Command Palette and select `Change Language Mode`)
5. Wait until [ltex-ls](https://valentjn.github.io/ltex/faq.html#whats-the-difference-between-vscode-ltex-ltex-ls-and-languagetool) has been found; if necessary, LT<sub>E</sub>X downloads it for you. Alternatively, you can choose [offline installation](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-vscode-ltex.html#offline-installation).
6. Grammar/spelling errors will be displayed! (if there are any)
<!-- #elseif TARGET == 'coc.nvim' -->
<!-- 1. Install the requirements listed above -->
<!-- 2. Install coc-ltex by running `:CocInstall coc-ltex` -->
<!-- 3. If you want to check LaTeX documents: Add `let g:coc_filetype_map = {'tex': 'latex'}` to `~/.vimrc` (Vim) or `~/.config/nvim/init.vim` (workaround for [#425](https://github.com/valentjn/vscode-ltex/issues/425), until [neoclide/coc.nvim#3433](https://github.com/neoclide/coc.nvim/pull/3433) is released) -->
<!-- 4. Open a LaTeX or a Markdown document -->
<!-- 5. Wait until [ltex-ls](https://valentjn.github.io/ltex/faq.html#whats-the-difference-between-vscode-ltex-ltex-ls-and-languagetool) has been downloaded and started -->
<!-- 6. Grammar/spelling errors will be displayed! (if there are any) -->
<!-- #endif -->

## Information & Documentation

- [General Information](https://valentjn.github.io/ltex/index.html)
  - [Overview](https://valentjn.github.io/ltex/index.html)
  - [Installation &amp; Usage](https://valentjn.github.io/ltex/installation-usage.html)
    - [Via Editor Extensions](https://valentjn.github.io/ltex/installation-usage.html#via-editor-extensions)
      - [Official Extensions](https://valentjn.github.io/ltex/installation-usage.html#official-extensions)
      - [Third-Party Extensions](https://valentjn.github.io/ltex/installation-usage.html#third-party-extensions)
    - [Via Language Clients](https://valentjn.github.io/ltex/installation-usage.html#via-language-clients)
    - [Via Command Line](https://valentjn.github.io/ltex/installation-usage.html#via-command-line)
  - [Supported Languages](https://valentjn.github.io/ltex/supported-languages.html)
    - [Code Languages](https://valentjn.github.io/ltex/supported-languages.html#code-languages)
      - [Markup Languages](https://valentjn.github.io/ltex/supported-languages.html#markup-languages)
      - [Programming Languages](https://valentjn.github.io/ltex/supported-languages.html#programming-languages)
    - [Natural Languages](https://valentjn.github.io/ltex/supported-languages.html#natural-languages)
  - [Advanced Usage](https://valentjn.github.io/ltex/advanced-usage.html)
    - [Magic Comments](https://valentjn.github.io/ltex/advanced-usage.html#magic-comments)
    - [Multilingual L<sup>A</sup>T<sub>E</sub>X Documents with the babel Package](https://valentjn.github.io/ltex/advanced-usage.html#multilingual-latex-documents-with-the-babel-package)
    - [Set Language in Markdown with YAML Front Matter](https://valentjn.github.io/ltex/advanced-usage.html#set-language-in-markdown-with-yaml-front-matter)
    - [Hiding False Positives with Regular Expressions](https://valentjn.github.io/ltex/advanced-usage.html#hiding-false-positives-with-regular-expressions)
    - [LanguageTool HTTP Servers](https://valentjn.github.io/ltex/advanced-usage.html#languagetool-http-servers)
  - [Settings](https://valentjn.github.io/ltex/settings.html)
    - [`ltex.enabled`](https://valentjn.github.io/ltex/settings.html#ltexenabled)
    - [`ltex.language`](https://valentjn.github.io/ltex/settings.html#ltexlanguage)
    - [`ltex.dictionary`](https://valentjn.github.io/ltex/settings.html#ltexdictionary)
    - [`ltex.disabledRules`](https://valentjn.github.io/ltex/settings.html#ltexdisabledrules)
    - [`ltex.enabledRules`](https://valentjn.github.io/ltex/settings.html#ltexenabledrules)
    - [`ltex.hiddenFalsePositives`](https://valentjn.github.io/ltex/settings.html#ltexhiddenfalsepositives)
    - [`ltex.bibtex.fields`](https://valentjn.github.io/ltex/settings.html#ltexbibtexfields)
    - [`ltex.latex.commands`](https://valentjn.github.io/ltex/settings.html#ltexlatexcommands)
    - [`ltex.latex.environments`](https://valentjn.github.io/ltex/settings.html#ltexlatexenvironments)
    - [`ltex.markdown.nodes`](https://valentjn.github.io/ltex/settings.html#ltexmarkdownnodes)
    - [`ltex.configurationTarget`](https://valentjn.github.io/ltex/settings.html#ltexconfigurationtarget)
    - [`ltex.additionalRules.enablePickyRules`](https://valentjn.github.io/ltex/settings.html#ltexadditionalrulesenablepickyrules)
    - [`ltex.additionalRules.motherTongue`](https://valentjn.github.io/ltex/settings.html#ltexadditionalrulesmothertongue)
    - [`ltex.additionalRules.languageModel`](https://valentjn.github.io/ltex/settings.html#ltexadditionalruleslanguagemodel)
    - [`ltex.additionalRules.neuralNetworkModel`](https://valentjn.github.io/ltex/settings.html#ltexadditionalrulesneuralnetworkmodel)
    - [`ltex.additionalRules.word2VecModel`](https://valentjn.github.io/ltex/settings.html#ltexadditionalrulesword2vecmodel)
    - [`ltex.languageToolHttpServerUri`](https://valentjn.github.io/ltex/settings.html#ltexlanguagetoolhttpserveruri)
    - [`ltex.languageToolOrg.username`](https://valentjn.github.io/ltex/settings.html#ltexlanguagetoolorgusername)
    - [`ltex.languageToolOrg.apiKey`](https://valentjn.github.io/ltex/settings.html#ltexlanguagetoolorgapikey)
    - [`ltex.ltex-ls.path`](https://valentjn.github.io/ltex/settings.html#ltexltex-lspath)
    - [`ltex.ltex-ls.logLevel`](https://valentjn.github.io/ltex/settings.html#ltexltex-lsloglevel)
    - [`ltex.java.path`](https://valentjn.github.io/ltex/settings.html#ltexjavapath)
    - [`ltex.java.initialHeapSize`](https://valentjn.github.io/ltex/settings.html#ltexjavainitialheapsize)
    - [`ltex.java.maximumHeapSize`](https://valentjn.github.io/ltex/settings.html#ltexjavamaximumheapsize)
    - [`ltex.sentenceCacheSize`](https://valentjn.github.io/ltex/settings.html#ltexsentencecachesize)
    - [`ltex.completionEnabled`](https://valentjn.github.io/ltex/settings.html#ltexcompletionenabled)
    - [`ltex.diagnosticSeverity`](https://valentjn.github.io/ltex/settings.html#ltexdiagnosticseverity)
    - [`ltex.checkFrequency`](https://valentjn.github.io/ltex/settings.html#ltexcheckfrequency)
    - [`ltex.clearDiagnosticsWhenClosingFile`](https://valentjn.github.io/ltex/settings.html#ltexcleardiagnosticswhenclosingfile)
    - [`ltex.statusBarItem`](https://valentjn.github.io/ltex/settings.html#ltexstatusbaritem)
    - [`ltex.trace.server`](https://valentjn.github.io/ltex/settings.html#ltextraceserver)
  - [FAQ](https://valentjn.github.io/ltex/faq.html)
    - [General Questions](https://valentjn.github.io/ltex/faq.html#general-questions)
      - [What's the difference between vscode-ltex, ltex-ls, and LanguageTool?](https://valentjn.github.io/ltex/faq.html#whats-the-difference-between-vscode-ltex-ltex-ls-and-languagetool)
      - [Why does LT<sub>E</sub>X have such a high CPU load?](https://valentjn.github.io/ltex/faq.html#why-does-ltex-have-such-a-high-cpu-load)
      - [How can I check multiple languages at once?](https://valentjn.github.io/ltex/faq.html#how-can-i-check-multiple-languages-at-once)
      - [Why does LT<sub>E</sub>X check in a different language than expected?](https://valentjn.github.io/ltex/faq.html#why-does-ltex-check-in-a-different-language-than-expected)
      - [How can I fix multiple spelling errors at the same time?](https://valentjn.github.io/ltex/faq.html#how-can-i-fix-multiple-spelling-errors-at-the-same-time)
      - [How can I prevent `\text{...}` in math mode from producing false positives?](https://valentjn.github.io/ltex/faq.html#how-can-i-prevent-text-in-math-mode-from-producing-false-positives)
      - [What does LT<sub>E</sub>X stand for?](https://valentjn.github.io/ltex/faq.html#what-does-ltex-stand-for)
      - [Where can I ask a question that's not answered here?](https://valentjn.github.io/ltex/faq.html#where-can-i-ask-a-question-thats-not-answered-here)
    - [Questions about vscode-ltex](https://valentjn.github.io/ltex/faq.html#questions-about-vscode-ltex)
      - [How can I prevent vscode-ltex from redownloading ltex-ls after every update?](https://valentjn.github.io/ltex/faq.html#how-can-i-prevent-vscode-ltex-from-redownloading-ltex-ls-after-every-update)
      - [Where does vscode-ltex save its settings (e.g., dictionary, false positives)?](https://valentjn.github.io/ltex/faq.html#where-does-vscode-ltex-save-its-settings-eg-dictionary-false-positives)
      - [How can I map the `Use '...'` quick fix to a keyboard shortcut in VS Code?](https://valentjn.github.io/ltex/faq.html#how-can-i-map-the-use--quick-fix-to-a-keyboard-shortcut-in-vs-code)
  - [Code of Conduct](https://valentjn.github.io/ltex/code-of-conduct.html)
    - [Our Pledge](https://valentjn.github.io/ltex/code-of-conduct.html#our-pledge)
    - [Our Standards](https://valentjn.github.io/ltex/code-of-conduct.html#our-standards)
    - [Enforcement Responsibilities](https://valentjn.github.io/ltex/code-of-conduct.html#enforcement-responsibilities)
    - [Scope](https://valentjn.github.io/ltex/code-of-conduct.html#scope)
    - [Enforcement](https://valentjn.github.io/ltex/code-of-conduct.html#enforcement)
    - [Enforcement Guidelines](https://valentjn.github.io/ltex/code-of-conduct.html#enforcement-guidelines)
      - [1. Correction](https://valentjn.github.io/ltex/code-of-conduct.html#1-correction)
      - [2. Warning](https://valentjn.github.io/ltex/code-of-conduct.html#2-warning)
      - [3. Temporary Ban](https://valentjn.github.io/ltex/code-of-conduct.html#3-temporary-ban)
      - [4. Permanent Ban](https://valentjn.github.io/ltex/code-of-conduct.html#4-permanent-ban)
    - [Attribution](https://valentjn.github.io/ltex/code-of-conduct.html#attribution)
- [vscode-ltex / coc-ltex](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-vscode-ltex.html)
  - [Installation &amp; Usage (vscode-ltex)](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-vscode-ltex.html)
    - [Download Providers](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-vscode-ltex.html#download-providers)
    - [Requirements](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-vscode-ltex.html#requirements)
    - [How to Install and Use](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-vscode-ltex.html#how-to-install-and-use)
    - [Offline Installation](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-vscode-ltex.html#offline-installation)
      - [First Alternative: Download the Offline Version of LT<sub>E</sub>X](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-vscode-ltex.html#first-alternative-download-the-offline-version-of-ltex)
      - [Second Alternative: Download ltex-ls/Java Manually](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-vscode-ltex.html#second-alternative-download-ltex-lsjava-manually)
  - [Installation &amp; Usage (coc-ltex)](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-coc-ltex.html)
    - [Download Providers](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-coc-ltex.html#download-providers)
    - [Requirements](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-coc-ltex.html#requirements)
    - [How to Install and Use](https://valentjn.github.io/ltex/vscode-ltex/installation-usage-coc-ltex.html#how-to-install-and-use)
  - [Setting Scopes &amp; Files](https://valentjn.github.io/ltex/vscode-ltex/setting-scopes-files.html)
    - [Multi-Scope Settings](https://valentjn.github.io/ltex/vscode-ltex/setting-scopes-files.html#multi-scope-settings)
    - [External Setting Files](https://valentjn.github.io/ltex/vscode-ltex/setting-scopes-files.html#external-setting-files)
  - [Commands](https://valentjn.github.io/ltex/vscode-ltex/commands.html)
    - [`LTeX: Activate Extension`](https://valentjn.github.io/ltex/vscode-ltex/commands.html#ltex-activate-extension)
    - [`LTeX: Check Selection`](https://valentjn.github.io/ltex/vscode-ltex/commands.html#ltex-check-selection)
    - [`LTeX: Check Current Document`](https://valentjn.github.io/ltex/vscode-ltex/commands.html#ltex-check-current-document)
    - [`LTeX: Check All Documents in Workspace`](https://valentjn.github.io/ltex/vscode-ltex/commands.html#ltex-check-all-documents-in-workspace)
    - [`LTeX: Clear Diagnostics in Current Document`](https://valentjn.github.io/ltex/vscode-ltex/commands.html#ltex-clear-diagnostics-in-current-document)
    - [`LTeX: Clear All Diagnostics`](https://valentjn.github.io/ltex/vscode-ltex/commands.html#ltex-clear-all-diagnostics)
    - [`LTeX: Show Status Information`](https://valentjn.github.io/ltex/vscode-ltex/commands.html#ltex-show-status-information)
    - [`LTeX: Reset and Restart`](https://valentjn.github.io/ltex/vscode-ltex/commands.html#ltex-reset-and-restart)
    - [`LTeX: Report Bug in LTeX`](https://valentjn.github.io/ltex/vscode-ltex/commands.html#ltex-report-bug-in-ltex)
    - [`LTeX: Request Feature for LTeX`](https://valentjn.github.io/ltex/vscode-ltex/commands.html#ltex-request-feature-for-ltex)
  - [Changelog](https://valentjn.github.io/ltex/vscode-ltex/changelog.html)
  - [Contributing](https://valentjn.github.io/ltex/vscode-ltex/contributing.html)
    - [Ways of Contribution](https://valentjn.github.io/ltex/vscode-ltex/contributing.html#ways-of-contribution)
    - [How to Report Bugs](https://valentjn.github.io/ltex/vscode-ltex/contributing.html#how-to-report-bugs)
      - [Known Issues and Limitations](https://valentjn.github.io/ltex/vscode-ltex/contributing.html#known-issues-and-limitations)
    - [How to Request Features](https://valentjn.github.io/ltex/vscode-ltex/contributing.html#how-to-request-features)
    - [How to Set Up the Project](https://valentjn.github.io/ltex/vscode-ltex/contributing.html#how-to-set-up-the-project)
    - [How to Contribute Code](https://valentjn.github.io/ltex/vscode-ltex/contributing.html#how-to-contribute-code)
    - [How to Test Pre-Releases](https://valentjn.github.io/ltex/vscode-ltex/contributing.html#how-to-test-pre-releases)
    - [How to Edit the Documentation](https://valentjn.github.io/ltex/vscode-ltex/contributing.html#how-to-edit-the-documentation)
    - [How to Translate the User Interface](https://valentjn.github.io/ltex/vscode-ltex/contributing.html#how-to-translate-the-user-interface)
- [ltex-ls (LT<sub>E</sub>X LS)](https://valentjn.github.io/ltex/ltex-ls/installation.html)
  - [Installation](https://valentjn.github.io/ltex/ltex-ls/installation.html)
    - [Download Providers](https://valentjn.github.io/ltex/ltex-ls/installation.html#download-providers)
    - [Requirements](https://valentjn.github.io/ltex/ltex-ls/installation.html#requirements)
    - [Installation](https://valentjn.github.io/ltex/ltex-ls/installation.html#installation)
  - [Server Usage](https://valentjn.github.io/ltex/ltex-ls/server-usage.html)
    - [Startup](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#startup)
      - [Command-Line Arguments](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#command-line-arguments)
      - [Exit Codes](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#exit-codes)
    - [Checking Documents with the LSP](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#checking-documents-with-the-lsp)
    - [Settings](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#settings)
    - [Quick Fixes](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#quick-fixes)
    - [Commands](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#commands)
      - [`_ltex.addToDictionary` (Client)](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#ltexaddtodictionary-client)
      - [`_ltex.disableRules` (Client)](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#ltexdisablerules-client)
      - [`_ltex.hideFalsePositives` (Client)](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#ltexhidefalsepositives-client)
      - [`_ltex.checkDocument` (Server)](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#ltexcheckdocument-server)
      - [`_ltex.getServerStatus` (Server)](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#ltexgetserverstatus-server)
    - [Custom LSP Extensions](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#custom-lsp-extensions)
      - [Custom Initialization Options](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#custom-initialization-options)
      - [Custom Requests and Notifications](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#custom-requests-and-notifications)
        - [`ltex/workspaceSpecificConfiguration` (⮎)](https://valentjn.github.io/ltex/ltex-ls/server-usage.html#ltexworkspacespecificconfiguration-)
  - [CLI Usage](https://valentjn.github.io/ltex/ltex-ls/cli-usage.html)
    - [Startup](https://valentjn.github.io/ltex/ltex-ls/cli-usage.html#startup)
      - [Command-Line Arguments](https://valentjn.github.io/ltex/ltex-ls/cli-usage.html#command-line-arguments)
      - [Exit Codes](https://valentjn.github.io/ltex/ltex-ls/cli-usage.html#exit-codes)
  - [Changelog](https://valentjn.github.io/ltex/ltex-ls/changelog.html)
  - [Contributing](https://valentjn.github.io/ltex/ltex-ls/contributing.html)
    - [Ways of Contribution](https://valentjn.github.io/ltex/ltex-ls/contributing.html#ways-of-contribution)
    - [How to Report Bugs](https://valentjn.github.io/ltex/ltex-ls/contributing.html#how-to-report-bugs)
      - [Known Issues and Limitations](https://valentjn.github.io/ltex/ltex-ls/contributing.html#known-issues-and-limitations)
    - [How to Request Features](https://valentjn.github.io/ltex/ltex-ls/contributing.html#how-to-request-features)
    - [How to Set Up the Project](https://valentjn.github.io/ltex/ltex-ls/contributing.html#how-to-set-up-the-project)
    - [How to Contribute Code](https://valentjn.github.io/ltex/ltex-ls/contributing.html#how-to-contribute-code)
    - [How to Test Pre-Releases](https://valentjn.github.io/ltex/ltex-ls/contributing.html#how-to-test-pre-releases)
    - [How to Edit the Documentation](https://valentjn.github.io/ltex/ltex-ls/contributing.html#how-to-edit-the-documentation)
    - [How to Translate the User Interface](https://valentjn.github.io/ltex/ltex-ls/contributing.html#how-to-translate-the-user-interface)

[marketplace]: https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex
[website]: https://valentjn.github.io/ltex
