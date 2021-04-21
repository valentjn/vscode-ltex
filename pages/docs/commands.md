---
# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

title: "Commands"
permalink: "/docs/commands.html"
sidebar: "sidebar"
---

Change language of this page: [English](commands.html), [German](commands-de.html)

This page is specific to vscode-ltex. It does not apply if you use a different LTeX plugin for an editor other than VS Code.

To run a command, open the Command Palette (`Ctrl+Shift+P`) and start typing the name of the command.

## `LTeX: Activate Extension`

Activates the extension; does nothing if the extension is already activated.

The extension is automatically activated when files with supported code language modes (= default value of [`ltex.enabled`](settings.html#ltexenabled)) are opened in the editor. Use this command if you want to use LTeX on files with unsupported code language modes.

## `LTeX: Check Selection`

Triggers a check of the primary selection of the active document, and clears all LTeX diagnostics of the active document outside the primary selection.

The active document is the one whose editor currently has focus, or, if none has focus, the one which was changed most recently.

It is usually not necessary to run this command as LTeX automatically checks supported documents when being opened or changed.

## `LTeX: Check Current Document`

Triggers a check of the active document.

The active document is the one whose editor currently has focus, or, if none has focus, the one which was changed most recently.

It is usually not necessary to run this command as LTeX automatically checks supported documents when being opened or changed.

## `LTeX: Check All Documents in Workspace`

Triggers a check of all Markdown and LaTeX documents in the workspace.

This does a file search for `*.bib`, `*.md`, `*.org`, `*.Rnw`, `*.rst`, and `*.tex` files in all folders of the workspace, depending on for which file types LTeX has been enabled (see [`ltex.enabled`](settings.html#ltexenabled)). Untitled and unsaved documents are not checked. The types of the documents are recognized by their file extensions.

The documents must be in UTF-8 encoding. This does not work if no folders are opened in the workspace.

## `LTeX: Clear Diagnostics in Current Document`

Clears all LTeX diagnostics in the active document.

The active document is the one whose editor currently has focus, or, if none has focus, the one which was changed most recently.

## `LTeX: Clear All Diagnostics`

Clears all LTeX diagnostics.

## `LTeX: Show Status Information`

Shows information about the current status of LTeX in the `LTeX Language Client` output panel.

Information about ltex-ls is only included if ltex-ls is running and not checking a document.

## `LTeX: Reset and Restart`

Resets the current state of the extension and restarts LTeX LS.

This is equivalent to reloading the VS Code window and activating the extension. Use this command if LTeX does not behave as expected.

## `LTeX: Report Bug in LTeX`

Shows a message box with a link to instructions on how to report bugs in LTeX and a button to copy a bug report.

When clicking the button, LTeX will copy a pre-filled bug report to the clipboard, which can then be pasted into the GitHub issue.

## `LTeX: Request Feature for LTeX`

Creates a new feature request for LTeX by opening the GitHub website.
