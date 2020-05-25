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
5. Wait until [ltex-ls](faq.html#whats-the-difference-between-vscode-ltex-ltex-ls-and-languagetool) and Java have been found; if necessary, LT<sub>E</sub>X downloads both for you. Alternatively, you can choose [offline installation](#offline-installation).
6. Grammar/spelling errors will be displayed! (if there are any)

## Offline Installation

The key component of LTeX, the LTeX Language Server (ltex-ls), which also includes LanguageTool itself, cannot be included in the LTeX version distributed on the Visual Studio Marketplace due to file size restrictions. In addition, ltex-ls requires Java due to its LanguageTool dependency.

When activated for the first time, LTeX will automatically download and use the latest compatible ltex-ls release from GitHub and, in case no existing installation of Java has been found, a portable Java distribution ([AdoptOpenJDK](https://adoptopenjdk.net/)). Both will be stored in the extension folder.

If you don't have an Internet connection, or if you simply don't want this, there are two alternatives.

### First Alternative: Download the Offline Version of LTeX

Download the offline version of LTeX at the [Releases page on GitHub](https://github.com/valentjn/vscode-ltex/releases) and install it via `Extensions: Install from VSIX...` on the Command Palette. The offline version includes _everything_ (ltex-ls and a Java distribution). Reload the Visual Studio Code window after installing the offline version.

### Second Alternative: Download ltex-ls/Java Individually

Download [ltex-ls](https://github.com/valentjn/ltex-ls/releases) and/or a Java distribution (for instance [AdoptOpenJDK](https://adoptopenjdk.net/)) individually and set [`ltex.ltex-ls.path`](settings.html#ltexltex-lspath) and/or [`ltex.java.path`](settings.html#ltexjavapath) to the respective locations. Note that the versions of ltex-ls and/or Java have to satisfy the following requirements:

- The version of ltex-ls must be lower than or equal to the version of LTeX itself (i.e., the vscode-ltex extension). Most of the time you want to choose the newest version of ltex-ls that satisfies this requirement (let's call it version X). This is exactly what LTeX does when using the automatic installation, even when newer versions of ltex-ls are available, as LTeX has only been tested with version X of ltex-ls. An older or a newer ltex-ls version than version X might work, or it might not.

    *Example:* If your version of LTeX is 5.0.3 and the available versions of ltex-ls are 5.0.0, 5.0.1, and 5.0.4, then choose ltex-ls 5.0.1, since that's the newest version lower than or equal to 5.0.3. An even better option is instead upgrading your version of LTeX, as there's likely a newer one that uses ltex-ls 5.0.4.
- The version of Java must be at least 8. If you can choose between Java 8 and Java 11 (or a newer version), then choose the newer version, since LTeX will require Java 11 in the near future. Some Java distributions offer a JRE (Java Runtime Environment) and a JDK (Java Development Kit); in this case, the JRE is sufficient.

If you download Java, you can also decide to install it system-wide. In this case, LTeX should be able to detect its location without having to set [`ltex.java.path`](settings.html#ltexjavapath). If not, you can still set [`ltex.java.path`](settings.html#ltexjavapath) to the location of your system-wide installation.

Reload the Visual Studio Code window after installing ltex-ls and/or Java.

If ltex-ls fails to start for whatever reason after you downloaded ltex-ls and/or Java (and after you set [`ltex.ltex-ls.path`](settings.html#ltexltex-lspath) and/or [`ltex.java.path`](settings.html#ltexjavapath)), LTeX will fallback to downloading the respective dependency.
