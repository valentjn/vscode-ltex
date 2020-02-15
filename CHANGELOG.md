# Changelog

## 4.7.8 (upcoming)

- Add support for R Sweave `.rnw` files (fixes [#22][#22])
- Add `ltex.javaHome` setting to control the `JAVA_HOME` environment variable (PR [#24][#24] by mpolitze)
- Add support for `\euro` (fixes [#25][#25])
- Minor changes in README.md

## 4.7.7

- Remove preview status from extension

## 4.7.6

- Add `ltex.performance` settings to give users more control over Java's RAM usage
- Change default initial Java heap size to 64 MB
- Change default maximum Java heap size to 512 MB
- Change default sentence cache size from 10000 to 2000 sentences
- Rename logs, enable logging of client messages even if no folder is open
- Add more examples to README.md

## 4.7.5

- Enable ignoring environments such as `lstlisting` and `verbatim`
- Add `ltex.environments.ignore` setting for defining own environments to ignore

## 4.7.4

- Add `disabledRules` and `enabledRules` settings (requires update of language extensions)
- Add `disable rule` quick fix
- Fix a bug where the `codeAction` request gets stuck in infinite loop
- Fix another NullPointerException for word2vec

## 4.7.3

- Fix null pointer error for word2vec quick fixes (fixes [#12][#12])

## 4.7.2

- Add missing error message if legacy false friends could not be loaded

## 4.7.1

- Add `ltex.additionalRules.motherTongue` setting to enable detection of false friends (fixes [#11][#11])
- Change defaults for `ltex.additionalRules` settings from `""` to `null`

## 4.7.0

- Update to LanguageTool 4.7 (see [4.7 Release Notes](https://github.com/languagetool-org/languagetool/blob/64f87c18c4d0c13f365d6d85c7aa8c61b7ed2ccf/languagetool-standalone/CHANGES.md#47-2019-09-28))
- Support multi-root workspaces, all configuration settings except `ltex.enabled` are now resource-specific (fixes [#7][#7])
- Save dictionary settings under full language short code (e.g., `en-US` instead of `en`). If you already have a dictionary under `ltex.en.dictionary` and use `en-US` as language (not `en`), you have to rename the settings name to `ltex.en-US.dictionary` (similarly for other languages).
- Remove diagnostics when a file is closed
- Prevent insertion of text in TikZ mode
- Add support for more commands such as `\newenvironment`, `\newgeometry`, and `\pagenumbering`

## 4.6.13

- Fix language extensions not installable on remote machines (fixes [#8][#8])
- Fix language server not reinitialized after a language extension has been installed (which was missing during initialization)

## 4.6.12

- Patch LanguageTool's AnnotatedText with linear interpolation to hopefully fix the `fromPos must be less than toPos` LT errors for good
- Fix \footnote in math mode messed up text mode and math mode
- Increase robustness in case locale or settings are not provided
- Ignore all brace and bracket arguments after `\begin{environment}` (`tabular`, `array`, etc.)
- Add support for some more commands and environments such as `\pagestyle` and `eqnarray`

## 4.6.11

- Detect and prevent infinite loops in `LatexAnnotatedTextBuilder`
- Fix infinite loop with other line endings than `\n`
- Fix some more `fromPos must be less than toPos` LT errors
- Check for interrupts to avoid 100% CPU usage on timeout (this doesn't fix any bugs though)
- Add support for `\email`, `\href`, and `\verb|...|`
- Add support for more citation commands (`\citep`, `\citet`, etc.)
- Add support for float/theorem definition commands and starred sectioning commands

## 4.6.10

- Don't check plaintext files (fixes [#4][#4])
- Fix NullPointerException if LanguageTool has not been initialized (fixes [languagetool-languageserver#1][ltls#1])

## 4.6.9

- Bundle Node.js modules to decrease number of files in the extension (this means a slight performance gain)

## 4.6.8

- Add setting `ltex.diagnosticSeverity` to control where and how the diagnostics appear
- Change default severity from `warning` to `info`
- Add possibility to ignore a LanguageTool rule in a sentence via quick fix
- Add setting `ltex.configurationTarget` to control which `settings.json` to update when using one of the quick fixes
- More commands like `\PackageWarning` and `\addbibresource` are ignored
- Add support for `\url` and `\nolinkurl`
- Add support for more accents (`` \` ``, `\'`, `\^`, `\~`, `\"`, `\=`, `\.`, ...)
- Command names can now include `@` (this assumes that users don't write something like `\example@gmail.com` with a command `\example`, otherwise replace with `\example{}@gmail.com`)
- Ignore alignment argument of tabular environment

## 4.6.7

- Add possibility to use language model *n*-gram data, neural network model data, or word2vec model data
- `Add to dictionary` now always modifies global settings

## 4.6.6

- Fix `fromPos must be less than toPos` LT errors
- Localization of diagnostics, initially support of English and German
- Add timeout for `latex.AnnotatedTextBuilder`; unfortunately this only displays an error, but does not kill the process
- Add support for `\(`, `\)`, `\[`, `\]`
- Don't insert spaces before `\text` in display math

## 4.6.5

- Make README.md and package.json consistent
- Fix second arguments of `\(re)newcommand` not ignored

## 4.6.4

- Ignore some commands often found in LaTeX preambles
- Support umlauts and eszett

## 4.6.3

- Fix deployed *.vsix needed Java 11, not 8

## 4.6.2

- Don't include vsce in extension

## 4.6.1

- Link badges in README.md

## 4.6.0

- Forked abandoned repository, rename to vscode-ltex
- Update to LanguageTool 4.6 (see [4.6 Release Notes](https://github.com/languagetool-org/languagetool/blob/123662bd07059429d9a6d22af6fae164c2ce9dc5/languagetool-standalone/CHANGES.md#46-2019-06-26))
- Update other dependencies (vscode, vscode-languageclient, LSP, JUnit, Gradle)
- Implement simple LaTeX parser

## 3.8.0

- Update to LanguageTool 3.8 (see [3.8 Release Notes](https://github.com/languagetool-org/languagetool/blob/aa1bef4c0108e25eea7f71bd557b6cc4d9c53c2b/languagetool-standalone/CHANGES.md#38-2017-06-27))
- Update versioning to reflect LanguageTool versioning
- Remove "Preview" flag since no blocker issues have been reported

## 0.0.4

- Add configuration to make extension opt-in by workspace thanks to [Faustino Aguilar](https://github.com/faustinoaq) ([PR #5](https://github.com/adamvoss/vscode-languagetool/pull/5)) (workaround for [Microsoft/vscode#15611](https://github.com/Microsoft/vscode/issues/15611))
- Language-support extensions are now detected through the Visual Studio Code API rather than file-path assumptions.  This is better practice and makes development of the extension easier.

## 0.0.3

- Fix checking of files when no folder was open
- Prevent virtual files, including those from the git scm provider, from being checked (fixes [#2](https://github.com/adamvoss/vscode-languagetool/issues/2))

## 0.0.2

- Allow any LanguageTool supported language to be used through the use of supplemental extensions
- Remove built-in English support

## 0.0.1

- Initial release

[#4]: https://github.com/valentjn/vscode-ltex/issues/4
[#7]: https://github.com/valentjn/vscode-ltex/issues/7
[#8]: https://github.com/valentjn/vscode-ltex/issues/8
[#11]: https://github.com/valentjn/vscode-ltex/issues/11
[#12]: https://github.com/valentjn/vscode-ltex/issues/12
[#22]: https://github.com/valentjn/vscode-ltex/issues/22
[#24]: https://github.com/valentjn/vscode-ltex/issues/24
[#25]: https://github.com/valentjn/vscode-ltex/issues/25
[ltls#1]: https://github.com/valentjn/languagetool-languageserver/issues/1
