---
name: "Bug report"
about: "Create a report to help us improve (fill in as many details as you can). See https://valentjn.github.io/vscode-ltex/docs/contributing-code-issues.html#how-to-report-bugs to learn how to report bugs."
title: ""
labels: "1-bug, 2-unconfirmed"
assignees: ""

---

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
If the bug occurs for a specific document (e.g. LaTeX), please attach it. If its contents are confidential, please create and attach a smaller example for which the bug still occurs so that we can reproduce it.

**LTeX configuration**
Please attach all configuration settings starting with `ltex.` from your `settings.json`. Don't omit anything, as it might be related to the bug. If some of your settings are too large (e.g., your user dictionary), or if you have too many settings, temporarily remove some irrelevant settings from your `settings.json` and see if the bug still occurs.

**"LTeX Language Server" log file**
First, reproduce the bug. Then, go to `View` → `Output` and select `LTeX Language Server` in the drop-down list. Paste the relevant part of this log here (leave the "details" tags and the backticks as they are to have nice formatting):

<details>
```
REPLACE_WITH_LTEX_LANGUAGE_SERVER_LOG
```
</details>

**"LTeX Language Client" log file**
First, set the `ltex.trace.server` setting in your `settings.json` to `"verbose"`. Then, reload the VS Code window and reproduce the bug. Go to `View` → `Output` and select `LTeX Language Client` in the drop-down list. Paste the relevant part of this log here (leave the "details" tags and the backticks as they are to have nice formatting):

<details>
```
REPLACE_WITH_LTEX_LANGUAGE_CLIENT_LOG
```
</details>

**Version information**
List here the version information of the relevant software.

- Operating system: Linux (which distribution/version), macOS xx.xx, or Windows xx
- VS Code: 1.xx.x
- LTeX: x.xx
- Java: x.xx (usually obtained with `java -version`, only if not using Java automatically downloaded by LTeX)

**Additional context/information**
You can add any other context or information about the problem here.
