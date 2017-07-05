# LanguageTool Extension for Visual Studio Code

**NOTICE: as of v0.0.2, this extension does not include any languages.  You MUST install a [language support extension][lang-exts].**
___
Provides offline grammar checking in Visual Studio Code using [LanguageTool](https://languagetool.org/) via the [LanguageTool Language Server](https://github.com/adamvoss/languagetool-languageserver).  This extension provides only the core functionality.  You must [install extensions containing the language rules for each language you wish to be able to check][lang-exts].

## Features
* Issue highlighting with hover description.
* Replacement suggestions.
* Checks **plaintext** and **markdown**.
* Support **over than 20 languages** according to which [language support extensions][lang-exts] are installed.

## Requirements
Java 8+ is required.

## Extension Settings

This extension contributes the following settings:

* `languageTool.language`: Set to the short code for the language to check.  For supported languages see the [list of languages at LanguageTool.org](https://languagetool.org/languages/).

## Versioning

LanguageTool for Visual Studio code has adopted the versioning of its LanguageTool dependency.  For example, if this extension has version 3.8.0 it is powered by LanguageTool 3.8.  vscode-languagetool 3.8.1, would also use LanguageTool 3.8.  vscode-languagetool 3.9.0 would use LanguageTool 3.9.  **The LanguageTool version of this extension must match the LanguageTool version of your installed language support extensions.**

## Contributing
Contributions welcome!  
This repository uses git submodules.  After cloning, be sure to run `git submodule update --init`.

## Known Issues
Please report issues or submit pull requests on [GitHub](https://github.com/adamvoss/vscode-languagetool).

[lang-exts]: https://marketplace.visualstudio.com/search?term=LanguageTool&target=VSCode