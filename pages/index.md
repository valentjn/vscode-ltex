---
# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

title: "LTeX – Grammar/Spell Checker for VS Code Using LanguageTool with Support for LaTeX, Markdown, and Others"
permalink: "/index.html"
sidebar: "sidebar"
toc: false
---

<a href="https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex" class="no-external">![latest release](https://badgen.net/badge/-/release/585858?label=)![version number](https://badgen.net/vs-marketplace/v/valentjn.vscode-ltex?label=)![release date](https://badgen.net/github/last-commit/valentjn/vscode-ltex/release?label=)</a>&nbsp;
<a href="https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex" class="no-external">![installs](https://badgen.net/vs-marketplace/i/valentjn.vscode-ltex)</a>&nbsp;
<a href="https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex" class="no-external">![rating](https://badgen.net/vs-marketplace/rating/valentjn.vscode-ltex)</a>

<a href="https://github.com/valentjn/vscode-ltex" class="no-external">![vscode-ltex](https://badgen.net/github/license/valentjn/vscode-ltex?label=vscode-ltex)</a>&nbsp;
<a href="https://github.com/valentjn/vscode-ltex/actions?query=workflow%3A%22CI%22+branch%3Arelease" class="no-external">![CI status](https://github.com/valentjn/vscode-ltex/workflows/CI/badge.svg?branch=release)</a>&nbsp;
<a href="https://github.com/valentjn/vscode-ltex" class="no-external">![stars](https://badgen.net/github/stars/valentjn/vscode-ltex)</a>&nbsp;
<a href="https://github.com/valentjn/vscode-ltex/issues" class="no-external">![open issues](https://badgen.net/github/open-issues/valentjn/vscode-ltex?label=open/closed%20issues&color=blue)</a>&nbsp;<a href="https://github.com/valentjn/vscode-ltex/issues" class="no-external">![closed issues](https://badgen.net/github/closed-issues/valentjn/vscode-ltex?label=)</a><br/>
<a href="https://github.com/valentjn/ltex-ls" class="no-external">![ltex-ls](https://badgen.net/github/license/valentjn/ltex-ls?label=ltex-ls)</a>&nbsp;
<a href="https://github.com/valentjn/ltex-ls/actions?query=workflow%3A%22CI%22+branch%3Arelease" class="no-external">![CI status](https://github.com/valentjn/ltex-ls/workflows/CI/badge.svg?branch=release)</a>&nbsp;
<a href="https://coveralls.io/github/valentjn/ltex-ls" class="no-external">![coverage](https://badgen.net/coveralls/c/github/valentjn/ltex-ls/release)</a>&nbsp;
<a href="https://github.com/valentjn/ltex-ls" class="no-external">![stars](https://badgen.net/github/stars/valentjn/ltex-ls)</a>&nbsp;
<a href="https://github.com/valentjn/ltex-ls/issues" class="no-external">![open issues](https://badgen.net/github/open-issues/valentjn/ltex-ls?label=open/closed%20issues&color=blue)</a>&nbsp;<a href="https://github.com/valentjn/ltex-ls/issues" class="no-external">![closed issues](https://badgen.net/github/closed-issues/valentjn/ltex-ls?label=)</a>

**LTeX** provides offline grammar checking of various markup languages in Visual Studio Code using [LanguageTool&nbsp;(LT)](https://languagetool.org/). LTeX currently supports LaTeX and Markdown documents.

The difference to regular spell checkers is that LTeX not only detects spelling errors, but also many grammar and stylistic errors such as:

- `This is an mistake.`
- `The bananas is tasty.`
- `We look forward to welcome you.`
- `Are human beings any different than animals?`

A classic use case of LTeX is checking scientific LaTeX papers in VS Code, but why not check your next blog post, book chapter, or long e-mail before you send it to someone else?

LTeX is a successor (since it's a fork) of the abandoned [LanguageTool for Visual Studio Code extension](https://github.com/adamvoss/vscode-languagetool) by Adam Voss<sup>†</sup>.

<div style="margin-bottom:30px;"></div>

## Features

![Grammar/Spell Checker for VS Code with LanguageTool and LaTeX Support](https://github.com/valentjn/vscode-ltex/raw/release/img/banner-ltex.png)

- Checks **LaTeX** and **Markdown** documents
- Comes with **everything included,** no need to install Java or LanguageTool
- Supports **over 20 languages**
- **Issue highlighting** with hover description
- **Replacement suggestions** via quick fixes
- **User dictionaries**
- **Multilingual support** with babel commands or magic comments
- Possibility to use **external LanguageTool servers**
- **Extensive documentation**

<div style="margin-bottom:30px;"></div>

## Thousands of People Around the World Use LTeX

{% include stats/summary.html %}
