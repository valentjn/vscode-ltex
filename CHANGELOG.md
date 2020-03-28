# Changelog

## 4.9.0 — “The Update Alternative”

- Update to LanguageTool 4.9 (see [LT 4.9 release notes](https://github.com/languagetool-org/languagetool/blob/d6a675b8dbf04c57ab0729e82b655f5fb8205dd9/languagetool-standalone/CHANGES.md#49-2020-03-24))
- Update other Java dependencies
- Update npm dependencies
- Update required version of VS Code (now 1.39 or newer)
- Reduce file size of extension (omitting unneeded dependencies)
- Add usage instructions to README.md

## 4.7.10 — “The French Capacitance”

- Fix spelling errors for French dummies (fixes [#27](https://github.com/valentjn/vscode-ltex/issues/27))
- Fix `\dots` in math mode being interpreted as `...`
- Minor changes in README.md, CHANGELOG.md, and package.json

## 4.7.9 — “The Markdown Resonance”

- Update the Markdown parser flexmark-java to 0.60.2; this increases the speed of parsing Markdown
- Add possibility to ignore Markdown elements or replace them by dummy words via `ltex.markdown.ignore` and `ltex.markdown.dummy` (fixes [#26](https://github.com/valentjn/vscode-ltex/issues/26))
- Ignore Markdown code blocks by default
- Replace auto-links and inline Markdown code with dummy words by default
- Fix match positions were sometimes off by one, especially in Markdown documents
- Rewrite `MarkdownAnnotatedTextBuilder`

## 4.7.8 — “The Multi-Diagnostic Equivalency”

- Add support for R Sweave `.rnw` files (fixes [#22](https://github.com/valentjn/vscode-ltex/issues/22))
- Enable fixing multiple diagnostics at once (fixes [#23](https://github.com/valentjn/vscode-ltex/issues/23))
- Add `ltex.javaHome` setting to control the `JAVA_HOME` environment variable (PR [#24](https://github.com/valentjn/vscode-ltex/issues/24) by mpolitze)
- Add support for `\euro` (fixes [#25](https://github.com/valentjn/vscode-ltex/issues/25))
- Minor changes in README.md

## 4.7.7 — “The Preview Perturbation”

- Remove preview status from extension

## 4.7.6 — “The Java Thermalization”

- Add `ltex.performance` settings to give users more control over Java's RAM usage
- Change default initial Java heap size to 64 MB
- Change default maximum Java heap size to 512 MB
- Change default sentence cache size from 10000 to 2000 sentences
- Rename logs, enable logging of client messages even if no folder is open
- Add more examples to README.md

## 4.7.5 — “The Listing Collapse”

- Enable ignoring environments such as `lstlisting` and `verbatim`
- Add `ltex.environments.ignore` setting for defining own environments to ignore

## 4.7.4 — “The Disabling Allocation”

- Add `disabledRules` and `enabledRules` settings (requires update of language extensions)
- Add `disable rule` quick fix
- Fix a bug where the `codeAction` request gets stuck in infinite loop
- Fix another `NullPointerException` for word2vec

## 4.7.3 — “The word2vec Erosion”

- Fix null pointer error for word2vec quick fixes (fixes [#12](https://github.com/valentjn/vscode-ltex/issues/12))

## 4.7.2 — “The Message Dissection”

- Add missing error message if legacy false friends could not be loaded

## 4.7.1 — “The Mother Tongue Factor”

- Add `ltex.additionalRules.motherTongue` setting to enable detection of false friends (fixes [#11](https://github.com/valentjn/vscode-ltex/issues/11))
- Change defaults for `ltex.additionalRules` settings from `""` to `null`

## 4.7.0 — “The Multi-Root Observation”

- Update to LanguageTool 4.7 (see [LT 4.7 release notes](https://github.com/languagetool-org/languagetool/blob/64f87c18c4d0c13f365d6d85c7aa8c61b7ed2ccf/languagetool-standalone/CHANGES.md#47-2019-09-28))
- Support multi-root workspaces, all configuration settings except `ltex.enabled` are now resource-specific (fixes [#7](https://github.com/valentjn/vscode-ltex/issues/7))
- Save dictionary settings under full language short code (e.g., `en-US` instead of `en`). If you already have a dictionary under `ltex.en.dictionary` and use `en-US` as language (not `en`), you have to rename the settings name to `ltex.en-US.dictionary` (similarly for other languages).
- Remove diagnostics when a file is closed
- Prevent insertion of text in TikZ mode
- Add support for more commands such as `\newenvironment`, `\newgeometry`, and `\pagenumbering`

## 4.6.13 — “The Remote Permeability”

- Fix language extensions not installable on remote machines (fixes [#8](https://github.com/valentjn/vscode-ltex/issues/8))
- Fix language server not reinitialized after a language extension has been installed (which was missing during initialization)

## 4.6.12 — “The Interpolation Entanglement”

- Patch LanguageTool's `AnnotatedText` with linear interpolation to hopefully fix the `fromPos must be less than toPos` LT errors for good
- Fix `\footnote` in math mode messed up text mode and math mode
- Increase robustness in case locale or settings are not provided
- Ignore all brace and bracket arguments after `\begin{environment}` (`tabular`, `array`, etc.)
- Add support for some more commands and environments such as `\pagestyle` and `eqnarray`

## 4.6.11 — “The Infinite Loop Contraction”

- Detect and prevent infinite loops in `LatexAnnotatedTextBuilder`
- Fix infinite loop with other line endings than `\n`
- Fix some more `fromPos must be less than toPos` LT errors
- Check for interrupts to avoid 100% CPU usage on timeout (this doesn't fix any bugs though)
- Add support for `\email`, `\href`, and `\verb|...|`
- Add support for more citation commands (`\citep`, `\citet`, etc.)
- Add support for float/theorem definition commands and starred sectioning commands

## 4.6.10 — “The Plaintext Decay”

- Don't check plaintext files (fixes [#4](https://github.com/valentjn/vscode-ltex/issues/4))
- Fix `NullPointerException` if LanguageTool has not been initialized (fixes [languagetool-languageserver#1](https://github.com/valentjn/languagetool-languageserver/issues/1))

## 4.6.9 — “The Bundle Valuation”

- Bundle Node.js modules to decrease number of files in the extension (this means a slight performance gain)

## 4.6.8 — “The Severity Manifestation”

- Add setting `ltex.diagnosticSeverity` to control where and how the diagnostics appear
- Change default severity from `warning` to `info`
- Add possibility to ignore a LanguageTool rule in a sentence via quick fix
- Add setting `ltex.configurationTarget` to control which `settings.json` to update when using one of the quick fixes
- More commands like `\PackageWarning` and `\addbibresource` are ignored
- Add support for `\url` and `\nolinkurl`
- Add support for more accents (`` \` ``, `\'`, `\^`, `\~`, `\"`, `\=`, `\.`, ...)
- Command names can now include `@` (this assumes that users don't write something like `\example@gmail.com` with a command `\example`, otherwise replace with `\example{}@gmail.com`)
- Ignore alignment argument of tabular environment

## 4.6.7 — “The Model Combustion”

- Add possibility to use language model *n*-gram data, neural network model data, or word2vec model data
- `Add to dictionary` now always modifies global settings

## 4.6.6 — “The Timeout Theorem”

- Fix `fromPos must be less than toPos` LT errors
- Localization of diagnostics, initially support of English and German
- Add timeout for `latex.AnnotatedTextBuilder`; unfortunately this only displays an error, but does not kill the process
- Add support for `\(`, `\)`, `\[`, `\]`
- Don't insert spaces before `\text` in display math

## 4.6.5 — “The Consistency Integration”

- Make README.md and package.json consistent
- Fix second arguments of `\(re)newcommand` not ignored

## 4.6.4 — “The Umlaut Expansion”

- Ignore some commands often found in L<sup>A</sup>T<sub>E</sub>X preambles
- Support umlauts and eszett

## 4.6.3 — “The Version Interruption”

- Fix deployed *.vsix needed Java 11, not 8

## 4.6.2 — “The vsce Minimization”

- Don't include vsce in extension

## 4.6.1 — “The Badges Vortex”

- Link badges in README.md

## 4.6.0 — “The LTeX Resurgence”

- Forked abandoned repository, rename to vscode-ltex
- Update to LanguageTool 4.6 (see [LT 4.6 release notes](https://github.com/languagetool-org/languagetool/blob/123662bd07059429d9a6d22af6fae164c2ce9dc5/languagetool-standalone/CHANGES.md#46-2019-06-26))
- Update other dependencies (vscode, vscode-languageclient, LSP, JUnit, Gradle)
- Implement simple L<sup>A</sup>T<sub>E</sub>X parser

## 3.8.0

- Update to LanguageTool 3.8 (see [LT 3.8 release notes](https://github.com/languagetool-org/languagetool/blob/aa1bef4c0108e25eea7f71bd557b6cc4d9c53c2b/languagetool-standalone/CHANGES.md#38-2017-06-27))
- Update versioning to reflect LanguageTool versioning
- Remove preview flag since no blocker issues have been reported

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
