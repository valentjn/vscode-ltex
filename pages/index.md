---
title: "LT<sub>E</sub>X – LanguageTool Grammar/Spell Checking for Visual Studio Code with L<sup>A</sup>T<sub>E</sub>X Support"
title_plaintext: "LTeX – LanguageTool Grammar/Spell Checking for Visual Studio Code with LaTeX Support"
sidebar: "sidebar"
permalink: "/index.html"
---

Hello World!

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
