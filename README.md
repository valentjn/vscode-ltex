# LT<sub>E</sub>X Extension for Visual Studio Code: LanguageTool Grammar Checking with L<sup>A</sup>T<sub>E</sub>X Support

[![Travis CI build status](https://api.travis-ci.org/valentjn/vscode-ltex.svg?branch=master)](https://www.travis-ci.org/valentjn/vscode-ltex)
[![GitHub](https://img.shields.io/badge/-fork%20me%20on%20GitHub-blue)](https://github.com/valentjn/vscode-ltex)

**NOTICE: This extension does not include any languages. You MUST install a [language support extension][lang-exts].**

___

Provides offline grammar checking in Visual Studio Code using [LanguageTool](https://languagetool.org/), supporting L<sup>A</sup>T<sub>E</sub>X, Markdown, and plaintext documents. This extension provides only the core functionality. You must [install extensions containing the language rules for each language you wish to be able to check][lang-exts].

This extension is a fork of the abandoned [LanguageTool for Visual Studio Code extension](https://github.com/adamvoss/vscode-languagetool) by Adam Voss with updated dependencies (LanguageTool) and L<sup>A</sup>T<sub>E</sub>X support.

## Features

* Checks **latex**, **markdown**, and **plaintext** documents
* Supports **over 20 languages** according to which [language support extensions][lang-exts] are installed
* Issue highlighting with hover description
* Replacement suggestions via quick fixes
* User dictionaries

## Requirements

Java 8+ is required.

## Extension Settings

This extension contributes the following settings:

* `ltex.enabled`: Controls whether the extension is enabled. Allows disabling LanguageTool on specific workspaces.
* `ltex.language`: The language (e.g., `en-US`) LanguageTool should check against. For supported languages see the [list of languages at LanguageTool.org](https://languagetool.org/languages/). Requires the installation of a [language support extension][lang-exts]. See the Marketplace description of the installed *language support extension* for possible values. Use a specific variant like `en-US` or `de-DE` instead of the generic language code like `en` or `de` to obtain spelling corrections (in addition to grammar corrections).
* `ltex.<LANGUAGE>.dictionary`: List of additional words that should not be counted as spelling errors. Dictionaries are separated by language; replace `<LANGUAGE>` with the language short code from `ltex.language`. Requires the installation of a [language support extension][lang-exts].
* `ltex.commands.ignore`: List of additional L<sup>A</sup>T<sub>E</sub>X commands to be ignored by the L<sup>A</sup>T<sub>E</sub>X parser, listed together with empty arguments (e.g., `\ref{}`, `\documentclass[]{}`).
* `ltex.commands.dummy`: List of additional L<sup>A</sup>T<sub>E</sub>X commands to replace by dummy words, listed together with empty arguments (e.g., `\cite{}`, `\cite[]{}`).

## Versioning

The LT<sub>E</sub>X extension has adopted the versioning of its LanguageTool dependency. For example, if this extension has version 4.6.0 it is powered by LanguageTool 4.6. vscode-ltex 4.6.1 would also use LanguageTool 4.6. vscode-ltex 4.7.0 would use LanguageTool 4.7. **The LanguageTool version of this extension must match the LanguageTool version of your installed language support extensions.**

## Contributing

Contributions welcome! This repository uses Git submodules. After cloning, be sure to run `git submodule update --init`.

## Known Issues

* The L<sup>A</sup>T<sub>E</sub>X parser is not perfect. False positives are sometimes reported as errors. However, it is impossible to fully parse L<sup>A</sup>T<sub>E</sub>X without compiling it.

Please report issues or submit pull requests on [GitHub](https://github.com/valentjn/vscode-ltex).

## Acknowledgments

See [ACKNOWLEDGMENTS.md](./ACKNOWLEDGMENTS.md).

[lang-exts]: https://marketplace.visualstudio.com/search?term=ltex&target=VSCode
