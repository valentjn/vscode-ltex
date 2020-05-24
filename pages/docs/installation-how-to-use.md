---
title: "Installation & How to Use"
permalink: "/docs/installation-how-to-use.html"
sidebar: "sidebar"
---

## Requirements

- 64-bit operating system
- [VS Code 1.39 or newer](https://code.visualstudio.com/)
- [LaTeX Workshop Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop) (if you want to check LaTeX documents)

## How to Use

1. Install the requirements listed above
2. Install this extension
3. Reload the VS Code window if necessary
4. Open a LaTeX or a Markdown document, or open a new file and change the language mode to `LaTeX` or `Markdown` (open the Command Palette and select `Change Language Mode`)
5. Wait until ltex-ls and Java have been found; if necessary, LTeX downloads both for you.
6. Grammar/spelling errors will be displayed! (if there are any)

## Offline Installation

The key component of LTeX, the LTeX Language Server (ltex-ls), which also includes LanguageTool itself, cannot be included in the LTeX version distributed on the Visual Studio Marketplace due to file size restrictions. In addition, ltex-ls requires Java due to its LanguageTool dependency. When activated for the first time, LTeX will automatically download and use the latest compatible ltex-ls release from GitHub and, in case no existing installation of Java has been found, a portable Java distribution ([AdoptOpenJDK](https://adoptopenjdk.net/)). Both will be stored in the extension folder. If you don't have an Internet connection, or if you simply don't want this, there are two alternatives.

### First Alternative

Download the offline version of LTeX on the [Releases page](https://github.com/valentjn/vscode-ltex/releases) and install it via `Extensions: Install from VSIX...` on the Command Palette. The offline version includes _everything_ (ltex-ls and a Java distribution).

### Second Alternative

Download [ltex-ls](https://github.com/valentjn/ltex-ls/releases) and/or a Java distribution (for instance [AdoptOpenJDK](https://adoptopenjdk.net/)) individually and set [`ltex.ltex-ls.path`](settings.html#ltexltex-lspath) and/or [`ltex.java.path`](settings.html#ltexjavapath) to the respective locations. If you do this, the versions of ltex-ls and/or Java have to satisfy the following requirements:

- The version of ltex-ls must be smaller than or equal to the version of LTeX itself (this extension). Most of the time you want to choose the newest version of ltex-ls that satisfies this requirement. A newer version of ltex-ls will not work, an older version might not work.
- The version of Java must be at least 8. Some Java distributions offer a JRE and a JDK; in this case, the JRE (Java Runtime Environment) is sufficient.
