---
# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

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

When talking about LTeX, we usually mean the combination of vscode-ltex and ltex-ls.

## What happened to the Language Support Extensions?

The language support extension were only necessary for LTeX 4.x. Starting with LTeX 5.x, all languages supported by LanguageTool are included in ltex-ls, which is downloaded automatically by LTeX. Therefore, the language support extensions are not available anymore on the Visual Studio Marketplace. If you have LTeX 5.x installed and there are no problems after the upgrade, you should remove any installed language support extensions.

## How can I prevent LTeX from redownloading ltex-ls and Java after every update?

[As explained above](faq.html#whats-the-difference-between-vscode-ltex-ltex-ls-and-languagetool), ltex-ls is a necessary component of LTeX. Due to file size restrictions of the Visual Studio Marketplace, it is not possible to include ltex-ls in the extension itself. You can [install ltex-ls](installation-and-usage.html#second-alternative-download-ltex-lsjava-manually) locally on your computer by setting [`ltex.ltex-ls.path`](settings.html#ltexltex-lspath). However, this is not recommended as automatic updates of LTeX might break compatibility with ltex-ls.

If LTeX keeps downloading Java after every update, then you don't have a compatible version of Java installed on your computer. You can prevent LTeX from doing this by [installing Java](installation-and-usage.html#second-alternative-download-ltex-lsjava-manually). Usually, it is not necessary to set [`ltex.java.path`](settings.html#ltexjavapath) after the installation of Java, but you can use this setting if LTeX still doesn't find Java.

## Why does LTeX have such a high CPU load?

LanguageTool is not only a simple spell checker that just looks up some words in a dictionary. It is a powerful grammar checker that [checks thousands of grammar rules](https://community.languagetool.org/rule/list?lang=en) at once. This means that checking a document for the first time, either after activating the LTeX extension or after opening a document to be checked, may take a while. The exact duration depends on the length of the document and the power of the computer, but it is usually around 30 seconds and may be up to two minutes. After this initial check, edits are checked very quickly due to the feature of sentence caching (see [`ltex.sentenceCacheSize`](settings.html#ltexsentencecachesize)), and should not cause any significant CPU load.

## How can I check multiple languages at once?

This depends on whether the multiple languages only occur in different files (i.e., every file is written in a single language), or whether multiple languages occur in one file.

- If you are using LaTeX, you can use the [babel package](advanced-usage.html#multilingual-latex-documents-with-the-babel-package) to indicate the languages used. This allows LTeX to switch the checking language mid-file.
- Another way, which also works for Markdown, is using [magic comments](advanced-usage.html#magic-comments).
- If each file is written in a single language, it is possible to use [multi-root workspaces](https://code.visualstudio.com/docs/editor/multi-root-workspaces#_settings). This enables you to have one `settings.json` per folder, and allows you to set [`ltex.language`](settings.html#ltexlanguage) just for that folder.

## How can I fix multiple spelling errors at the same time?

If you have a technical text with many unknown words, adding them one by one to the user dictionary can be tedious. To add multiple words at once, select text that contains the words and execute the `Add all unknown words in selection to dictionary` quickfix, which you can select by pressing `Ctrl+.` (control and period keys together). Similarly, you can execute the other quickfixes for multiple words at once:

- Replace multiple occurrences of the same misspelled word
- Ignore all errors in the selection
- Disable all LanguageTool rules with matches in the selection

## How can I prevent `\text{...}` in math mode from producing false positives?

Many LaTeX authors use `\text` for subscripts and superscripts, e.g., `$h_{\text{up}}$`. In some languages, LTeX might display spelling errors as it thinks `up` is a part of the sentence structure. More specifically, LTeX feeds all text in LaTeX's text mode to LanguageTool after replacing all math mode formulae with placeholders. Since `\text` switches to text mode, its contents will be included in the check.

However, for subscripts and superscripts in LaTeX, `\text` should not be used. The reason is that contents of `\text` will be typeset according to the current text font, which might be bold or italic (e.g., in a standard “proposition” environment), leading to wrong bold or italic subscripts and superscripts. Instead of `\text`, `\mathrm` (or `\mathsf`, if you are using a sans-serif math font) should be used. This will also eliminate the false positive produced by LTeX. Use `\text` only for real text, i.e., only in places where you could semantically close the formula and open another one after the text.

## What does LTeX stand for?

LTeX is a portmanteau word from LT (LanguageTool) and TeX/LaTeX. TeX itself is an abbreviation of the Greek “τέχνη” (art/craft), while LaTeX is short for “Lamport TeX” after its creator Leslie Lamport. The X is pronounced like the “ch” in “loch”.

## Where can I ask a question that's not answered here?

Head over to our [GitHub repo](https://github.com/valentjn/vscode-ltex)! Before you open an issue, be sure to read the [instructions on contributing](contributing-code-issues.html).
