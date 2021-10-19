---
name: "Bug Report"
about: "Something isn't working as expected? Create a bug report. See https://valentjn.github.io/ltex/vscode-ltex/contributing.html#how-to-report-bugs to learn how to report bugs."
title: ""
labels: "1-bug 🐛, 2-unconfirmed"
assignees: ""
---

Note: It is highly recommended to follow the instructions at https://valentjn.github.io/ltex/vscode-ltex/contributing.html#how-to-report-bugs and use the `LTeX: Report bug in LTeX` command from within Visual Studio Code. Per the contribution guidelines, deleting parts of the template or not filling in vital information may result in the issue to be immediately closed as invalid.

**Describe the bug**
A clear and concise description of what the bug is.

**Steps to reproduce**
Steps to reproduce the behavior:

1. Go to "..."
2. Click on "..."
3. Scroll down to "..."
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Sample document**
If the bug occurs for a specific document (e.g. LaTeX), please paste it here. If your document is very long or confidential, please create and attach a smaller example for which the bug still occurs so that we can reproduce it.

<details>

```
REPLACE_THIS_WITH_SAMPLE_DOCUMENT
```

</details>

**LTeX configuration**
Please paste all configuration settings starting with `ltex.` from your `settings.json`. You can help us by temporarily removing some irrelevant settings from your `settings.json` and see if the bug still occurs.

<details>

```
REPLACE_THIS_WITH_LTEX_CONFIGURATION
```

</details>

**"LTeX Language Server" log file**
First, reproduce the bug. Then, go to `View` → `Output` and select `LTeX Language Server` in the drop-down list. Paste this log here:

<details>

```
REPLACE_THIS_WITH_LTEX_LANGUAGE_SERVER_LOG
```

</details>

**"LTeX Language Client" log file**
First, set the `ltex.trace.server` setting in your `settings.json` to `"verbose"`. Then, reload the VS Code window and reproduce the bug. Go to `View` → `Output` and select `LTeX Language Client` in the drop-down list. Paste this log here (note: it will contain your checked document):

<details>

```
REPLACE_THIS_WITH_LTEX_LANGUAGE_CLIENT_LOG
```

</details>

**Version information**
List here the version information of the relevant software.

- Operating system: Linux (which distribution/version), macOS xx.xx, or Windows xx
- VS Code: 1.xx.x
- vscode-ltex: x.xx
- ltex-ls: x.xx (only if not using ltex-ls automatically downloaded by LTeX)
- Java: x.xx (usually obtained with `java -version`, only if not using Java automatically downloaded by LTeX)

**Additional context/information**
You can add any other context or information about the problem here.
