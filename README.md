# LT<sub>E</sub>X Extension for Visual Studio Code: LanguageTool Grammar Checking with L<sup>A</sup>T<sub>E</sub>X Support

[![Travis CI build status](https://img.shields.io/travis/valentjn/vscode-ltex/master?logo=travis&style=social)](https://www.travis-ci.org/valentjn/vscode-ltex)&nbsp;&nbsp;&nbsp;
[![Installs](https://img.shields.io/visual-studio-marketplace/i/valentjn.vscode-ltex?style=social&logo=visual-studio-code)][marketplace]&nbsp;
[![Rating](https://img.shields.io/visual-studio-marketplace/stars/valentjn.vscode-ltex?style=social&logo=visual-studio-code)][marketplace]&nbsp;&nbsp;&nbsp;
[![GitHub stars](https://img.shields.io/github/stars/valentjn/vscode-ltex?style=social)](https://github.com/valentjn/vscode-ltex)&nbsp;
[![GitHub issues](https://img.shields.io/github/issues/valentjn/vscode-ltex?style=social&logo=github)](https://github.com/valentjn/vscode-ltex/issues)

**NOTICE: This extension does not include any languages. You MUST install a [language support extension][marketplace-lang-exts].**

___

Provides offline grammar checking in Visual Studio Code using [LanguageTool](https://languagetool.org/), supporting L<sup>A</sup>T<sub>E</sub>X and Markdown documents. This extension provides only the core functionality. You must [install extensions containing the language rules for each language you wish to be able to check][marketplace-lang-exts].

This extension is a fork of the abandoned [LanguageTool for Visual Studio Code extension](https://github.com/adamvoss/vscode-languagetool) by Adam Voss with L<sup>A</sup>T<sub>E</sub>X support, new features (user dictionaries, ignore errors, etc.), and updated dependencies (LanguageTool).

## Features

![LanguageTool Grammar Checking for VS Code with LaTeX Support](https://github.com/valentjn/vscode-ltex/raw/master/img/LTeX-banner.png)

* Checks **L<sup>A</sup>T<sub>E</sub>X** and **Markdown** documents
* Supports **over 20 languages** according to which [language support extensions][marketplace-lang-exts] are installed
* **Issue highlighting** with hover description
* **Replacement suggestions** via quick fixes
* **User dictionaries**
* **Already includes LanguageTool**, possibility to use **external LanguageTool servers** instead

## Requirements

* [VS Code 1.39 or newer](https://code.visualstudio.com/)
* [Java 11 or newer](https://www.java.com/)
* [LaTeX Workshop Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop) (if you want to check L<sup>A</sup>T<sub>E</sub>X documents)

## How to Use

1. Install the requirements listed above
2. Install this extension
3. Install at least one [language support extension][marketplace-lang-exts] (you may install more than one)
4. Reload the VS Code window if necessary
5. Open a L<sup>A</sup>T<sub>E</sub>X or a Markdown document, or open a new file and change the language mode to `LaTeX` or `Markdown` (open the Command Palette and select `Change Language Mode`)
6. Wait a few seconds, and grammar/spelling errors will be displayed! (if there are any)

## Versioning

The LT<sub>E</sub>X extension has adopted the versioning of its LanguageTool dependency. For example, if this extension has version 4.9.0 it is powered by LanguageTool 4.9. LT<sub>E</sub>X 4.9.1 would also use LanguageTool 4.9. LT<sub>E</sub>X 5.0.0 would use LanguageTool 5.0. **The LanguageTool version of this extension must match the LanguageTool version of your installed language support extensions.** The easiest way to ensure compatibility is to always update all LT<sub>E</sub>X-related extensions when updating. We will never have incompatible versions published at the same time.

## Extension Settings

This extension contributes the following settings. Some settings are separated by language. These settings are located under `ltex.<LANGUAGE>`, where `<LANGUAGE>` has to be replaced with the language short code from `ltex.language`. Language-specific settings require the installation of the respective [language support extension][marketplace-lang-exts].

* `ltex.enabled`: Controls whether the extension is enabled. Allows disabling LanguageTool on specific workspaces. Changes require reloading the Visual Studio Code window to take effect.
  * Possible values: `true` (default), `false`

* `ltex.language`: The language LanguageTool should check against. For supported languages see the [list of languages at LanguageTool.org](https://languagetool.org/languages/). Requires the installation of a [language support extension][marketplace-lang-exts]. See the Marketplace description of the installed *language support extension* for possible values. Use a specific variant like `en-US` or `de-DE` instead of the generic language code like `en` or `de` to obtain spelling corrections (in addition to grammar corrections).
  * Examples: `"en-US"` (default), `"de-DE"`

* `ltex.http.uri`: If set to a non-empty string, LT<sub>E</sub>X will not use the bundled, built-in version of LanguageTool. Instead, LT<sub>E</sub>X will connect to an external [LanguageTool HTTP server](http://wiki.languagetool.org/http-server). Note that in this mode, the settings under `ltex.additionalRules` and `ltex.<LANGUAGE>.dictionary` will not take any effect. In addition, no language support extensions need to be installed, just the main LT<sub>E</sub>X extension (this one). Any installed language support extensions are not used in this mode, since all checking is done by the external LanguageTool server.
  * Example: `"http://localhost:8081/"`; default: `null`

* `ltex.diagnosticSeverity`: Severity of the diagnostics corresponding to the grammar and spelling errors. Allows controlling how and where the diagnostics appear in Visual Studio Code.
  * Possible values: `"error"`, `"warning"`, `"information"` (default), `"hint"`

* `ltex.<LANGUAGE>.dictionary`: List of additional words that should not be counted as spelling errors.
  * Example: `["adaptivity", "precomputed", "subproblem"]`; default: `[]`

* `ltex.<LANGUAGE>.disabledRules`: List of rules that should be disabled (if enabled by default by LanguageTool).
  * Example: `["EN_QUOTES", "UPPERCASE_SENTENCE_START"]` (for `en-US`); default: `[]`

* `ltex.<LANGUAGE>.enabledRules`: List of rules that should be enabled (if disabled by default by LanguageTool).
  * Example: `["PASSIVE_VOICE", "OXFORD_SPELLING_NOUNS"]` (for `en-GB`); default: `[]`

* `ltex.commands.ignore`: List of additional L<sup>A</sup>T<sub>E</sub>X commands to be ignored by the L<sup>A</sup>T<sub>E</sub>X parser, listed together with empty arguments. Don't forget to escape the initial backslash by replacing it with two backslashes.
  * Example: `["\\documentclass[]{}", "\\renewcommand*{}[]{}"]` (although these two commands are already ignored by default); default: `[]`

* `ltex.commands.dummy`: List of additional L<sup>A</sup>T<sub>E</sub>X commands to be replaced by dummy words (i.e., `Dummy0`, `Dummy1`, etc.), listed together with empty arguments. LT<sub>E</sub>X internally uses this mechanism for equations, citations, references, and similar constructs that are part of the sentence structure and for which LanguageTool would throw an error if simply omitted from the checked text. Don't forget to escape the initial backslash by replacing it with two backslashes.
  * Example: `["\\cite{}", "\\cite[]{}"]` (although these two commands are already replaced by dummy words by default); default: `[]`

* `ltex.environments.ignore`: List of additional L<sup>A</sup>T<sub>E</sub>X environments to be ignored by the L<sup>A</sup>T<sub>E</sub>X parser.
  * Example: `["lstlisting", "verbatim"]` (although these two environments are already ignored by default); default: `[]`

* `ltex.markdown.ignore`: List of Markdown node types to be ignored by the Markdown parser. The Markdown parser constructs an AST (abstract syntax tree) for the Markdown document, in which all leaves have node type `Text`. LT<sub>E</sub>X will ignore all nodes (and their `Text` leaves) that have one of the listed node types. The possible node types are listed at <https://javadoc.io/static/com.vladsch.flexmark/flexmark/0.60.2/com/vladsch/flexmark/ast/package-summary.html>.
  * Example/default: `["CodeBlock", "FencedCodeBlock", "IndentedCodeBlock"]`

* `ltex.markdown.dummy`: List of Markdown node types to be replaced by dummy words (i.e., `Dummy0`, `Dummy1`, etc.) by the Markdown parser. LT<sub>E</sub>X internally uses this mechanism for example for links and inline code that are part of the sentence structure and for which LanguageTool would throw an error if simply omitted from the checked text. The possible node types are listed at <https://javadoc.io/static/com.vladsch.flexmark/flexmark/0.60.2/com/vladsch/flexmark/ast/package-summary.html>.
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

* `ltex.javaHome`: If given, overrides the `JAVA_HOME` environment variable used for running LanguageTool. Otherwise, the value of `JAVA_HOME` of the parent process is used. Changes require reloading the Visual Studio Code window to take effect.
  * Examples: `"/path/to/directory"`, `"C:\\path\\to\\directory"`; default: `null`

* `ltex.performance.initialJavaHeapSize`: Initial size of the Java heap memory in megabytes (corresponds to Java's `-Xms` option, must be a positive integer). Decreasing this might decrease RAM usage of the Java process. Changes require reloading the Visual Studio Code window to take effect.
  * Example/default: `64`

* `ltex.performance.maximumJavaHeapSize`: Maximum size of the Java heap memory in megabytes (corresponds to Java's `-Xmx` option, must be a positive integer). Decreasing this might decrease RAM usage of the Java process. If you set this too small, the Java process may exceed the heap size, in which case an `OutOfMemoryError` is thrown. Changes require reloading the Visual Studio Code window to take effect.
  * Example/default: `512`

* `ltex.performance.sentenceCacheSize`: Size of the LanguageTool `ResultCache` in sentences (must be a positive integer). If only a small portion of the text changed (e.g., a single key press in the editor), LanguageTool uses the cache to avoid rechecking the complete text. LanguageTool internally splits the text into sentences, and sentences that have already been checked are skipped. Decreasing this might decrease RAM usage of the Java process. If you set this too small, checking time may increase significantly. Changes require reloading the Visual Studio Code window to take effect.
  * Example/default: `2000`

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
[marketplace-lang-exts]: https://marketplace.visualstudio.com/search?term=ltex&target=VSCode
