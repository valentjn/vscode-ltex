# LT<sub>E</sub>X Extension for Visual Studio Code: LanguageTool Grammar Checking with L<sup>A</sup>T<sub>E</sub>X Support

[![Travis CI build status](https://img.shields.io/travis/valentjn/vscode-ltex/master?logo=travis&style=social)](https://www.travis-ci.org/valentjn/vscode-ltex)&nbsp;&nbsp;&nbsp;
[![Installs](https://img.shields.io/visual-studio-marketplace/i/valentjn.vscode-ltex?style=social&logo=visual-studio-code)][marketplace]&nbsp;
[![Rating](https://img.shields.io/visual-studio-marketplace/stars/valentjn.vscode-ltex?style=social&logo=visual-studio-code)][marketplace]&nbsp;&nbsp;&nbsp;
[![GitHub stars](https://img.shields.io/github/stars/valentjn/vscode-ltex?style=social)](https://github.com/valentjn/vscode-ltex)&nbsp;
[![GitHub issues](https://img.shields.io/github/issues/valentjn/vscode-ltex?style=social&logo=github)](https://github.com/valentjn/vscode-ltex/issues)

Provides offline grammar checking in Visual Studio Code using [LanguageTool](https://languagetool.org/), supporting L<sup>A</sup>T<sub>E</sub>X and Markdown documents.

This extension is a fork of the abandoned [LanguageTool for Visual Studio Code extension](https://github.com/adamvoss/vscode-languagetool) by Adam Voss with L<sup>A</sup>T<sub>E</sub>X support, new features (user dictionaries, ignore errors, etc.), and updated dependencies (LanguageTool).

## Note for Transitioning to LT<sub>E</sub>X 5.x

LT<sub>E</sub>X has undergone a major rewrite in version 5.0. The most important change is that it now comes with everything included:

* All languages are now directly included in LT<sub>E</sub>X, which eliminates the need for language support extensions (e.g., `LTeX - English support`). If you still have any of them installed, you may uninstall them now.
* Due to file size restrictions of the Visual Studio Marketplace, LT<sub>E</sub>X has to download its core component (which includes LanguageTool) when activated for the first time. Read below for instructions on offline installation.
* A separate Java installation is not necessary anymore. LT<sub>E</sub>X will automatically download a Java distribution and store it in the extension folder if no suitable Java installation (Java 11 or later) has been found on your computer.
* A few settings have been renamed. Check your `settings.json` for deprecated entries.

Find more information in the [changelog](https://github.com/valentjn/vscode-ltex/blob/master/CHANGELOG.md).

## Features

![LanguageTool Grammar Checking for VS Code with LaTeX Support](https://github.com/valentjn/vscode-ltex/raw/master/img/LTeX-banner.png)

* Checks **L<sup>A</sup>T<sub>E</sub>X** and **Markdown** documents
* Comes with **everything included,** no need to install Java or LanguageTool
* Supports **over 20 languages**
* **Issue highlighting** with hover description
* **Replacement suggestions** via quick fixes
* **User dictionaries**

## Requirements

* [VS Code 1.39 or newer](https://code.visualstudio.com/)
* [LaTeX Workshop Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop) (if you want to check L<sup>A</sup>T<sub>E</sub>X documents)

## How to Use

1. Install the requirements listed above
2. Install this extension
3. Reload the VS Code window if necessary
4. Open a L<sup>A</sup>T<sub>E</sub>X or a Markdown document, or open a new file and change the language mode to `LaTeX` or `Markdown` (open the Command Palette and select `Change Language Mode`)
5. Wait until ltex-ls and Java have been found; if necessary, LT<sub>E</sub>X downloads both for you.
6. Grammar/spelling errors will be displayed! (if there are any)

## Offline Installation

The key component of LT<sub>E</sub>X, the LT<sub>E</sub>X Language Server (ltex-ls), which also includes LanguageTool itself, cannot be included in the LT<sub>E</sub>X version distributed on the Visual Studio Marketplace due to file size restrictions. In addition, ltex-ls requires Java due to its LanguageTool dependency. When activated for the first time, LT<sub>E</sub>X will automatically download and use the latest compatible ltex-ls release from GitHub and, in case no existing installation of Java has been found, a portable Java distribution ([AdoptOpenJDK](https://adoptopenjdk.net/)). Both will be stored in the extension folder. If you don't want this or if you don't have an Internet connection, there are two alternatives:

* Download the offline version of LT<sub>E</sub>X on the [Releases page](https://github.com/valentjn/vscode-ltex/releases) and install it via `Extensions: Install from VSIX...` on the Command Palette. The offline version includes _everything_ (ltex-ls and a Java distribution). OR
* Download [ltex-ls](https://github.com/valentjn/ltex-ls/releases) and/or a Java distribution individually and set `ltex.ltex-ls.path` and/or `ltex.java.path` to the respective locations. At least Java 11 is required.

## Extension Settings

This extension contributes the following settings. Some settings are separated by language. These settings are located under `ltex.<LANGUAGE>`, where `<LANGUAGE>` has to be replaced with the language short code from `ltex.language`.

* `ltex.enabled`: Controls whether the extension is enabled. Allows disabling LanguageTool on specific workspaces. Changes require reloading the Visual Studio Code window to take effect.
  * Possible values: `true` (default), `false`

* `ltex.language`: The language LanguageTool should check against. Use a specific variant like `en-US` or `de-DE` instead of the generic language code like `en` or `de` to obtain spelling corrections (in addition to grammar corrections).
  * Possible values: `ar` (Arabic), `ar-DZ` (Arabic (Algeria)), `ast-ES` (Asturian), `be-BY` (Belarusian), `br-FR` (Breton), `ca-ES` (Catalan), `ca-ES-valencia` (Catalan (Valencian)), `da-DK` (Danish), `de` (German), `de-AT` (German (Austria)), `de-CH` (German (Swiss)), `de-DE` (German (Germany)), `de-DE-x-simple-language` (Simple German), `el-GR` (Greek), `en` (English), `en-AU` (English (Australian)), `en-CA` (English (Canadian)), `en-GB` (English (GB)), `en-NZ` (English (New Zealand)), `en-US` (English (US), default), `en-ZA` (English (South African)), `eo` (Esperanto), `es` (Spanish), `fa` (Persian), `fr` (French), `ga-IE` (Irish), `gl-ES` (Galician), `it` (Italian), `ja-JP` (Japanese), `km-KH` (Khmer), `nl` (Dutch), `pl-PL` (Polish), `pt` (Portuguese), `pt-AO` (Portuguese (Angola preAO)), `pt-BR` (Portuguese (Brazil)), `pt-MZ` (Portuguese (Moçambique preAO)), `pt-PT` (Portuguese (Portugal)), `ro-RO` (Romanian), `ru-RU` (Russian), `sk-SK` (Slovak), `sl-SI` (Slovenian), `sv` (Swedish), `ta-IN` (Tamil), `tl-PH` (Tagalog), `uk-UA` (Ukrainian), `zh-CN` (Chinese)

* `ltex.dictionary`: Lists of additional words that should not be counted as spelling errors. The lists are language-specific, so use an object of the format `{\"<LANGUAGE1>\": [\"<WORD1>\", \"<WORD2>\", ...], \"<LANGUAGE2>\": [\"<WORD1>\", \"<WORD2>\", ...], ...}`, where `<LANGUAGE>` denotes the language code in `ltex.language`. If `null` (the default), no additional spelling errors will be ignored.
  * Example: `{"en-US": ["adaptivity", "precomputed", "subproblem"], "de-DE": ["B-Splines"]}`; default: `null`

* `ltex.disabledRules`: Lists of rules that should be disabled (if enabled by default by LanguageTool). The lists are language-specific, so use an object of the format `{\"<LANGUAGE1>\": [\"<RULE1>\", \"<RULE2>\", ...], \"<LANGUAGE2>\": [\"<RULE1>\", \"<RULE2>\", ...], ...}`, where `<LANGUAGE>` denotes the language code in `ltex.language` and `<RULE>` the ID of the LanguageTool rule. If `null` (the default), no additional rules will be disabled.
  * Example: `{"en-US": ["EN_QUOTES", "UPPERCASE_SENTENCE_START"]}`; default: `null`

* `ltex.enabledRules`: Lists of rules that should be enabled (if disabled by default by LanguageTool). The lists are language-specific, so use an object of the format `{\"<LANGUAGE1>\": [\"<RULE1>\", \"<RULE2>\", ...], \"<LANGUAGE2>\": [\"<RULE1>\", \"<RULE2>\", ...], ...}`, where `<LANGUAGE>` denotes the language code in `ltex.language` and `<RULE>` the ID of the LanguageTool rule. If `null` (the default), no additional rules will be enabled.
  * Example: `{"en-GB": ["PASSIVE_VOICE", "OXFORD_SPELLING_NOUNS"]}`; default: `null`

* `ltex.ltex-ls.path`: If this setting is `null`, LT<sub>E</sub>X automatically downloads the [latest compatible release of ltex-ls from GitHub](https://github.com/valentjn/ltex-ls/releases), stores it in the folder of the extension, and uses it for the checking process. You can point this setting to an ltex-ls release you downloaded by yourself. In this case, the ltex-ls release downloaded by LT<sub>E</sub>X (if existing) will be deleted to save disk space. Changes require reloading the Visual Studio Code window to take effect.
  * Examples: `"/path/to/directory"`, `"C:\\path\\to\\directory"`; default: `null`

* `ltex.java.path`: If this setting is `null` and LT<sub>E</sub>X could not find Java on your computer, LT<sub>E</sub>X automatically downloads a Java distribution ([AdoptOpenJDK](https://adoptopenjdk.net/)), stores it in the folder of the extension, and uses it to run ltex-ls. You can point this setting to an existing Java installation on your computer to use that installation instead. Use the same path as you would use for the `JAVA_HOME` environment variable. In this case, the Java distribution downloaded by LT<sub>E</sub>X (if existing) will be deleted to save disk space. Changes require reloading the Visual Studio Code window to take effect.
  * Examples: `"/path/to/directory"`, `"C:\\path\\to\\directory"`; default: `null`

* `ltex.java.initialHeapSize`: Initial size of the Java heap memory in megabytes (corresponds to Java's `-Xms` option, must be a positive integer). Decreasing this might decrease RAM usage of the Java process. Changes require reloading the Visual Studio Code window to take effect.
  * Example/default: `64`

* `ltex.java.maximumHeapSize`: Maximum size of the Java heap memory in megabytes (corresponds to Java's `-Xmx` option, must be a positive integer). Decreasing this might decrease RAM usage of the Java process. If you set this too small, the Java process may exceed the heap size, in which case an `OutOfMemoryError` is thrown. Changes require reloading the Visual Studio Code window to take effect.
  * Example/default: `512`

* `ltex.commands.ignore`: List of additional L<sup>A</sup>T<sub>E</sub>X commands to be ignored by the L<sup>A</sup>T<sub>E</sub>X parser, listed together with empty arguments. Don't forget to escape the initial backslash by replacing it with two backslashes.
  * Example: `["\\documentclass[]{}", "\\renewcommand*{}[]{}"]` (although these two commands are already ignored by default); default: `[]`

* `ltex.commands.dummy`: List of additional L<sup>A</sup>T<sub>E</sub>X commands to be replaced by dummy words (i.e., `Dummy0`, `Dummy1`, etc.), listed together with empty arguments. LT<sub>E</sub>X internally uses this mechanism for equations, citations, references, and similar constructs that are part of the sentence structure and for which LanguageTool would throw an error if simply omitted from the checked text. Don't forget to escape the initial backslash by replacing it with two backslashes.
  * Example: `["\\cite{}", "\\cite[]{}"]` (although these two commands are already replaced by dummy words by default); default: `[]`

* `ltex.environments.ignore`: List of additional L<sup>A</sup>T<sub>E</sub>X environments to be ignored by the L<sup>A</sup>T<sub>E</sub>X parser.
  * Example: `["lstlisting", "verbatim"]` (although these two environments are already ignored by default); default: `[]`

* `ltex.markdown.ignore`: List of Markdown node types to be ignored by the Markdown parser. The Markdown parser constructs an AST (abstract syntax tree) for the Markdown document, in which all leaves have node type `Text`. LT<sub>E</sub>X will ignore all nodes (and their `Text` leaves) that have one of the listed node types. The possible node types are listed in the [documentation of flexmark-java](https://javadoc.io/static/com.vladsch.flexmark/flexmark/0.60.2/com/vladsch/flexmark/ast/package-summary.html).
  * Example/default: `["CodeBlock", "FencedCodeBlock", "IndentedCodeBlock"]`

* `ltex.markdown.dummy`: List of Markdown node types to be replaced by dummy words (i.e., `Dummy0`, `Dummy1`, etc.) by the Markdown parser. LT<sub>E</sub>X internally uses this mechanism for example for links and inline code that are part of the sentence structure and for which LanguageTool would throw an error if simply omitted from the checked text. The possible node types are listed in the [documentation of flexmark-java](https://javadoc.io/static/com.vladsch.flexmark/flexmark/0.60.2/com/vladsch/flexmark/ast/package-summary.html).
  * Example/default: `["AutoLink", "Code"]`

* `ltex.ignoreRuleInSentence`: Individual rule/sentence pairs to ignore, i.e., no diagnostics of the specified rule will be displayed for the specified sentence. This is a list of objects with two keys each, `rule` and `sentence`. The `rule` value is the identifier of the LanguageTool rule to be ignored. The `sentence` value is a Java-compatible regular expression. All occurrences of the given rule are ignored in sentences (as determined by the LanguageTool tokenizer) that match the regular expression. Although it is possible to manually edit this setting, the intended way is to add rule/sentence pairs by using the `Ignore in this sentence` quick fix. If this list is very large, performance may suffer.
  * Example: `[{"rule": "THIS_NNS", "sentence": "^\\QThese error in this sentence should be ignored.\\E$"}]`; default: `[]`

* `ltex.configurationTarget`: Controls which `settings.json` to update when using one of the quick fixes. `global` always updates the global configuration, while `workspace` updates the workspace configuration if currently in a workspace, otherwise the global configuration.
  * Example/default: `{"addToDictionary": "global", "disableRule": "workspaceFolder", "ignoreRuleInSentence": "workspaceFolder"}`

* `ltex.additionalRules.motherTongue`: Optional mother tongue of the user. If set, additional rules will be checked to detect false friends. False friend detection improves if a language model is supplied (see `ltex.additionalRules.languageModel`).
  * Examples: `"en-US"`, `"de-DE"`; default: `null`

* `ltex.additionalRules.languageModel`: Optional path to a directory with rules of a language model with *n*-gram occurrence counts.
  * Examples: `"/path/to/directory"`, `"C:\\path\\to\\directory"`; default: `null`

* `ltex.additionalRules.neuralNetworkModel`: Optional path to a directory with rules of a pretrained neural network model.
  * Examples: `"/path/to/directory"`, `"C:\\path\\to\\directory"`; default: `null`

* `ltex.additionalRules.word2VecModel`: Optional path to a directory with rules of a word2vec language model.
  * Examples: `"/path/to/directory"`, `"C:\\path\\to\\directory"`; default: `null`

* `ltex.sentenceCacheSize`: Size of the LanguageTool `ResultCache` in sentences (must be a positive integer). If only a small portion of the text changed (e.g., a single key press in the editor), LanguageTool uses the cache to avoid rechecking the complete text. LanguageTool internally splits the text into sentences, and sentences that have already been checked are skipped. Decreasing this might decrease RAM usage of the Java process. If you set this too small, checking time may increase significantly. Changes require reloading the Visual Studio Code window to take effect.
  * Example/default: `2000`

* `ltex.diagnosticSeverity`: Severity of the diagnostics corresponding to the grammar and spelling errors. Allows controlling how and where the diagnostics appear in Visual Studio Code.
  * Possible values: `"error"`, `"warning"`, `"information"` (default), `"hint"`

* `ltex.trace.server`: Debug setting. When reporting issues, set this to `"verbose"` to be able to access the `LTeX Language Client` log in `View` → `Output`. Append the relevant part to the GitHub issue. Changes require reloading the Visual Studio Code window to take effect.
  * Possible values: `"off"` (default), `"message"`, `"verbose"`

## Contributing

Contributions are welcome! This repository uses Git submodules. After cloning, be sure to run `git submodule update --init`.

Please report issues (bugs and feature requests) or submit pull requests on [GitHub](https://github.com/valentjn/vscode-ltex).

### How to Report Bugs

1. Make sure that your issue is really an LT<sub>E</sub>X bug.
2. Make sure that your issue can neither be found in the list of known issues below nor in the [list of all open and closed GitHub issues](https://github.com/valentjn/vscode-ltex/issues?q=is%3Aissue) (this applies to feature requests as well).
3. Set the option `"ltex.trace.server": "verbose"` in your `settings.json`.
4. Try to understand the bug by selecting `View` → `Output` → `LTeX Language Server`/`LTeX Language Client`.
5. Append the relevant parts of these logs when opening an issue on GitHub.

### Known Issues

* The L<sup>A</sup>T<sub>E</sub>X parser is not perfect. False positives are sometimes reported as errors. However, it is impossible to fully parse L<sup>A</sup>T<sub>E</sub>X without compiling it.

## Acknowledgments

See [ACKNOWLEDGMENTS.md](./ACKNOWLEDGMENTS.md).

[marketplace]: https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex
