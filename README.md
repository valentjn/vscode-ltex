# LanguageTool Extension for Visual Studio Code

Provides offline grammar checking in Visual Studio Code using [LanguageTool](https://languagetool.org/) via the [LanguageTool Language Server](https://github.com/adamvoss/languagetool-languageserver).

## Features

## Requirements
Java 8+ is required.

## Extension Settings

This extension contributes the following settings:

* `languageTool.language`: Set to the short code for the language to check.  For supported languages see the [list of languages at LanguageTool.org](https://languagetool.org/languages/).

## Contributing
This repository uses git submodules.  After cloning be sure to run `git submodule update --init`.

## Known Issues

* Only English (and country variants) are supported.