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

To run a command, open the Command Palette (`Ctrl+Shift+P`) and start typing the name of the command. The commands can only be run after the extension has been activated, i.e., after at least one Markdown or LaTeX file has been opened in the current workspace.

## `LTeX: Check Current Document`

Triggers a re-check of the active document.

The active document is the one whose editor currently has focus, or, if none has focus, the one which was changed most recently.

It is usually not necessary to run this command as LTeX automatically checks documents when being opened or changed.

## `LTeX: Check All Documents in Workspace`

Triggers a check of all Markdown and LaTeX documents in the workspace.

This does a file search for `*.bib`, `*.tex`, and `*.md` files in all folders of the workspace, depending on for which file types LTeX has been enabled (see [`ltex.enabled`](settings.html#ltexenabled)). Untitled and unsaved documents are not checked. The types of the documents are recognized by their file extensions.

The documents must be in UTF-8 encoding. This does not work if no folders are opened in the workspace.

## `LTeX: Clear Diagnostics in Current Document`

Clears all LTeX diagnostics in the active document.

The active document is the one whose editor currently has focus, or, if none has focus, the one which was changed most recently.

## `LTeX: Clear All Diagnostics`

Clears all LTeX diagnostics.

## `LTeX: Show Status Information`

Shows information about the current status of LTeX in the `LTeX Language Client` output panel.

Information about ltex-ls is only included if ltex-ls is running and not checking a document.

## `LTeX: Report Bug in LTeX`

Shows a message box with a link to instructions on how to report bugs in LTeX and a button to copy a bug report.

When clicking the button, LTeX will copy a pre-filled bug report to the clipboard, which can then be pasted into the GitHub issue.

## `LTeX: Request Feature for LTeX`

Creates a new feature request for LTeX by opening the GitHub website.
