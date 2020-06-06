# Contributing

Contributions are welcome! Please go to our [GitHub repository](https://github.com/valentjn/vscode-ltex) to

- report bugs,
- request a new feature, or
- contribute code.

## How to Report Bugs

1. Make sure that your issue is really an LT<sub>E</sub>X bug.
2. Make sure that your issue can neither be found in the list of known issues below nor in the [list of all open and closed GitHub issues](https://github.com/valentjn/vscode-ltex/issues?q=is%3Aissue).
3. If your bug is occurring for a long document, please remove some parts of your document and see if the bug still occurs. Similarly, if you have a lot of `ltex.` settings, please remove some settings and see if the bug still occurs.
4. Set the option `"ltex.trace.server": "verbose"` in your `settings.json`.
5. Try to understand the bug by selecting `View` → `Output` → `LTeX Language Server`/`LTeX Language Client`.
6. Select the `Bug report` template when [opening an issue on GitHub](https://github.com/valentjn/vscode-ltex/issues/new/choose) and fill in as much info as you can. This will help us reproduce the issue.

### Known Issues and Limitations

- The LaTeX parser is not perfect. False positives are sometimes reported as errors. However, it is impossible to fully parse LaTeX without compiling it.
- Initial checking might take a while (up to two minutes), depending on the length of the document. [This is a limitation of LanguageTool.](https://valentjn.github.io/vscode-ltex/docs/faq.html#why-does-ltex-have-such-a-high-cpu-load)

## How to Request Features

1. Make sure that your feature is actually about LT<sub>E</sub>X (not about LanguageTool, for example).
2. Make sure that your feature is not in the [list of all open and closed GitHub issues](https://github.com/valentjn/vscode-ltex/issues?q=is%3Aissue).
3. Select the `Feature request` template when [opening an issue on GitHub](https://github.com/valentjn/vscode-ltex/issues/new/choose) and fill in as much info as you can. Using actual real-world examples that explain why you and many other users would benefit from the feature increases the request's chances of being implemented.

## How to Contribute Code

[As explained in the FAQ](https://valentjn.github.io/vscode-ltex/docs/faq.html#whats-the-difference-between-vscode-ltex-ltex-ls-and-languagetool), LT<sub>E</sub>X consists of two components: [vscode-ltex](https://github.com/valentjn/vscode-ltex) and [ltex-ls](https://github.com/valentjn/ltex-ls). vscode-ltex is written in TypeScript and consists mostly of boilerplate code to find, download and extract ltex-ls and Java. ltex-ls is written in Java and is the actual interface to the LanguageTool backend.

### Branches & Pull Requests

Both repositories currently have two main branches: `develop` and `release`. The `develop` branch is where new changes are integrated, so choose this as the target branch of your pull requests. The `release` branch always points to the latest release.

In order for pull requests to be merged, checks from Travis CI have to pass (successful build and tests on all platforms). In the case of ltex-ls, Coveralls additionally checks for at least 90% code coverage by the tests.

### Versioning

LT<sub>E</sub>X uses [semantic versioning](https://semver.org/) since version 5.0.0. The versions of vscode-ltex and ltex-ls are tied together: vscode-ltex automatically downloads the newest version of ltex-ls which has a version smaller or equal version than itself (`max {ltex-ls-version | ltex-ls-version <= vscode-ltex-version}`). This means that when a new version of ltex-ls is released, a new version of vscode-ltex has to be released as well, using the same version number (but not vice versa).

This ensures that each version of vscode-ltex always uses the same version of ltex-ls, making downgrades possible, and that we don't have to worry about upgrading mechanisms, since Visual Studio Code will do that for us.

### Documentation

In addition, there is the possibility to work on the [documentation](https://valentjn.github.io/vscode-ltex). It's using GitHub Pages, Jekyll, and Markdown, and a bunch of Python scripts copies information over from the main repository (settings, changelog, etc.).

Analogously to the actual extension, there are two branches, which are stored in the [repository of vscode-ltex](https://github.com/valentjn/vscode-ltex): `gh-pages-develop` and `gh-pages`. Improvements go to `gh-pages-develop`, while `gh-pages` reflects the documentation for the latest release.

At the bottom of each page, you'll find an “Edit me” button that takes you directly to the corresponding Markdown document in the GitHub repo.
