# LT<sub>E</sub>X Extension for Visual Studio Code: LanguageTool Grammar Checking with L<sup>A</sup>T<sub>E</sub>X Support

[![Travis CI build status](https://api.travis-ci.org/valentjn/vscode-ltex.svg?branch=master)](https://www.travis-ci.org/valentjn/vscode-ltex)
[![GitHub](https://img.shields.io/badge/-fork%20me%20on%20GitHub-blue)](https://github.com/valentjn/vscode-ltex)

**NOTICE: This extension does not include any languages. You MUST install a [language support extension][lang-exts].**

___

Provides offline grammar checking in Visual Studio Code using [LanguageTool](https://languagetool.org/), supporting L<sup>A</sup>T<sub>E</sub>X and Markdown documents. This extension provides only the core functionality. You must [install extensions containing the language rules for each language you wish to be able to check][lang-exts].

This extension is a fork of the abandoned [LanguageTool for Visual Studio Code extension](https://github.com/adamvoss/vscode-languagetool) by Adam Voss with L<sup>A</sup>T<sub>E</sub>X support, new features (user dictionaries, ignore errors, etc.), and updated dependencies (LanguageTool).

## Features

* Checks **latex** and **markdown** documents
* Supports **over 20 languages** according to which [language support extensions][lang-exts] are installed
* Issue highlighting with hover description
* Replacement suggestions via quick fixes
* User dictionaries

## Requirements

Java 8+ is required.

## Versioning

The LT<sub>E</sub>X extension has adopted the versioning of its LanguageTool dependency. For example, if this extension has version 4.7.0 it is powered by LanguageTool 4.7. LT<sub>E</sub>X 4.7.1 would also use LanguageTool 4.7. LT<sub>E</sub>X 4.8.0 would use LanguageTool 4.8. **The LanguageTool version of this extension must match the LanguageTool version of your installed language support extensions.**

## Extension Settings

This extension contributes the following settings. Some settings are separated by language. These settings are located under `ltex.<LANGUAGE>`, where `<LANGUAGE>` has to be replaced with the language short code from `ltex.language`. Language-specific settings require the installation of the respective [language support extension][lang-exts].

* `ltex.enabled`: Controls whether the extension is enabled. Allows disabling LanguageTool on specific workspaces.
  * Possible values: `true` (default), `false`

* `ltex.language`: The language LanguageTool should check against. For supported languages see the [list of languages at LanguageTool.org](https://languagetool.org/languages/). Requires the installation of a [language support extension][lang-exts]. See the Marketplace description of the installed *language support extension* for possible values. Use a specific variant like `en-US` or `de-DE` instead of the generic language code like `en` or `de` to obtain spelling corrections (in addition to grammar corrections).
  * Examples: `"en-US"` (default), `"de-DE"`

* `ltex.diagnosticSeverity`: Severity of the diagnostics corresponding to the grammar and spelling errors. Allows controlling how and where the diagnostics appear in Visual Studio Code.
  * Possible values: `"error"`, `"warning"`, `"information"` (default), `"hint"`

* `ltex.<LANGUAGE>.dictionary`: List of additional words that should not be counted as spelling errors.
  * Example: `["adaptivity", "precomputed", "subproblem"]`; default: `[]`

* `ltex.<LANGUAGE>.disabledRules`: List of rules that should be disabled (if enabled by default by LanguageTool). A cake is being baked by him.
  * Example: `["EN_QUOTES", "UPPERCASE_SENTENCE_START"]` (for `en-US`); default: `[]`

* `ltex.<LANGUAGE>.enabledRules`: List of rules that should be enabled (if disabled by default by LanguageTool).
  * Example: `["PASSIVE_VOICE", "OXFORD_SPELLING_NOUNS"]` (for `en-GB`); default: `[]`

* `ltex.commands.ignore`: List of additional L<sup>A</sup>T<sub>E</sub>X commands to be ignored by the L<sup>A</sup>T<sub>E</sub>X parser, listed together with empty arguments. Don't forget to escape the initial backslash by replacing it with two backslashes.
  * Example: `["\\documentclass[]{}", "\\renewcommand*{}[]{}"]` (although these two commands are already ignored by default); default: `[]`

* `ltex.commands.dummy`: List of additional L<sup>A</sup>T<sub>E</sub>X commands to be replaced by dummy words (i.e., `Dummy0`, `Dummy1`, etc.), listed together with empty arguments. LT<sub>E</sub>X internally uses this mechanism for equations, citations, references, and similar constructs that are part of the sentence structure and for which LanguageTool would throw an error if simply omitted from the checked text. Don't forget to escape the initial backslash by replacing it with two backslashes.
  * Example: `["\\cite{}", "\\cite[]{}"]` (although these two commands are already replaced by dummy words by default); default: `[]`

* `ltex.environments.ignore`: List of additional L<sup>A</sup>T<sub>E</sub>X environments to be ignored by the L<sup>A</sup>T<sub>E</sub>X parser.
  * Example: `["lstlisting", "verbatim"]` (although these two environments are already ignored by default); default: `[]`

* `ltex.ignoreRuleInSentence`: Individual rule/sentence pairs to ignore, i.e., no diagnostics of the specified rule will be displayed for the specified sentence. Add sentences by using the `Ignore in this sentence` quick fix.
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

* `ltex.performance.initialJavaHeapSize`: Initial size of the Java heap memory in megabytes (corresponds to Java's `-Xms` option, must be a positive integer). Decreasing this might decrease RAM usage of the Java process. Changes require reloading the Visual Studio Code window to take effect.
  * Example: `64` (default)

* `ltex.performance.maximumJavaHeapSize`: Maximum size of the Java heap memory in megabytes (corresponds to Java's `-Xmx` option, must be a positive integer). Decreasing this might decrease RAM usage of the Java process. If you set this too small, the Java process may exceed the heap size, in which case an `OutOfMemoryError` is thrown. Changes require reloading the Visual Studio Code window to take effect.
  * Example: `512` (default)

* `ltex.performance.sentenceCacheSize`: Size of the LanguageTool `ResultCache` in sentences (must be a positive integer). If only a small portion of the text changed (e.g., a single key press in the editor), LanguageTool uses the cache to avoid rechecking the complete text. LanguageTool internally splits the text into sentences, and sentences that have already been checked are skipped. Decreasing this might decrease RAM usage of the Java process. If you set this too small, checking time may increase significantly. Changes require reloading the Visual Studio Code window to take effect.
  * Example: `2000` (default)

* `ltex.trace.server`: Debug setting. When reporting issues, set this to `"verbose"` to be able to access the `LTeX Language Client` log in `View` → `Output`. Append the relevant part to the GitHub issue. Changes require reloading the Visual Studio Code window to take effect.
  * Possible values: `"off"` (default), `"message"`, `"verbose"`

## Contributing

Contributions welcome! This repository uses Git submodules. After cloning, be sure to run `git submodule update --init`.

## Known Issues

* The L<sup>A</sup>T<sub>E</sub>X parser is not perfect. False positives are sometimes reported as errors. However, it is impossible to fully parse L<sup>A</sup>T<sub>E</sub>X without compiling it.

Please report issues or submit pull requests on [GitHub](https://github.com/valentjn/vscode-ltex).

## Acknowledgments

See [ACKNOWLEDGMENTS.md](./ACKNOWLEDGMENTS.md).

[lang-exts]: https://marketplace.visualstudio.com/search?term=ltex&target=VSCode
