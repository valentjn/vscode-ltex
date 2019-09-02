# Changelog of vscode-ltex

## 4.6.6 (upcoming)
- Localization of diagnostics, initially support of English and German

## 4.6.5
- Make README.md and package.json consistent
- Fix second arguments of \(re)newcommand not ignored

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

# Changelog of vscode-languagetool

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
