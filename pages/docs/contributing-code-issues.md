---
title: "Contributing Code/Issues"
permalink: "/docs/contributing-code-issues.html"
sidebar: "sidebar"
---

Contributions are welcome! Please go to our [GitHub repository](https://github.com/valentjn/vscode-ltex) to

- report issues of LTeX,
- request a new feature, or
- open pull requests.

## How to Report Bugs

1. Make sure that your issue is really an LTeX bug.
2. Make sure that your issue can neither be found in the list of known issues below nor in the [list of all open and closed GitHub issues](https://github.com/valentjn/vscode-ltex/issues?q=is%3Aissue) (this applies to feature requests as well).
3. Set the option `"ltex.trace.server": "verbose"` in your `settings.json`.
4. Try to understand the bug by selecting `View` → `Output` → `LTeX Language Server`/`LTeX Language Client`.
5. Append the relevant parts of these logs when opening an issue on GitHub.

## Known Issues

* The LaTeX parser is not perfect. False positives are sometimes reported as errors. However, it is impossible to fully parse LaTeX without compiling it.
