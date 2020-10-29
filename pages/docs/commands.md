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

## `LTeX: Check current document`

Triggers a re-check of the active document.

The active document is the one whose editor currently has focus, or, if none has focus, the one which was changed most recently.

It is usually not necessary to run this command as LTeX automatically checks documents when being opened or changed.

## `LTeX: Check all documents in workspace`

Triggers a check of all Markdown and LaTeX documents in the workspace.

This does a file search for `*.md` and `*.tex` files in all folders of the workspace (i.e., untitled and unsaved documents are not checked). The type of the documents is recognized by their file extension.

The documents must be in UTF-8 encoding. Does not work if no folders are opened in the workspace.

## `LTeX: Clear diagnostics in current document`

Clears all LTeX diagnostics in the active document.

The active document is the one whose editor currently has focus, or, if none has focus, the one which was changed most recently.

## `LTeX: Clear all diagnostics`

Clears all LTeX diagnostics.

## `LTeX: Report bug in LTeX`

Shows a message box with a link to instructions on how to report bugs in LTeX and a button to copy a bug report.

When clicking the button, LTeX will copy a pre-filled bug report to the clipboard, which can then be pasted into the GitHub issue.

## `LTeX: Request feature for LTeX`

Creates a new feature request for LTeX by opening the GitHub website.
