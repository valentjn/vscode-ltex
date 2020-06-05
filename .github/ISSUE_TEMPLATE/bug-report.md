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
Please attach any LTeX-related configuration settings from your `settings.json`.

** Log files**
First, set the `ltex.trace.server` setting in your `settings.json` to `"verbose"`. Then, reload the VS Code window and reproduce the bug. Go to `View` → `Output` and select `LTeX Language Server` and `LTeX Language Client` in the drop-down list. Paste or attach the relevant parts of these logs here in the GitHub issue.

**Version information**
List here the version information of the relevant software.

- Operating system: Linux (which distribution/version), macOS xx.xx, or Windows xx
- VS Code: 1.xx.x
- LTeX: x.xx
- LTeX language extensions: English/x.xx, ...
- Java: x.xx (usually from `java -version`)

**Additional context/information**
You can add any other context or information about the problem here.
