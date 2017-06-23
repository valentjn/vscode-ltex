# Change Log

## 0.0.4
- Adds configuration to make extension opt-in by workspace thanks to [Faustino Aguilar](https://github.com/faustinoaq) ([PR #5](https://github.com/adamvoss/vscode-languagetool/pull/5)). (Work around for [Microsoft/vscode#15611](https://github.com/Microsoft/vscode/issues/15611))
- Language-support extensions are now detected through the Visual Studio Code API rather than file-path assumptions.  This is better practice and makes development of the extension easier.

## 0.0.3
- Fixes checking of files when no folder was open.
- Prevents virtual files, including those from the git scm provider, from being checked. (Fixes [#2](https://github.com/adamvoss/vscode-languagetool/issues/2))

## 0.0.2
- Allows any LanguageTool supported language to be used through the use of supplemental extensions
- Removes built-in English support

## 0.0.1
- Initial release
