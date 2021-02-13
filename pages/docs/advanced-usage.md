---
# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

title: "Advanced Usage"
permalink: "/docs/advanced-usage.html"
redirect_from: "/docs/advanced-features.html"
sidebar: "sidebar"
---

## Multi-Scope Settings

Some of LTeX's settings are *multi-scope settings.* These settings are:

- [`ltex.dictionary`](settings.html#ltexdictionary)
- [`ltex.disabledRules`](settings.html#ltexdisabledrules)
- [`ltex.enabledRules`](settings.html#ltexenabledrules)
- [`ltex.hiddenFalsePositives`](settings.html#ltexhiddenfalsepositives)

To explain what multi-scope settings do, let us recap that VS Code has multiple scopes of settings:

- [User settings](https://code.visualstudio.com/docs/getstarted/settings) saved in the `settings.json` file of the user
- [Workspace settings](https://code.visualstudio.com/docs/getstarted/settings) saved in the `.vscode/settings.json` file of the workspace (or in the `*.code-workspace` file in the case of multi-root workspaces)
- [Workspace folder (resource-specific) settings](https://code.visualstudio.com/docs/editor/multi-root-workspaces#_settings) set in the `.vscode/settings.json` file of the workspace folder (or in the `.vscode/settings.json` file of the workspace in the case of single-folder workspaces)

If you set a setting in multiple scopes at the same time, the scope with higher precedence usually shadows the scope with lower precedence. For instance, it would be impossible to supply additional words for the dictionary in workspace settings to amend the user dictionary, as the workspace dictionary would shadow the user dictionary.

However, multi-scope settings are specially treated by LTeX. When checking text, LTeX implicitly joins the lists of these settings in user, workspace, and workspace folder scopes (in that order) to a single list. This means if your user dictionary contains just `cromulent` and your workspace dictionary contains just `B-spline`, then the dictionary used by LTeX will consist of `cromulent` *and* `B-spline` (i.e., not just `B-spline`).

If you want to remove an entry from a workspace-specific setting in a scope with higher precedence without removing it altogether, you can include it with a dash (`-`) as prefix. For example, if your user dictionary includes the word `cromulent`, but you want that word to be marked as a spelling error in a specific project, simply add `-cromulent` to [`ltex.dictionary`](settings.html#ltexdictionary) in the project's workspace settings.

You can specify the target scope for changing settings with quick fixes (e.g., `Add to dictionary`) with the [`ltex.configurationTarget`](settings.html#ltexconfigurationtarget) setting.

## External Setting Files

*See also [“Where does LTeX save its settings (e.g., dictionary, false positives)?”](faq.html#where-does-ltex-save-its-settings-eg-dictionary-false-positives) in the FAQ.*

Some of LTeX's settings support settings in external files. These settings are:

- [`ltex.dictionary`](settings.html#ltexdictionary)
- [`ltex.disabledRules`](settings.html#ltexdisabledrules)
- [`ltex.enabledRules`](settings.html#ltexenabledrules)
- [`ltex.hiddenFalsePositives`](settings.html#ltexhiddenfalsepositives)

These settings contain lists (e.g., lists of words in the case of [`ltex.dictionary`](settings.html#ltexdictionary)), which may be partly or fully put in external files. To do so, there are two options:

- Explicitly specify an external file
- Use one of LTeX's implicit defaults for external files

To use the first option and explicitly specify an external file, add the path of the external file with a colon (`:`) as prefix to the list (e.g., `:/path/to/externalFile.txt`). Each line of the file will be implicitly inserted as an entry into the value of the setting at the position where you specify the external file. External files must be in UTF-8 encoding.

A leading tilde (`~`) in the path is resolved with the home directory of the user. Relative paths are resolved relative to the `.vscode` directory in which you specify the external file, except for user settings, in which the path is resolved to the global storage path of the LTeX extension (this path is printed when using the [`LTeX: Show Status Information`](commands.html#ltex-show-status-information) command). If in doubt, use absolute paths instead.

The other option is using one of LTeX's implicit defaults for external files. The following files are automatically read (if existing). By default, all quick fixes such as `Add to dictionary` write into these files when being executed.

- `LTEX_GLOBAL_STORAGE_PATH/ltex.SETTING.LANGUAGE.txt`, where `LTEX_GLOBAL_STORAGE_PATH` is the global storage path of the LTeX extension
- `WORKSPACE/.vscode/ltex.SETTING.LANGUAGE.txt`, where `WORKSPACE` is the root directory of the opened workspace, if any
- `WORKSPACE_FOLDER/.vscode/ltex.SETTING.LANGUAGE.txt`, where `WORKSPACE_FOLDER` is the directory of the opened workspace folder, if any

`SETTING` is the name of the setting, and `LANGUAGE` is the language code (like in [`ltex.language`](settings.html#ltexlanguage)), for example `ltex.dictionary.en-US.txt`. You can use the [`LTeX: Show Status Information`](commands.html#ltex-show-status-information) command to see the paths of these three directories. For examples, see [“Where does LTeX save its settings (e.g., dictionary, false positives)?”](faq.html#where-does-ltex-save-its-settings-eg-dictionary-false-positives) in the FAQ.

When executing a quick fix such as `Add to dictionary`, LTeX will do the following if the value of [`ltex.configurationTarget`](settings.html#ltexconfigurationtarget) ends with `ExternalFile` (which it does by default): First, retrieve the list of the setting corresponding to the quick fix and to the language of the text in which the quick fix was executed. Then, pick the first entry that explicitly specifies an external file (i.e., the first entry starting with `:`). If there is no such entry, the implicit default path (see above) is used. The resulting external file is then appended with the entry to be added by the quick fix. If the file doesn't exist, it will be created, along with all necessary parent directories, if any are missing.

The scope in which this procedure is applied is determined by the [`ltex.configurationTarget`](settings.html#ltexconfigurationtarget) setting, and by the relevant workspaces or workspace folders.

*Example:* [`ltex.configurationTarget`](settings.html#ltexconfigurationtarget) is by default `workspaceFolderExternalFile` for `dictionary`. Therefore, when clicking `Add to dictionary` in an `en-US` document, LTeX will by default do the following:

1. If the document belongs to an open workspace folder:
   1. Retrieve the `en-US` part of the value of [`ltex.dictionary`](settings.html#ltexdictionary) that is set in the workspace folder settings.
   2. Pick the first external file in that list. If there is none, choose `WORKSPACE_FOLDER/.vscode/ltex.dictionary.en-US.txt` (create the file if necessary).
   3. Append the file by the new word.
2. Otherwise, if the document belongs to an open workspace:
   1. Retrieve the `en-US` part of the value of [`ltex.dictionary`](settings.html#ltexdictionary) that is set in the workspace settings.
   2. Pick the first external file in that list. If there is none, choose `WORKSPACE/.vscode/ltex.dictionary.en-US.txt` (create the file if necessary).
   3. Append the file by the new word.
3. Otherwise:
   1. Retrieve the `en-US` part of the value of [`ltex.dictionary`](settings.html#ltexdictionary) that is set in the user settings.
   2. Pick the first external file in that list. If there is none, choose `LTEX_GLOBAL_STORAGE_PATH/ltex.dictionary.en-US.txt` (create the file if necessary).
   3. Append the file by the new word.

## Magic Comments

Magic comments are special comments which contents are interpreted by LTeX and which can be used to change some LTeX settings in the middle of the document. The comments have the following form:

- LaTeX: `% LTeX: SETTINGS` on its own line (can be surrounded by whitespace)
- Markdown: One of the following on its own line (can be surrounded by whitespace):
  - `<!-- LTeX: SETTINGS -->`
  - `[comment]: <> "LTeX: SETTINGS"`

Magic comments are case-insensitive (except for the setting values), and the spaces in the magic comment line can be any amount of whitespace, even no amount at all.

`SETTINGS` has to be replaced with a whitespace-separated list of `KEY=VALUE` pairs. Neither `KEY` nor `VALUE` are enclosed in quotation marks. The following settings are supported:

- `enabled`: One of `true` or `false`. Makes it possible to disable LTeX for the rest of the document, or to enable it again.

  *Example:* `enabled=false`

- `language`: Changes the value of [`ltex.language`](settings.html#ltexlanguage) for the rest of the document.

  *Example:* `language=de-DE`

## Multilingual LaTeX Documents with the babel Package

While magic comments can be used to switch languages in a LaTeX document, this only makes sense for long parts of text. If you just want to use few words from another language, using magic comments can be cumbersome.

The preferred way of having multiple languages in one LaTeX document is using the [babel package](https://ctan.org/pkg/babel). This statement even holds if you don't use LTeX, as otherwise hyphenation and other language-specific aspects will be wrong in your typeset document. For instance, some words that exist in both English and German are hyphenated differently, depending on which language is used (example: `ham·​burg·​er` vs. `Ham·​bur·​ger`).

LTeX supports automatically switching its [`ltex.language`](settings.html#ltexlanguage) setting for a number of basic babel commands and environments. These are:

- `\usepackage[LANGUAGE]{babel}`: Switches the language for the rest of the document.
- `\selectlanguage{LANGUAGE}`: Switches the language for the rest of the document.
- `\foreignlanguage{LANGUAGE}{TEXT}`: Switches the language for the contents `TEXT` of the last argument.
- `\begin{otherlanguage}{LANGUAGE}TEXT\end{otherlanguage}`: Switches the language for the contents `TEXT` of the environment.

Here, `LANGUAGE` is one of babel's language names like `english`, `american`, `ngerman`, etc. Refer to the [babel manual](https://ctan.org/pkg/babel) for a list of possible language names. Keep in mind that not all languages supported by LTeX are supported by babel, and vice versa.

For the first point of the list, multiple comma-separated babel package options are allowed instead of just one `LANGUAGE`. If you specify multiple languages in the package options, e.g., `\usepackage[american,ngerman]{babel}` (since your document is multilingual), then babel and LTeX will default to the language that is mentioned last.

In addition, as the commands and environments given above are quite long, LTeX supports the following shortcuts:

- `\textLANGUAGETAG{TEXT}`: Short version of `\foreignlanguage{LANGUAGE}{TEXT}`.
- `\begin{LANGUAGETAG}TEXT\end{LANGUAGETAG}`: Short version of `\begin{otherlanguage}{LANGUAGE}TEXT\end{otherlanguage}`.

`LANGUAGETAG` can be any of the following:

- A language name like `english`, `american`, `ngerman`.
- A language short code like `en-US` or `de-DE` (see [`ltex.language`](settings.html#ltexlanguage)).
- A language short code with dashes removed. `\textLANGUAGETAG` only works without dashes (`\textenUS`).

In order for babel to recognize the shortcuts, you have to use the `\babeltags` command in the form `\babeltags{LANGUAGETAG1=LANGUAGE1, LANGUAGETAG2=LANGUAGE2, ...}` (e.g., `\babeltags{enUS=american, de-DE=ngerman, french=french}`). The `\babeltags` command should be in your preamble, and it's not required that it's in the same document as the text to be checked.

As `it` (Italian) and `sl` (Slovene) would lead to `\textit` and `\textsl`, which are already taken by LaTeX, these two language short codes are not supported. In this case, you have to resort to using the language names `italian` and `slovene`.

Please note the following caveat: Similarly to magic comments, LTeX only switches languages for the rest of the file that contains the babel commands. There is no inheritance for files that are included, e.g., via `\input` or `\include`. This is because LTeX is a file-based checker and has no notion of “LaTeX projects” that comprise multiple TeX files. In particular, `\usepackage[LANGUAGE]{babel}` will not switch languages if your preamble is in a different file than your text. In this case, use one of the other supported babel commands.

## Hiding False Positives with Regular Expressions

It's possible to use [`ltex.hiddenFalsePositives`](settings.html#ltexhiddenfalsepositives) to make LTeX hide false positives based on regular expressions.

The recommended way of using [`ltex.hiddenFalsePositives`](settings.html#ltexhiddenfalsepositives) is via the `Hide false positive` quick fix. This will add a JSON string containing the ID of the LanguageTool rule and the “sentence” to [`ltex.hiddenFalsePositives`](settings.html#ltexhiddenfalsepositives). LanguageTool internally splits every document into “sentences,” based on language-dependent rules (usually punctuation).

If you want to hide sentences based on a general pattern, you can add JSON strings with rule/sentence pairs yourself to [`ltex.hiddenFalsePositives`](settings.html#ltexhiddenfalsepositives). The format of the JSON string is documented in the description of the setting.

The sentence in the JSON string is a [Java-compatible regular expression](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html). Note that you have to replace all backslashes `\` in the regular expression with four backslashes `\\\\` as the JSON string will be parsed twice, once by VS Code for reading `settings.json` and once by LTeX to parse the JSON string itself.

In addition, note that if you wanted to match a literal backslash `\` in your regular expression, without the JSON escaping, you would have to use two backslashes `\\` due to the regular expression parser. Therefore, together with the JSON escaping, you actually have to use eight backslashes `\\\\\\\\` in total in your `settings.json` if you want to match a literal backslash. (In contrast, four backslashes are used, for instance, if you want to match the newline character `\n` as the backslash in there is not a literal backslash.)

Hiding false positives with [`ltex.hiddenFalsePositives`](settings.html#ltexhiddenfalsepositives) has the following caveats:

- Checking whether a match returned by LanguageTool is a false positive happens after the document has been converted from LaTeX, Markdown, etc. to plain text by LTeX. LanguageTool only returns the plain text sentence, but not the corresponding sentence in the original code. Therefore, the regular expression is matched against the plain text, not the original code. For instance, it's not possible to have a regular expression that matches all sentences that contain a specific LaTeX command.
- Checking whether a match returned by LanguageTool is a false positive happens after the document has been split into sentences. Therefore, it's not possible to have regular expressions that span multiple sentences.

## LanguageTool HTTP Servers

Although LTeX ships with its own version of LanguageTool (LT), it's possible to run LT independently of LTeX and have LTeX communicate with [LT via HTTP](https://dev.languagetool.org/http-server). There are multiple scenarios in which this might be useful:

- You want to run your own LT HTTP server, usually on `localhost`. This might be because the version of LT that comes with LTeX does not work, because you want to use an older or newer version of LT than LTeX's LT, or because you use other programs that use LT as well and you only want one instance of LT running.
- You want to use [LanguageTool Plus](https://languagetoolplus.com/), the paid version of LT. In this case, you need a Developer API plan, since the Premium plan does not include API access.

To connect to an LT HTTP server, set the setting [`ltex.ltex-ls.languageToolHttpServerUri`](settings.html#ltexltex-lslanguagetoolhttpserveruri) to the root URI of the server, for instance, `http://localhost:8081/`. Note that in this mode, LTeX will still depend on ltex-ls and Java, as the interface for communicating with LT over HTTP is in ltex-ls.
