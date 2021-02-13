---
# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

title: "Commands"
permalink: "/docs/commands-de.html"
sidebar: "sidebar"
---

Change language of this page: [English](commands.html), [German](commands-de.html)

Um einen Befehl auszuführen, öffnen Sie die Befehlspalette (`Ctrl+Shift+P`) und beginnen Sie mit der Eingabe des Befehlsnamens. Die Befehle können nur dann ausgeführt werden, nachdem die Erweiterung aktiviert worden ist, das heißt, nachdem mindestens eine LaTeX- oder Markdown-Datei im aktuellen Arbeitsbereich geöffnet worden ist.

## `LTeX: Prüfe Auswahl`

Löst eine Prüfung der primären Auswahl des aktiven Dokuments aus und löscht alle durch LTeX gemeldeten Schreibfehler im aktiven Dokument außerhalb der primären Auswahl.

Das aktive Dokument ist dasjenige, dessen Editor momentan den Fokus besitzt, oder, falls kein Editor den Fokus besitzt, welches als letztes geändert wurde.

Es ist normalerweise nicht nötig, diesen Befehl auszuführen, da LTeX alle unterstützten Dokumente prüft, wenn sie geöffnet oder geändert werden.

## `LTeX: Prüfe aktuelles Dokument`

Löst eine Prüfung des aktiven Dokuments aus.

Das aktive Dokument ist dasjenige, dessen Editor momentan den Fokus besitzt, oder, falls kein Editor den Fokus besitzt, welches als letztes geändert wurde.

Es ist normalerweise nicht nötig, diesen Befehl auszuführen, da LTeX alle unterstützten Dokumente prüft, wenn sie geöffnet oder geändert werden.

## `LTeX: Prüfe alle Dokumente im Arbeitsbereich`

Löst eine Prüfung aller Markdown- und LaTeX-Dokumente im Arbeitsbereich aus.

Dies führt eine Dateisuche nach `*.bib`-, `*.tex`- und `*.md`-Dateien in allen Ordnern des Arbeitsbereiches durch, je nachdem, für welche Dateitypen LTeX aktiviert wurde (siehe [`ltex.enabled`](settings-de.html#ltexenabled)). Unbenannte und ungespeicherte Dokumente werden nicht überprüft. Die Dokumenttypen werden anhand der Dateinamen-Erweiterungen erkannt.

Die Dokumente müssen in der UTF-8-Kodierung vorliegen. Dies funktioniert nicht, falls keine Ordner im Arbeitsbereich geöffnet sind.

## `LTeX: Schreibfehler in aktuellem Dokument löschen`

Löscht alle durch LTeX gemeldeten Schreibfehler im aktiven Dokument.

Das aktive Dokument ist dasjenige, dessen Editor momentan den Fokus besitzt, oder, falls kein Editor den Fokus besitzt, welches als letztes geändert wurde.

## `LTeX: Alle Schreibfehler löschen`

Löscht alle durch LTeX gemeldeten Schreibfehler.

## `LTeX: Zeige Statusinformationen`

Zeigt Informationen über den aktuellen Status von LTeX im Protokoll `LTeX Language Client`.

Informationen über ltex-ls werden nur angezeigt, wenn ltex-ls gerade läuft und nicht ein Dokument überprüft.

## `LTeX: Bug in LTeX melden`

Zeigt eine Meldung an, die einen Link zu Anweisungen über wie man Bugs in LTeX meldet und einen Knopf zum Kopieren eines Bug-Berichts enthält.

Wenn der Knopf gedrückt wird, dann kopiert LTeX einen vorausgefüllten Bug-Bericht in die Zwischenablage, die anschließend in das GitHub-Problem eingefügt werden kann.

## `LTeX: Feature in LTeX wünschen`

Erstellt einen neuen Feature-Wunsch für LTeX, indem die GitHub-Webseite geöffnet wird.
