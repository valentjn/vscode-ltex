---
title: "FAQ"
permalink: "/docs/faq.html"
sidebar: "sidebar"
---

## What's the difference between vscode-ltex, ltex-ls, and LanguageTool?

LTeX uses the [Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/). The idea of the LSP is as follows: When a new programming language is invented, support for the new language (such as syntax highlighting, linting, etc.) has to be added to all existing editors. Conversely, when a new text editor is created, support for all existing languages has to be added to the new editor.

The LSP solves this by separating the language support from the editor support. For each language, an editor-independent language server has to be written. Compatible editors only have to implement a single language client, with lightweight boilerplate code for each language.

In the case of LTeX, the “language” is not a single natural language, but all natural languages supported by LanguageTool.

- [vscode-ltex](https://github.com/valentjn/vscode-ltex) is an extension for Visual Studio Code that implements a language client. When a LaTeX or Markdown document should be checked, it is passed to ltex-ls.
- [ltex-ls](https://github.com/valentjn/ltex-ls) is an editor-independent language server (although it has only been tested with VS Code) written in Java. Incoming LaTeX or Markdown code is parsed, converted to plaintext, and passed to LanguageTool.
- [LanguageTool](https://github.com/languagetool-org/languagetool) is a grammar and spell checker written in Java. It can be used via its Java API or standalone. LanguageTool is responsible for the actual checking.

When we talk about LTeX, we usually mean the combination of vscode-ltex and ltex-ls.

## What happened to the Language Support Extensions?

The language support extension were only necessary for LTeX 4.x. Starting with LTeX 5.x, all languages supported by LanguageTool are included in ltex-ls, which is downloaded automatically by LTeX. Therefore, the language support extensions are not available anymore on the Visual Studio Marketplace. If you have LTeX 5.x installed and there are no problems after the upgrade, you may remove any installed language support extensions.

## How can I check multiple languages at once?

This depends on whether the multiple languages only occur in different files (i.e., every file is written in a single language), or whether multiple languages occur in one file.

- In the first case, it is possible to use [multi-root workspaces](https://code.visualstudio.com/docs/editor/multi-root-workspaces#_settings). This enables you to have one `settings.json` per folder, and allows you to set [`ltex.language`](settings.html#ltexlanguage) just for that folder.
- The more flexible way, which works for both cases, is using [magic comments](advanced-features.html#magic-comments).

## What does LTeX stand for?

LTeX is a portmanteau word from LT (LanguageTool) and TeX/LaTeX. TeX itself is an abbreviation of the Greek “τέχνη” (art/craft), while LaTeX is short for “Lamport TeX” after its creator Leslie Lamport. The X is pronounced like the “ch” in “loch”.

## Where can I ask a question that's not answered here?

Head over to our [GitHub repo](https://github.com/valentjn/vscode-ltex)! Before you open an issue, be sure to read the [instructions on contributing](contributing-code-issues.html).
