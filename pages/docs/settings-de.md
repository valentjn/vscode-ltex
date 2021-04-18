---
# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

title: "Settings"
permalink: "/docs/settings-de.html"
sidebar: "sidebar"
---

Change language of this page: [English](settings.html), [German](settings-de.html)

## `ltex.enabled`

Steuert, ob die Erweiterung aktiviert ist. Erlaubt die Deaktivierung von LanguageTool für bestimmte Arbeitsbereiche oder für bestimmte Code-Sprachmodi (d. h. Dateitypen).

Sie können entweder einen Boolean-Wert angeben, der bestimmt, ob LTeX für alle unterstützten Code-Sprachmodi aktiviert oder für alle Sprachmodi deaktiviert wird, oder eine Liste von [Code-Sprachbezeichnern](https://code.visualstudio.com/docs/languages/identifiers), für die LTeX aktiviert werden soll (beachten Sie, dass Erweiterungen zusätzliche Code-Sprachbezeichner definieren können).

Alle unterstützten Code-Sprachmodi sind in der Voreinstellung dieser Einstellung aufgelistet. Wenn Sie einen nicht-unterstützten Code-Sprachmodus hinzufügen (also einen Code-Sprachmodus, der nicht in der Voreinstellung enthalten ist), dann wird LTeX entsprechende Dateien als reinen Text ohne Parsen überprüfen.

Die Aktivierungsereignisse werden von dieser Einstellung nicht berührt. Das heißt, dass die Erweiterung aktiviert wird, sobald eine Datei mit einem unterstützten Code-Sprachmodus geöffnet wird. Falls Sie Dateien mit nicht-unterstützten Codi-Sprachmodi überprüfen wollen, müssen Sie eventuell die Erweiterung explizit mithilfe des Befehls [`LTeX: Aktiviere Erweiterung`](commands-de.html#ltex-aktiviere-erweiterung) aktivieren.

Nach Änderungen muss das Fenster von Visual Studio Code erneut geladen werden.

*Typ:* `boolean` oder `array`

*Voreinstellung:* `["bibtex", "latex", "markdown", "org", "restructuredtext", "rsweave"]`

*Vollständige Beschreibung des Typs:* <button class='expandable-button btn btn-default'>Klick zum Zeigen/Verbergen</button>

<div markdown='1' style='display:none;'>

Einer der folgenden Typen:

- Skalar vom Typ `boolean`
- Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`

</div>

## `ltex.language`

Die Sprache (z. B. `"en-US"`), mit der LanguageTool auf Fehler suchen soll. Benutzen Sie eine bestimmte Variante wie `"en-US"` oder `"de-DE"` anstelle des generischen Sprachcodes wie `"en"` oder `"de"`, um Rechtschreibfehler zu finden (zusätzlich zu Grammatikfehlern).

*Typ:* `string`

*Mögliche Werte:*

- `"ar"`: Arabic
- `"ast-ES"`: Asturian
- `"be-BY"`: Belarusian
- `"br-FR"`: Breton
- `"ca-ES"`: Catalan
- `"ca-ES-valencia"`: Catalan (Valencian)
- `"da-DK"`: Danish
- `"de"`: German
- `"de-AT"`: German (Austria)
- `"de-CH"`: German (Swiss)
- `"de-DE"`: German (Germany)
- `"de-DE-x-simple-language"`: Simple German
- `"el-GR"`: Greek
- `"en"`: English
- `"en-AU"`: English (Australian)
- `"en-CA"`: English (Canadian)
- `"en-GB"`: English (GB)
- `"en-NZ"`: English (New Zealand)
- `"en-US"`: English (US)
- `"en-ZA"`: English (South African)
- `"eo"`: Esperanto
- `"es"`: Spanish
- `"fa"`: Persian
- `"fr"`: French
- `"ga-IE"`: Irish
- `"gl-ES"`: Galician
- `"it"`: Italian
- `"ja-JP"`: Japanese
- `"km-KH"`: Khmer
- `"nl"`: Dutch
- `"nl-BE"`: Dutch (Belgium)
- `"pl-PL"`: Polish
- `"pt"`: Portuguese
- `"pt-AO"`: Portuguese (Angola preAO)
- `"pt-BR"`: Portuguese (Brazil)
- `"pt-MZ"`: Portuguese (Moçambique preAO)
- `"pt-PT"`: Portuguese (Portugal)
- `"ro-RO"`: Romanian
- `"ru-RU"`: Russian
- `"sk-SK"`: Slovak
- `"sl-SI"`: Slovenian
- `"sv"`: Swedish
- `"ta-IN"`: Tamil
- `"tl-PH"`: Tagalog
- `"uk-UA"`: Ukrainian
- `"zh-CN"`: Chinese

*Voreinstellung:* `"en-US"`

## `ltex.dictionary`

Listen von zusätzlichen Wörtern, die nicht als Schreibfehler gewertet werden sollen.

Diese Einstellung ist sprachabhängig. Benutzen Sie daher ein Objekt der Form `{"<SPRACHE1>": ["<WORT1>", "<WORT2>", ...], "<SPRACHE2>": ["<WORT1>", "<WORT2>", ...], ...}`, wobei `<SPRACHE>` den Sprachcode in [`ltex.language`](settings-de.html#ltexlanguage) bezeichnet.

Diese Einstellung ist eine Multi-Scope-Einstellung. [Siehe die Dokumentation für Details.](advanced-usage.html#multi-scope-settings)

Diese Einstellung unterstützt externe Dateien. [Siehe die Dokumentation für Details.](advanced-usage.html#external-setting-files)

Standardmäßig werden keine zusätzlichen Schreibfehler ignoriert.

*Typ:* `object`

*Beispiel:* `{"en-US": ["adaptivity", "precomputed", "subproblem"], "de-DE": ["B-Splines", ":/path/to/externalFile.txt"]}`

*Voreinstellung:* `{}`

*Vollständige Beschreibung des Typs:* <button class='expandable-button btn btn-default'>Klick zum Zeigen/Verbergen</button>

<div markdown='1' style='display:none;'>

Objekt mit folgenden Eigenschaften:

- `"ar"`: Liste von zusätzlichen Wörtern der Sprache `ar` (Arabic), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ast-ES"`: Liste von zusätzlichen Wörtern der Sprache `ast-ES` (Asturian), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"be-BY"`: Liste von zusätzlichen Wörtern der Sprache `be-BY` (Belarusian), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"br-FR"`: Liste von zusätzlichen Wörtern der Sprache `br-FR` (Breton), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ca-ES"`: Liste von zusätzlichen Wörtern der Sprache `ca-ES` (Catalan), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ca-ES-valencia"`: Liste von zusätzlichen Wörtern der Sprache `ca-ES-valencia` (Catalan (Valencian)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"da-DK"`: Liste von zusätzlichen Wörtern der Sprache `da-DK` (Danish), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de"`: Liste von zusätzlichen Wörtern der Sprache `de` (German), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-AT"`: Liste von zusätzlichen Wörtern der Sprache `de-AT` (German (Austria)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-CH"`: Liste von zusätzlichen Wörtern der Sprache `de-CH` (German (Swiss)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-DE"`: Liste von zusätzlichen Wörtern der Sprache `de-DE` (German (Germany)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-DE-x-simple-language"`: Liste von zusätzlichen Wörtern der Sprache `de-DE-x-simple-language` (Simple German), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"el-GR"`: Liste von zusätzlichen Wörtern der Sprache `el-GR` (Greek), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en"`: Liste von zusätzlichen Wörtern der Sprache `en` (English), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-AU"`: Liste von zusätzlichen Wörtern der Sprache `en-AU` (English (Australian)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-CA"`: Liste von zusätzlichen Wörtern der Sprache `en-CA` (English (Canadian)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-GB"`: Liste von zusätzlichen Wörtern der Sprache `en-GB` (English (GB)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-NZ"`: Liste von zusätzlichen Wörtern der Sprache `en-NZ` (English (New Zealand)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-US"`: Liste von zusätzlichen Wörtern der Sprache `en-US` (English (US)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-ZA"`: Liste von zusätzlichen Wörtern der Sprache `en-ZA` (English (South African)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"eo"`: Liste von zusätzlichen Wörtern der Sprache `eo` (Esperanto), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"es"`: Liste von zusätzlichen Wörtern der Sprache `es` (Spanish), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"fa"`: Liste von zusätzlichen Wörtern der Sprache `fa` (Persian), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"fr"`: Liste von zusätzlichen Wörtern der Sprache `fr` (French), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ga-IE"`: Liste von zusätzlichen Wörtern der Sprache `ga-IE` (Irish), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"gl-ES"`: Liste von zusätzlichen Wörtern der Sprache `gl-ES` (Galician), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"it"`: Liste von zusätzlichen Wörtern der Sprache `it` (Italian), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ja-JP"`: Liste von zusätzlichen Wörtern der Sprache `ja-JP` (Japanese), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"km-KH"`: Liste von zusätzlichen Wörtern der Sprache `km-KH` (Khmer), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"nl"`: Liste von zusätzlichen Wörtern der Sprache `nl` (Dutch), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"nl-BE"`: Liste von zusätzlichen Wörtern der Sprache `nl-BE` (Dutch (Belgium)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pl-PL"`: Liste von zusätzlichen Wörtern der Sprache `pl-PL` (Polish), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt"`: Liste von zusätzlichen Wörtern der Sprache `pt` (Portuguese), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-AO"`: Liste von zusätzlichen Wörtern der Sprache `pt-AO` (Portuguese (Angola preAO)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-BR"`: Liste von zusätzlichen Wörtern der Sprache `pt-BR` (Portuguese (Brazil)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-MZ"`: Liste von zusätzlichen Wörtern der Sprache `pt-MZ` (Portuguese (Moçambique preAO)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-PT"`: Liste von zusätzlichen Wörtern der Sprache `pt-PT` (Portuguese (Portugal)), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ro-RO"`: Liste von zusätzlichen Wörtern der Sprache `ro-RO` (Romanian), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ru-RU"`: Liste von zusätzlichen Wörtern der Sprache `ru-RU` (Russian), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"sk-SK"`: Liste von zusätzlichen Wörtern der Sprache `sk-SK` (Slovak), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"sl-SI"`: Liste von zusätzlichen Wörtern der Sprache `sl-SI` (Slovenian), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"sv"`: Liste von zusätzlichen Wörtern der Sprache `sv` (Swedish), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ta-IN"`: Liste von zusätzlichen Wörtern der Sprache `ta-IN` (Tamil), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"tl-PH"`: Liste von zusätzlichen Wörtern der Sprache `tl-PH` (Tagalog), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"uk-UA"`: Liste von zusätzlichen Wörtern der Sprache `uk-UA` (Ukrainian), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"zh-CN"`: Liste von zusätzlichen Wörtern der Sprache `zh-CN` (Chinese), die nicht als Schreibfehler gewertet werden sollen.

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`

</div>

## `ltex.disabledRules`

Listen von zusätzlichen Regeln, die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

Diese Einstellung ist sprachabhängig. Benutzen Sie daher ein Objekt der Form `{"<SPRACHE1>": ["<REGEL1>", "<REGEL2>", ...], "<SPRACHE2>": ["<REGEL1>", "<REGEL2>", ...], ...}`, wobei `<SPRACHE>` den Sprachcode in [`ltex.language`](settings-de.html#ltexlanguage) und `<REGEL>` die ID der LanguageTool-Regel bezeichnet.

Diese Einstellung ist eine Multi-Scope-Einstellung. [Siehe die Dokumentation für Details.](advanced-usage.html#multi-scope-settings)

Diese Einstellung unterstützt externe Dateien. [Siehe die Dokumentation für Details.](advanced-usage.html#external-setting-files)

Standardmäßig werden keine zusätzlichen Regeln deaktiviert.

*Typ:* `object`

*Beispiel:* `{"en-US": ["EN_QUOTES", "UPPERCASE_SENTENCE_START", ":/path/to/externalFile.txt"]}`

*Voreinstellung:* `{}`

*Vollständige Beschreibung des Typs:* <button class='expandable-button btn btn-default'>Klick zum Zeigen/Verbergen</button>

<div markdown='1' style='display:none;'>

Objekt mit folgenden Eigenschaften:

- `"ar"`: Liste von zusätzlichen Regeln der Sprache `ar` (Arabic), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ast-ES"`: Liste von zusätzlichen Regeln der Sprache `ast-ES` (Asturian), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"be-BY"`: Liste von zusätzlichen Regeln der Sprache `be-BY` (Belarusian), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"br-FR"`: Liste von zusätzlichen Regeln der Sprache `br-FR` (Breton), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ca-ES"`: Liste von zusätzlichen Regeln der Sprache `ca-ES` (Catalan), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ca-ES-valencia"`: Liste von zusätzlichen Regeln der Sprache `ca-ES-valencia` (Catalan (Valencian)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"da-DK"`: Liste von zusätzlichen Regeln der Sprache `da-DK` (Danish), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de"`: Liste von zusätzlichen Regeln der Sprache `de` (German), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-AT"`: Liste von zusätzlichen Regeln der Sprache `de-AT` (German (Austria)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-CH"`: Liste von zusätzlichen Regeln der Sprache `de-CH` (German (Swiss)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-DE"`: Liste von zusätzlichen Regeln der Sprache `de-DE` (German (Germany)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-DE-x-simple-language"`: Liste von zusätzlichen Regeln der Sprache `de-DE-x-simple-language` (Simple German), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"el-GR"`: Liste von zusätzlichen Regeln der Sprache `el-GR` (Greek), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en"`: Liste von zusätzlichen Regeln der Sprache `en` (English), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-AU"`: Liste von zusätzlichen Regeln der Sprache `en-AU` (English (Australian)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-CA"`: Liste von zusätzlichen Regeln der Sprache `en-CA` (English (Canadian)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-GB"`: Liste von zusätzlichen Regeln der Sprache `en-GB` (English (GB)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-NZ"`: Liste von zusätzlichen Regeln der Sprache `en-NZ` (English (New Zealand)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-US"`: Liste von zusätzlichen Regeln der Sprache `en-US` (English (US)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-ZA"`: Liste von zusätzlichen Regeln der Sprache `en-ZA` (English (South African)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"eo"`: Liste von zusätzlichen Regeln der Sprache `eo` (Esperanto), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"es"`: Liste von zusätzlichen Regeln der Sprache `es` (Spanish), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"fa"`: Liste von zusätzlichen Regeln der Sprache `fa` (Persian), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"fr"`: Liste von zusätzlichen Regeln der Sprache `fr` (French), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ga-IE"`: Liste von zusätzlichen Regeln der Sprache `ga-IE` (Irish), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"gl-ES"`: Liste von zusätzlichen Regeln der Sprache `gl-ES` (Galician), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"it"`: Liste von zusätzlichen Regeln der Sprache `it` (Italian), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ja-JP"`: Liste von zusätzlichen Regeln der Sprache `ja-JP` (Japanese), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"km-KH"`: Liste von zusätzlichen Regeln der Sprache `km-KH` (Khmer), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"nl"`: Liste von zusätzlichen Regeln der Sprache `nl` (Dutch), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"nl-BE"`: Liste von zusätzlichen Regeln der Sprache `nl-BE` (Dutch (Belgium)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pl-PL"`: Liste von zusätzlichen Regeln der Sprache `pl-PL` (Polish), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt"`: Liste von zusätzlichen Regeln der Sprache `pt` (Portuguese), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-AO"`: Liste von zusätzlichen Regeln der Sprache `pt-AO` (Portuguese (Angola preAO)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-BR"`: Liste von zusätzlichen Regeln der Sprache `pt-BR` (Portuguese (Brazil)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-MZ"`: Liste von zusätzlichen Regeln der Sprache `pt-MZ` (Portuguese (Moçambique preAO)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-PT"`: Liste von zusätzlichen Regeln der Sprache `pt-PT` (Portuguese (Portugal)), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ro-RO"`: Liste von zusätzlichen Regeln der Sprache `ro-RO` (Romanian), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ru-RU"`: Liste von zusätzlichen Regeln der Sprache `ru-RU` (Russian), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"sk-SK"`: Liste von zusätzlichen Regeln der Sprache `sk-SK` (Slovak), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"sl-SI"`: Liste von zusätzlichen Regeln der Sprache `sl-SI` (Slovenian), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"sv"`: Liste von zusätzlichen Regeln der Sprache `sv` (Swedish), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ta-IN"`: Liste von zusätzlichen Regeln der Sprache `ta-IN` (Tamil), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"tl-PH"`: Liste von zusätzlichen Regeln der Sprache `tl-PH` (Tagalog), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"uk-UA"`: Liste von zusätzlichen Regeln der Sprache `uk-UA` (Ukrainian), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"zh-CN"`: Liste von zusätzlichen Regeln der Sprache `zh-CN` (Chinese), die deaktiviert werden sollen (falls standardmäßig durch LanguageTool aktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`

</div>

## `ltex.enabledRules`

Listen von zusätzlichen Regeln, die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

Diese Einstellung ist sprachabhängig. Benutzen Sie daher ein Objekt der Form `{"<SPRACHE1>": ["<REGEL1>", "<REGEL2>", ...], "<SPRACHE2>": ["<REGEL1>", "<REGEL2>", ...], ...}`, wobei `<SPRACHE>` den Sprachcode in [`ltex.language`](settings-de.html#ltexlanguage) und `<REGEL>` die ID der LanguageTool-Regel bezeichnet.

Diese Einstellung ist eine Multi-Scope-Einstellung. [Siehe die Dokumentation für Details.](advanced-usage.html#multi-scope-settings)

Diese Einstellung unterstützt externe Dateien. [Siehe die Dokumentation für Details.](advanced-usage.html#external-setting-files)

Standardmäßig werden keine zusätzlichen Regeln aktiviert.

*Typ:* `object`

*Beispiel:* `{"en-GB": ["PASSIVE_VOICE", "OXFORD_SPELLING_NOUNS", ":/path/to/externalFile.txt"]}`

*Voreinstellung:* `{}`

*Vollständige Beschreibung des Typs:* <button class='expandable-button btn btn-default'>Klick zum Zeigen/Verbergen</button>

<div markdown='1' style='display:none;'>

Objekt mit folgenden Eigenschaften:

- `"ar"`: Liste von zusätzlichen Regeln der Sprache `ar` (Arabic), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ast-ES"`: Liste von zusätzlichen Regeln der Sprache `ast-ES` (Asturian), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"be-BY"`: Liste von zusätzlichen Regeln der Sprache `be-BY` (Belarusian), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"br-FR"`: Liste von zusätzlichen Regeln der Sprache `br-FR` (Breton), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ca-ES"`: Liste von zusätzlichen Regeln der Sprache `ca-ES` (Catalan), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ca-ES-valencia"`: Liste von zusätzlichen Regeln der Sprache `ca-ES-valencia` (Catalan (Valencian)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"da-DK"`: Liste von zusätzlichen Regeln der Sprache `da-DK` (Danish), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de"`: Liste von zusätzlichen Regeln der Sprache `de` (German), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-AT"`: Liste von zusätzlichen Regeln der Sprache `de-AT` (German (Austria)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-CH"`: Liste von zusätzlichen Regeln der Sprache `de-CH` (German (Swiss)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-DE"`: Liste von zusätzlichen Regeln der Sprache `de-DE` (German (Germany)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-DE-x-simple-language"`: Liste von zusätzlichen Regeln der Sprache `de-DE-x-simple-language` (Simple German), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"el-GR"`: Liste von zusätzlichen Regeln der Sprache `el-GR` (Greek), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en"`: Liste von zusätzlichen Regeln der Sprache `en` (English), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-AU"`: Liste von zusätzlichen Regeln der Sprache `en-AU` (English (Australian)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-CA"`: Liste von zusätzlichen Regeln der Sprache `en-CA` (English (Canadian)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-GB"`: Liste von zusätzlichen Regeln der Sprache `en-GB` (English (GB)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-NZ"`: Liste von zusätzlichen Regeln der Sprache `en-NZ` (English (New Zealand)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-US"`: Liste von zusätzlichen Regeln der Sprache `en-US` (English (US)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-ZA"`: Liste von zusätzlichen Regeln der Sprache `en-ZA` (English (South African)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"eo"`: Liste von zusätzlichen Regeln der Sprache `eo` (Esperanto), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"es"`: Liste von zusätzlichen Regeln der Sprache `es` (Spanish), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"fa"`: Liste von zusätzlichen Regeln der Sprache `fa` (Persian), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"fr"`: Liste von zusätzlichen Regeln der Sprache `fr` (French), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ga-IE"`: Liste von zusätzlichen Regeln der Sprache `ga-IE` (Irish), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"gl-ES"`: Liste von zusätzlichen Regeln der Sprache `gl-ES` (Galician), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"it"`: Liste von zusätzlichen Regeln der Sprache `it` (Italian), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ja-JP"`: Liste von zusätzlichen Regeln der Sprache `ja-JP` (Japanese), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"km-KH"`: Liste von zusätzlichen Regeln der Sprache `km-KH` (Khmer), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"nl"`: Liste von zusätzlichen Regeln der Sprache `nl` (Dutch), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"nl-BE"`: Liste von zusätzlichen Regeln der Sprache `nl-BE` (Dutch (Belgium)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pl-PL"`: Liste von zusätzlichen Regeln der Sprache `pl-PL` (Polish), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt"`: Liste von zusätzlichen Regeln der Sprache `pt` (Portuguese), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-AO"`: Liste von zusätzlichen Regeln der Sprache `pt-AO` (Portuguese (Angola preAO)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-BR"`: Liste von zusätzlichen Regeln der Sprache `pt-BR` (Portuguese (Brazil)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-MZ"`: Liste von zusätzlichen Regeln der Sprache `pt-MZ` (Portuguese (Moçambique preAO)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-PT"`: Liste von zusätzlichen Regeln der Sprache `pt-PT` (Portuguese (Portugal)), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ro-RO"`: Liste von zusätzlichen Regeln der Sprache `ro-RO` (Romanian), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ru-RU"`: Liste von zusätzlichen Regeln der Sprache `ru-RU` (Russian), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"sk-SK"`: Liste von zusätzlichen Regeln der Sprache `sk-SK` (Slovak), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"sl-SI"`: Liste von zusätzlichen Regeln der Sprache `sl-SI` (Slovenian), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"sv"`: Liste von zusätzlichen Regeln der Sprache `sv` (Swedish), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ta-IN"`: Liste von zusätzlichen Regeln der Sprache `ta-IN` (Tamil), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"tl-PH"`: Liste von zusätzlichen Regeln der Sprache `tl-PH` (Tagalog), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"uk-UA"`: Liste von zusätzlichen Regeln der Sprache `uk-UA` (Ukrainian), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"zh-CN"`: Liste von zusätzlichen Regeln der Sprache `zh-CN` (Chinese), die aktiviert werden sollen (falls standardmäßig durch LanguageTool deaktiviert).

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`

</div>

## `ltex.hiddenFalsePositives`

Listen von falschen Fehlern, die verborgen werden sollen (indem alle Fehler einer bestimmten Regel in einem bestimmten Satz verborgen werden).

Diese Einstellung ist sprachabhängig. Benutzen Sie daher ein Objekt der Form `{"<SPRACHE1>": ["<JSON1>", "<JSON2>", ...], "<SPRACHE2>": ["<JSON1>", "<JSON2>", ...], ...}`, wobei `<SPRACHE>` den Sprachcode in [`ltex.language`](settings-de.html#ltexlanguage) bezeichnet und `<JSON>` eine JSON-Zeichenfolge ist, die Informationen über die Regel und den Satz enthält.

Obwohl es möglich ist, diese Einstellung manuell zu ändern, ist der bevorzugte Weg, Einträge zu dieser Einstellung hinzuzufügen, die schnelle Problembehebung `Falschen Fehler verbergen`.

Die JSON-Zeichenfolge hat momentan die Form `{"rule": "<REGEL>", "sentence": "<SATZ>"}`, wobei `<REGEL>` die ID der LanguageTool-Regel und `<SATZ>` einen Java-kompatiblen regulären Ausdruck bezeichnet. Alle Vorkommen der gegebenen Regel werden in allen Sätzen (die durch den LanguageTool-Tokenizer bestimmt werden) verborgen, die zum regulären Ausdruck passen. [Siehe die Dokumentation für Details.](advanced-usage.html#hiding-false-positives-with-regular-expressions)

Diese Einstellung ist eine Multi-Scope-Einstellung. [Siehe die Dokumentation für Details.](advanced-usage.html#multi-scope-settings)

Diese Einstellung unterstützt externe Dateien. [Siehe die Dokumentation für Details.](advanced-usage.html#external-setting-files)

Die Leistung kann darunter leiden, falls diese Liste sehr lang ist.

*Typ:* `object`

*Beispiel:* `{"en-US": [":/path/to/externalFile.txt"]}`

*Voreinstellung:* `{}`

*Vollständige Beschreibung des Typs:* <button class='expandable-button btn btn-default'>Klick zum Zeigen/Verbergen</button>

<div markdown='1' style='display:none;'>

Objekt mit folgenden Eigenschaften:

- `"ar"`: Liste von falschen Fehlern der Sprache `ar` (Arabic), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ast-ES"`: Liste von falschen Fehlern der Sprache `ast-ES` (Asturian), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"be-BY"`: Liste von falschen Fehlern der Sprache `be-BY` (Belarusian), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"br-FR"`: Liste von falschen Fehlern der Sprache `br-FR` (Breton), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ca-ES"`: Liste von falschen Fehlern der Sprache `ca-ES` (Catalan), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ca-ES-valencia"`: Liste von falschen Fehlern der Sprache `ca-ES-valencia` (Catalan (Valencian)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"da-DK"`: Liste von falschen Fehlern der Sprache `da-DK` (Danish), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de"`: Liste von falschen Fehlern der Sprache `de` (German), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-AT"`: Liste von falschen Fehlern der Sprache `de-AT` (German (Austria)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-CH"`: Liste von falschen Fehlern der Sprache `de-CH` (German (Swiss)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-DE"`: Liste von falschen Fehlern der Sprache `de-DE` (German (Germany)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"de-DE-x-simple-language"`: Liste von falschen Fehlern der Sprache `de-DE-x-simple-language` (Simple German), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"el-GR"`: Liste von falschen Fehlern der Sprache `el-GR` (Greek), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en"`: Liste von falschen Fehlern der Sprache `en` (English), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-AU"`: Liste von falschen Fehlern der Sprache `en-AU` (English (Australian)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-CA"`: Liste von falschen Fehlern der Sprache `en-CA` (English (Canadian)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-GB"`: Liste von falschen Fehlern der Sprache `en-GB` (English (GB)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-NZ"`: Liste von falschen Fehlern der Sprache `en-NZ` (English (New Zealand)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-US"`: Liste von falschen Fehlern der Sprache `en-US` (English (US)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"en-ZA"`: Liste von falschen Fehlern der Sprache `en-ZA` (English (South African)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"eo"`: Liste von falschen Fehlern der Sprache `eo` (Esperanto), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"es"`: Liste von falschen Fehlern der Sprache `es` (Spanish), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"fa"`: Liste von falschen Fehlern der Sprache `fa` (Persian), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"fr"`: Liste von falschen Fehlern der Sprache `fr` (French), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ga-IE"`: Liste von falschen Fehlern der Sprache `ga-IE` (Irish), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"gl-ES"`: Liste von falschen Fehlern der Sprache `gl-ES` (Galician), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"it"`: Liste von falschen Fehlern der Sprache `it` (Italian), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ja-JP"`: Liste von falschen Fehlern der Sprache `ja-JP` (Japanese), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"km-KH"`: Liste von falschen Fehlern der Sprache `km-KH` (Khmer), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"nl"`: Liste von falschen Fehlern der Sprache `nl` (Dutch), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"nl-BE"`: Liste von falschen Fehlern der Sprache `nl-BE` (Dutch (Belgium)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pl-PL"`: Liste von falschen Fehlern der Sprache `pl-PL` (Polish), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt"`: Liste von falschen Fehlern der Sprache `pt` (Portuguese), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-AO"`: Liste von falschen Fehlern der Sprache `pt-AO` (Portuguese (Angola preAO)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-BR"`: Liste von falschen Fehlern der Sprache `pt-BR` (Portuguese (Brazil)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-MZ"`: Liste von falschen Fehlern der Sprache `pt-MZ` (Portuguese (Moçambique preAO)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"pt-PT"`: Liste von falschen Fehlern der Sprache `pt-PT` (Portuguese (Portugal)), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ro-RO"`: Liste von falschen Fehlern der Sprache `ro-RO` (Romanian), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ru-RU"`: Liste von falschen Fehlern der Sprache `ru-RU` (Russian), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"sk-SK"`: Liste von falschen Fehlern der Sprache `sk-SK` (Slovak), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"sl-SI"`: Liste von falschen Fehlern der Sprache `sl-SI` (Slovenian), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"sv"`: Liste von falschen Fehlern der Sprache `sv` (Swedish), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"ta-IN"`: Liste von falschen Fehlern der Sprache `ta-IN` (Tamil), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"tl-PH"`: Liste von falschen Fehlern der Sprache `tl-PH` (Tagalog), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"uk-UA"`: Liste von falschen Fehlern der Sprache `uk-UA` (Ukrainian), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`
- `"zh-CN"`: Liste von falschen Fehlern der Sprache `zh-CN` (Chinese), die verborgen werden sollen .

  Array, bei dem jeder Eintrag folgenden Typ hat:

  - Skalar vom Typ `string`

</div>

## `ltex.bibtex.fields`

Liste von BibTeX-Feldern, deren Werte in BibTeX-Dateien auf Fehler überprüft werden sollen.

Diese Einstellung ist ein Objekt mit den Namen der Felder als Schlüssel und Booleans als Werte, wobei `true` heißt, dass der Wert der Feldes überprüft werden soll, und `false` heißt, dass der Wert des Feldes ignoriert werden soll.

Einige gebräuchliche Felder werden bereits ignoriert, selbst, wenn Sie diese Einstellung auf ein leeres Objekt setzen.

*Typ:* `object`

*Beispiel:* `{"maintitle": false, "seealso": true}`

*Voreinstellung:* `{}`

*Vollständige Beschreibung des Typs:* <button class='expandable-button btn btn-default'>Klick zum Zeigen/Verbergen</button>

<div markdown='1' style='display:none;'>

Objekt mit beliebigen Eigenschaftsnamen, wobei die Werte jeder Eigenschaft folgenden Typ hat:

- Skalar vom Typ `boolean`

</div>

## `ltex.latex.commands`

Liste von LaTeX-Befehlen, die vom LaTeX-Parser gesondert behandelt werden sollen, aufgelistet zusammen mit leeren Argumenten (z. B. `"\\ref{}"`, `"\\documentclass[]{}"`).

Diese Einstellung ist ein Objekt mit den Befehlen als Schlüssel und zugehörigen Aktionen als Werte.

Falls Sie die `settings.json`-Datei direkt bearbeiten, beachten Sie, dass Sie den Backslash am Anfang durch Ersetzung mit zwei Backslashs escapen müssen. Falls Sie das Einstellungspanel von VS Code benutzen, geben Sie nur ein Backslash ein.

Viele gebräuchliche Befehle werden standardmäßig bereits gesondert behandelt, selbst, wenn Sie diese Einstellung auf ein leeres Objekt setzen.

*Typ:* `object`

*Beispiel:* `{"\\ref{}": "ignore", "\\documentclass[]{}": "ignore", "\\cite{}": "dummy", "\\cite[]{}": "dummy"}`

*Voreinstellung:* `{}`

*Vollständige Beschreibung des Typs:* <button class='expandable-button btn btn-default'>Klick zum Zeigen/Verbergen</button>

<div markdown='1' style='display:none;'>

Objekt mit beliebigen Eigenschaftsnamen, wobei die Werte jeder Eigenschaft folgenden Typ hat:

- Einer der folgenden Werte:

  - `"default"`: Der Befehl wird so behandelt, wie unbekannte Befehle standardmäßig behandelt werden: Der Befehlsname an sich wird ignoriert, aber die Befehlsargumente werden nicht ignoriert.
  - `"ignore"`: Der ganze Befehl zusammen mit seinen Argumenten wird ignoriert.
  - `"dummy"`: Der ganze Befehl zusammen mit seinen Argumenten wird durch ein Dummy-Wort ersetzt (d. h. `Dummy0`, `Dummy1` usw.). LTeX nutzt diesen Mechanismus intern für Gleichungen, Literaturverweise, Referenzen und ähnliche Konstrukte, die Teil der Satzstruktur sind und für die LanguageTool einen Fehler anzeigen würde, wenn man sie einfach im überprüften Text weglassen würde.
  - `"pluralDummy"`: Der ganze Befehl zusammen mit seinen Argumenten wird durch ein Plural-Dummy-Wort ersetzt (d. h. `Dummies`). LTeX nutzt diesen Mechanismus intern für Gleichungen, Literaturverweise, Referenzen und ähnliche Konstrukte, die Teil der Satzstruktur sind und für die LanguageTool einen Fehler anzeigen würde, wenn man sie einfach im überprüften Text weglassen würde.

</div>

## `ltex.latex.environments`

Liste von Namen von LaTeX-Umgebungen, die vom LaTeX-Parser gesondert behandelt werden sollen.

Diese Einstellung ist ein Objekt mit den Umgebungsnamen als Schlüssel und zugehörigen Aktionen als Werte.

Manche Umgebungen werden standardmäßig bereits gesondert behandelt, selbst, wenn Sie diese Einstellung auf ein leeres Objekt setzen.

*Typ:* `object`

*Beispiel:* `{"lstlisting": "ignore", "verbatim": "ignore"}`

*Voreinstellung:* `{}`

*Vollständige Beschreibung des Typs:* <button class='expandable-button btn btn-default'>Klick zum Zeigen/Verbergen</button>

<div markdown='1' style='display:none;'>

Objekt mit beliebigen Eigenschaftsnamen, wobei die Werte jeder Eigenschaft folgenden Typ hat:

- Einer der folgenden Werte:

  - `"default"`: Die Umgebung wird so behandelt, wie unbekannte Umgebungen standardmäßig behandelt werden: Die Argumente der Umgebung werden ignoriert, aber der Inhalt der Umgebung wird nicht ignoriert.
  - `"ignore"`: Die ganze Umgebung zusammen mit ihren Argumenten und ihrem Inhalt wird ignoriert.

</div>

## `ltex.markdown.nodes`

Liste von Markdown-Knotentypen, die vom Markdown-Parser gesondert behandelt werden sollen.

Diese Einstellung ist ein Objekt mit den Knotentypen als Schlüssel und zugehörigen Aktionen als Werte.

Der Markdown-Parser erstellt einen AST (abstrakten Syntaxbaum) für das Markdown-Dokument, bei dem alle Blätter den Knotentyp `Text` haben. Sie finden alle möglichen Knotentypen in der [Dokumentation von flexmark-java](https://javadoc.io/static/com.vladsch.flexmark/flexmark/0.62.2/com/vladsch/flexmark/ast/package-summary.html).

Manche gebräuchlichen Knotentypen werden standardmäßig bereits gesondert behandelt, selbst, wenn Sie diese Einstellung auf ein leeres Objekt setzen.

*Typ:* `object`

*Beispiel:* `{"CodeBlock": "ignore", "FencedCodeBlock": "ignore", "AutoLink": "dummy", "Code": "dummy"}`

*Voreinstellung:* `{}`

*Vollständige Beschreibung des Typs:* <button class='expandable-button btn btn-default'>Klick zum Zeigen/Verbergen</button>

<div markdown='1' style='display:none;'>

Objekt mit beliebigen Eigenschaftsnamen, wobei die Werte jeder Eigenschaft folgenden Typ hat:

- Einer der folgenden Werte:

  - `"default"`: Der Knoten wird nicht gesondert behandelt.
  - `"ignore"`: Der ganze Knoten zusammen mit seinen `Text`-Blättern wird ignoriert.
  - `"dummy"`: Der ganze Knoten zusammen mit seinen `Text`-Blättern wird durch ein Dummy-Wort ersetzt (d. h. `Dummy0`, `Dummy1` usw.). LTeX nutzt diesen Mechanismus intern für Gleichungen, Literaturverweise, Referenzen und ähnliche Konstrukte, die Teil der Satzstruktur sind und für die LanguageTool einen Fehler anzeigen würde, wenn man sie einfach im überprüften Text weglassen würde.
  - `"pluralDummy"`: Der ganze Knoten zusammen mit seinen `Text`-Blättern wird durch ein Plural-Dummy-Wort ersetzt (d. h. `Dummies`). LTeX nutzt diesen Mechanismus intern für Gleichungen, Literaturverweise, Referenzen und ähnliche Konstrukte, die Teil der Satzstruktur sind und für die LanguageTool einen Fehler anzeigen würde, wenn man sie einfach im überprüften Text weglassen würde.

</div>

## `ltex.configurationTarget`

Steuert, welche `settings.json` oder externe Einstellungsdatei ([siehe die Dokumentation](advanced-usage.html#external-setting-files)) geändert wird, wenn eine der schnellen Problembehebungen verwendet wird.

*Typ:* `object`

*Voreinstellung:* `{"dictionary": "workspaceFolderExternalFile", "disabledRules": "workspaceFolderExternalFile", "hiddenFalsePositives": "workspaceFolderExternalFile"}`

*Vollständige Beschreibung des Typs:* <button class='expandable-button btn btn-default'>Klick zum Zeigen/Verbergen</button>

<div markdown='1' style='display:none;'>

Objekt mit folgenden Eigenschaften:

- `"dictionary"`: Einer der folgenden Werte:

  - `"user"`: Wenn ein Wort zum Wörterbuch hinzugefügt wird, verändere stets die Benutzer-Konfiguration.
  - `"workspace"`: Wenn ein Wort zum Wörterbuch hinzugefügt wird, verändere die Arbeitsbereich-Konfiguration, falls gerade ein Arbeitsbereich geöffnet ist, ansonsten die Benutzer-Konfiguration.
  - `"workspaceFolder"`: Wenn ein Wort zum Wörterbuch hinzugefügt wird, verändere die Arbeitsbereichsordner-Konfiguration, falls gerade ein Arbeitsbereichsordner geöffnet ist, ansonsten die Arbeitsbereich-Konfiguration, falls gerade ein Arbeitsbereich geöffnet ist, ansonsten die Benutzer-Konfiguration.
  - `"userExternalFile"`: Wenn ein Wort zum Wörterbuch hinzugefügt wird, verändere stets die erste externe Einstellungsdatei in der Benutzer-Konfiguration.
  - `"workspaceExternalFile"`: Wenn ein Wort zum Wörterbuch hinzugefügt wird, verändere die erste externe Einstellungsdatei in der Arbeitsbereich-Konfiguration, falls gerade ein Arbeitsbereich geöffnet ist, ansonsten die analoge Datei in der Benutzer-Konfiguration.
  - `"workspaceFolderExternalFile"`: Wenn ein Wort zum Wörterbuch hinzugefügt wird, verändere die erste externe Einstellungsdatei in der Arbeitsbereichsordner-Konfiguration, falls gerade ein Arbeitsbereichsordner geöffnet ist, ansonsten die analoge Datei in der Arbeitsbereich-Konfiguration, falls gerade ein Arbeitsbereich geöffnet ist, ansonsten die analoge Datei in der Benutzer-Konfiguration.
- `"disabledRules"`: Einer der folgenden Werte:

  - `"user"`: Wenn eine Regel deaktiviert wird, verändere stets die Benutzer-Konfiguration.
  - `"workspace"`: Wenn eine Regel deaktiviert wird, verändere die Arbeitsbereich-Konfiguration, falls gerade ein Arbeitsbereich geöffnet ist, ansonsten die Benutzer-Konfiguration.
  - `"workspaceFolder"`: Wenn eine Regel deaktiviert wird, verändere die Arbeitsbereichsordner-Konfiguration, falls gerade ein Arbeitsbereichsordner geöffnet ist, ansonsten die Arbeitsbereich-Konfiguration, falls gerade ein Arbeitsbereich geöffnet ist, ansonsten die Benutzer-Konfiguration.
  - `"userExternalFile"`: Wenn eine Regel deaktiviert wird, verändere stets die erste externe Einstellungsdatei in der Benutzer-Konfiguration.
  - `"workspaceExternalFile"`: Wenn eine Regel deaktiviert wird, verändere die erste externe Einstellungsdatei in der Arbeitsbereich-Konfiguration, falls gerade ein Arbeitsbereich geöffnet ist, ansonsten die analoge Datei in der Benutzer-Konfiguration.
  - `"workspaceFolderExternalFile"`: Wenn eine Regel deaktiviert wird, verändere die erste externe Einstellungsdatei in der Arbeitsbereichsordner-Konfiguration, falls gerade ein Arbeitsbereichsordner geöffnet ist, ansonsten die analoge Datei in der Arbeitsbereich-Konfiguration, falls gerade ein Arbeitsbereich geöffnet ist, ansonsten die analoge Datei in der Benutzer-Konfiguration.
- `"hiddenFalsePositives"`: Einer der folgenden Werte:

  - `"user"`: Wenn ein falscher Fehler verborgen wird, verändere stets die Benutzer-Konfiguration.
  - `"workspace"`: Wenn ein falscher Fehler verborgen wird, verändere die Arbeitsbereich-Konfiguration, falls gerade ein Arbeitsbereich geöffnet ist, ansonsten die Benutzer-Konfiguration.
  - `"workspaceFolder"`: Wenn ein falscher Fehler verborgen wird, verändere die Arbeitsbereichsordner-Konfiguration, falls gerade ein Arbeitsbereichsordner geöffnet ist, ansonsten die Arbeitsbereich-Konfiguration, falls gerade ein Arbeitsbereich geöffnet ist, ansonsten die Benutzer-Konfiguration.
  - `"userExternalFile"`: Wenn ein falscher Fehler verborgen wird, verändere stets die erste externe Einstellungsdatei in der Benutzer-Konfiguration.
  - `"workspaceExternalFile"`: Wenn ein falscher Fehler verborgen wird, verändere die erste externe Einstellungsdatei in der Arbeitsbereich-Konfiguration, falls gerade ein Arbeitsbereich geöffnet ist, ansonsten die analoge Datei in der Benutzer-Konfiguration.
  - `"workspaceFolderExternalFile"`: Wenn ein falscher Fehler verborgen wird, verändere die erste externe Einstellungsdatei in der Arbeitsbereichsordner-Konfiguration, falls gerade ein Arbeitsbereichsordner geöffnet ist, ansonsten die analoge Datei in der Arbeitsbereich-Konfiguration, falls gerade ein Arbeitsbereich geöffnet ist, ansonsten die analoge Datei in der Benutzer-Konfiguration.

</div>

## `ltex.additionalRules.enablePickyRules`

Aktiviere LanguageTool-Regeln, die als pedantisch ("picky") markiert und standardmäßig deaktiviert sind, z. B. Regeln bzgl. Passiv, Satzlänge etc.

*Typ:* `boolean`

*Voreinstellung:* `false`

## `ltex.additionalRules.motherTongue`

Optionale Muttersprache des Benutzers (z. B. `"de-DE"`).

Falls diese Einstellung gesetzt ist, werden zusätzliche Regeln verwendet, um falsche Freunde zu erkennen. Es kann sein, dass pedantische Regeln aktiviert werden müssen, damit diese Einstellung eine Auswirkung hat (siehe [`ltex.additionalRules.enablePickyRules`](settings-de.html#ltexadditionalrulesenablepickyrules)). Die Erkennung von falschen Freunden verbessert sich, falls ein Sprachmodell bereitgestellt wird (siehe [`ltex.additionalRules.languageModel`](settings-de.html#ltexadditionalruleslanguagemodel)).

*Typ:* `string`

*Mögliche Werte:*

- `""`: Keine Muttersprache
- `"ar"`: Arabic
- `"ast-ES"`: Asturian
- `"be-BY"`: Belarusian
- `"br-FR"`: Breton
- `"ca-ES"`: Catalan
- `"ca-ES-valencia"`: Catalan (Valencian)
- `"da-DK"`: Danish
- `"de"`: German
- `"de-AT"`: German (Austria)
- `"de-CH"`: German (Swiss)
- `"de-DE"`: German (Germany)
- `"de-DE-x-simple-language"`: Simple German
- `"el-GR"`: Greek
- `"en"`: English
- `"en-AU"`: English (Australian)
- `"en-CA"`: English (Canadian)
- `"en-GB"`: English (GB)
- `"en-NZ"`: English (New Zealand)
- `"en-US"`: English (US)
- `"en-ZA"`: English (South African)
- `"eo"`: Esperanto
- `"es"`: Spanish
- `"fa"`: Persian
- `"fr"`: French
- `"ga-IE"`: Irish
- `"gl-ES"`: Galician
- `"it"`: Italian
- `"ja-JP"`: Japanese
- `"km-KH"`: Khmer
- `"nl"`: Dutch
- `"nl-BE"`: Dutch (Belgium)
- `"pl-PL"`: Polish
- `"pt"`: Portuguese
- `"pt-AO"`: Portuguese (Angola preAO)
- `"pt-BR"`: Portuguese (Brazil)
- `"pt-MZ"`: Portuguese (Moçambique preAO)
- `"pt-PT"`: Portuguese (Portugal)
- `"ro-RO"`: Romanian
- `"ru-RU"`: Russian
- `"sk-SK"`: Slovak
- `"sl-SI"`: Slovenian
- `"sv"`: Swedish
- `"ta-IN"`: Tamil
- `"tl-PH"`: Tagalog
- `"uk-UA"`: Ukrainian
- `"zh-CN"`: Chinese

*Voreinstellung:* `""`

## `ltex.additionalRules.languageModel`

Optionaler Pfad zu einem Verzeichnis mit Regeln eines Sprachmodells mit *n*-Gramm-Vorkommniszahlen.

*Typ:* `string`

*Voreinstellung:* `""`

## `ltex.additionalRules.neuralNetworkModel`

Optionaler Pfad zu einem Verzeichnis mit Regeln eines Modells eines bereits trainierten neuronalen Netzwerks.

*Typ:* `string`

*Voreinstellung:* `""`

## `ltex.additionalRules.word2VecModel`

Optionaler Pfad zu einem Verzeichnis mit Regeln eines word2vec-Sprachmodells.

*Typ:* `string`

*Voreinstellung:* `""`

## `ltex.ltex-ls.path`

Falls dies auf eine leere Zeichenfolge gesetzt ist, dann lädt LTeX automatisch [ltex-ls von GitHub](https://github.com/valentjn/ltex-ls/releases) herunter, speichert es im Erweiterungsordner, und benutzt es für die Textüberprüfung. Sie können diese Einstellung auf den Ort eines ltex-ls-Release setzen, das Sie selbst heruntergeladen haben.

Benutzen Sie dafür den Pfad zum Hauptverzeichnis von ltex-ls (dieses enthält die Unterverzeichnisse `bin` und `lib`).

Nach Änderungen muss das Fenster von Visual Studio Code erneut geladen werden.

*Typ:* `string`

*Voreinstellung:* `""`

## `ltex.ltex-ls.languageToolHttpServerUri`

Falls dies auf eine nicht-leere Zeichenfolge gesetzt ist, dann verwendet LTeX nicht die eingebaute Version von LanguageTool. Stattdessen verbindet sich LTeX zu einem externen [LanguageTool-HTTP-Server](http://wiki.languagetool.org/http-server). Setzen Sie diese Einstellung auf die Haupt-URI des Servers und hängen Sie kein `v2/check` oder Ähnliches an.

Beachten Sie, dass in diesem Modus die Einstellungen [`ltex.dictionary`](settings-de.html#ltexdictionary), [`ltex.additionalRules.languageModel`](settings-de.html#ltexadditionalruleslanguagemodel), [`ltex.additionalRules.neuralNetworkModel`](settings-de.html#ltexadditionalrulesneuralnetworkmodel) und [`ltex.additionalRules.word2VecModel`](settings-de.html#ltexadditionalrulesword2vecmodel) ignoriert werden und dass die schnelle Problembehebung `Zum Wörterbuch hinzufügen` nicht erscheint.

*Typ:* `string`

*Beispiel:* `"http://localhost:8081/"`

*Voreinstellung:* `""`

## `ltex.ltex-ls.logLevel`

Protokollierungslevel (Ausführlichkeit) des Server-Protokolls von ltex-ls, das unter `Anzeigen` › `Ausgabe` › `LTeX Language Server` verfügbar ist.

Die Levels sind in absteigender Reihenfolge `"severe"`, `"warning"`, `"info"`, `"config"`, `"fine"`, `"finer"`, und `"finest"`. Alle Meldungen, die den angegebene Level oder einen höheren Level haben, werden protokolliert.

ltex-ls benutzt nicht alle Protokollierungslevel.

*Typ:* `string`

*Mögliche Werte:*

- `"severe"`: Minimale Ausführlichkeit. Protokolliere ausschließlich schwere Fehler.
- `"warning"`: Sehr niedrige Ausführlichkeit. Protokolliere ausschließlich schwere Fehler und Warnungen.
- `"info"`: Niedrige Ausführlichkeit. Protokolliere zusätzlich Start- und Beendingungsmeldungen.
- `"config"`: Mittlere Ausführlichkeit. Protokolliere zusätzlich Konfigurationsmeldungen.
- `"fine"`: Mittlere bis hohe Ausführlichkeit (Standard). Protokolliere zusätzlich, wenn LanguageTool aufgerufen wird oder wenn LanguageTool aufgrund geänderter Einstellungen neu initialisiert werden muss.
- `"finer"`: Hohe Ausführlichkeit.Protokolliere zusätzliche Debugging-Informationen wie ganze Texte, die überprüft werden.
- `"finest"`: Maximale Ausführlichkeit. Protokolliere alle verfügbaren Debugging-Informationen.

*Voreinstellung:* `"fine"`

## `ltex.java.path`

Falls dies auf eine leere Zeichenfolge gesetzt ist und LTeX auf Ihrem Rechner kein Java finden kann, dann lädt LTeX automatisch eine Java-Distribution herunter ([AdoptOpenJDK](https://adoptopenjdk.net/)), speichert sie im Erweiterungsordner und benutzt sie, um ltex-ls zu starten. Sie können diese Einstellung auf den Ort einer bereits bestehenden Java-Installation setzen, um stattdessen diese Java-Installation zu benutzen.

Benutzen Sie denselben Pfad, den Sie für die Umgebungsvariable `JAVA_HOME` benutzen würden (dieser enthält üblicherweise neben anderen die Unterverzeichnisse `bin` und `lib`).

Nach Änderungen muss das Fenster von Visual Studio Code erneut geladen werden.

*Typ:* `string`

*Voreinstellung:* `""`

## `ltex.java.forceTrySystemWide`

Falls dies auf `true` gesetzt ist, dann versucht LTeX immer zunächst eine systemweite Java-Installation zu benutzen, bevor LTeX versucht, eine automatisch heruntergeladene Java-Distribution zu benutzen.

Dies ist das Standardverhalten auf allen Plattformen außer Mac (d. h., diese Einstellung hat keine Auswirkung auf diesen Plattformen). Auf Mac-Systemen kann der Versuch, eine systemweite Java-Installation zu benutzen, obwohl Java nicht installiert ist, ein Popup-Dialog verursachen, der dazu auffordert, Java zu installieren. Daher benutzt LTeX standardmäßig keine systemweite Java-Installation auf Mac-Systemen.

Nach Änderungen muss das Fenster von Visual Studio Code erneut geladen werden.

*Typ:* `boolean`

*Voreinstellung:* `false`

## `ltex.java.initialHeapSize`

Anfängliche Größe des Java-Heap-Speichers in Megabytes (korrespondiert zur Java-Option `-Xms`, muss eine positive Ganzzahl sein).

Eine Verkleinerung kann dazu führen, dass der Java-Prozess weniger RAM-Speicher benötigt.

Nach Änderungen muss das Fenster von Visual Studio Code erneut geladen werden.

*Typ:* `integer`

*Voreinstellung:* `64`

## `ltex.java.maximumHeapSize`

Maximale Größe des Java-Heap-Speichers in Megabytes (korrespondiert zur Java-Option `-Xmx`, muss eine positive Ganzzahl sein).

Eine Verkleinerung kann dazu führen, dass der Java-Prozess weniger RAM-Speicher benötigt. Wenn Sie diese Einstellung zu klein setzen, kann dies dazu führen, dass der Java-Prozess die Heap-Größe überschreitet, sodass der Fehler `OutOfMemoryError` angezeigt wird.

Nach Änderungen muss das Fenster von Visual Studio Code erneut geladen werden.

*Typ:* `integer`

*Voreinstellung:* `512`

## `ltex.sentenceCacheSize`

Größe des LanguageTool-Zwischenspeichers `ResultCache` in Sätzen (muss eine positive Ganzzahl sein).

Falls nur ein kleiner Teil des Textes geändert wird (z. B. ein einziger Tastendruck im Editor), dann benutzt LanguageTool den Zwischenspeicher, um zu vermeiden, dass der komplette Text nochmals überprüft werden muss. LanguageTool teilt den Text intern in Sätze auf; Sätze, die bereits überprüft worden sind, werden übersprungen.

Eine Verkleinerung kann dazu führen, dass der Java-Prozess weniger RAM-Speicher benötigt. Wenn Sie diese Einstellung auf einen zu kleinen Wert sätzen, dann kann sich die Zeit, die LanguageTool zur Überprüfung benötigt, deutlich erhöhen.

Nach Änderungen muss das Fenster von Visual Studio Code erneut geladen werden.

*Typ:* `integer`

*Voreinstellung:* `2000`

## `ltex.diagnosticSeverity`

Schwere, mit der Schreibfehler angezeigt werden.

Erlaubt die Steuerung, wie und wo die Fehler in Visual Studio Code erscheinen. Eines von `"error"`, `"warning"`, `"information"` und `"hint"`.

*Typ:* `string`

*Mögliche Werte:*

- `"error"`: Fehler mit der Schwere `error` sind üblicherweise mit einer roten geschlängelten Linie unterstrichen und erscheinen im Editor, in der Minimap, im Probleme-Reiter und im Explorer.
- `"warning"`: Fehler mit der Schwere `warning` sind üblicherweise mit einer gelben geschlängelten Linie unterstrichen und erscheinen im Editor, in der Minimap, im Probleme-Reiter und im Explorer.
- `"information"`: Fehler mit der Schwere `information` sind üblicherweise mit einer blauen geschlängelten Linie unterstrichen und erscheinen im Editor, in der Minimap und im Probleme-Reiter, aber nicht im Explorer.
- `"hint"`: Fehler mit der Schwere `hint` sind nicht unterstrichen (nur unauffällig markiert) und erscheinen nur im Editor, aber nicht in der Minimap, im Probleme-Reiter oder im Explorer.

*Voreinstellung:* `"information"`

## `ltex.checkFrequency`

Steuert, wann Dokumente überprüft werden sollen. Eines von `"edit"`, `"save"` und `"manual"`.

*Typ:* `string`

*Mögliche Werte:*

- `"edit"`: Dokumente werden überprüft, wenn sie geöffnet oder bearbeitet werden (bei jedem Tastendruck), oder wenn sich die Einstellungen ändern.
- `"save"`: Dokumente werden überprüft, wenn sie geöffnet oder gespeichert werden, oder wenn sich die Einstellungen ändern.
- `"manual"`: Dokumente werden nicht automatisch überprüft, außer wenn sich die Einstellungen ändern. Verwenden Sie Befehle wie [`LTeX: Aktuelles Dokument prüfen`](commands-de.html#ltex-aktuelles-dokument-prfen), um manuell Überprüfungen zu veranlassen.

*Voreinstellung:* `"edit"`

## `ltex.clearDiagnosticsWhenClosingFile`

Falls dies auf `true` gesetzt ist, dann werden von LTeX gemeldete Schreibfehler einer Datei gelöscht, wenn die Datei geschlossen wird.

*Typ:* `boolean`

*Voreinstellung:* `true`

## `ltex.statusBarItem`

Falls dies auf `true` gesetzt ist, dann wird ein Eintrag über den Status von LTeX ständig in der Statusleiste angezeigt.

*Typ:* `boolean`

*Voreinstellung:* `false`

## `ltex.trace.server`

Debugging-Einstellung, um die Kommunikation zwischen Language Client und Language Server zu protokollieren.

Wenn Sie einen Bug melden, setzen Sie diese Einstellung auf `"verbose"` und öffnen Sie das Protokoll `LTeX Language Client` unter `Anzeigen` › `Ausgabe`. Hängen Sie den relevanten Teil an das GitHub-Problem an.

Nach Änderungen muss das Fenster von Visual Studio Code erneut geladen werden.

*Typ:* `string`

*Mögliche Werte:*

- `"off"`: Protokolliere keinerlei Kommunikation zwischen Language Client und Language Server.
- `"messages"`: Protokolliere den Typ von Anfragen und Antworten zwischen Language Client und Language Server.
- `"verbose"`: Protokolliere den Typ und den Inhalt von Anfragen und Antworten zwischen Language Client und Language Server.

*Voreinstellung:* `"off"`
