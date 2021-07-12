---
# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

title: "Settings"
permalink: "/docs/settings.html"
sidebar: "sidebar"
---

Change language of this page: [English](settings.html), [German](settings-de.html)

## `ltex.enabled`

Controls whether the extension is enabled. Allows disabling LanguageTool on specific workspaces or for specific code language modes (i.e., file types).

Either supply a Boolean value stating whether LTeX is enabled for all supported code language modes or disabled for all of them, or supply a list of [code language identifiers](https://code.visualstudio.com/docs/languages/identifiers) for which LTeX should be enabled (note that extensions can define additional code language identifiers).

All supported code language modes are listed in the default value of this setting. If you add an unsupported code language mode (i.e., a code language mode that is not listed in the default value), LTeX will check corresponding files as plain text without any parsing.

<!-- ltex-client-specific-begin -->

The activation events are unaffected by this setting. This means that the extension will be activated whenever a file with a supported code language mode is opened. For unsupported code language modes, you may need to activate the extension explicitly by executing the [`LTeX: Activate Extension`](commands.html#ltex-activate-extension) command.

Changes require reloading the Visual Studio Code window to take effect.

<!-- ltex-client-specific-end -->

*Type:* `boolean` or `array`

*Default:* `["bibtex", "html", "latex", "markdown", "org", "restructuredtext", "rsweave"]`

*Full type description:* <button class='expandable-button btn btn-default'>Click to show/hide</button>

<div markdown='1' style='display:none;'>

One of the following types:

- Scalar of type `boolean`
- Array where each entry has the following type:

  - Scalar of type `string`

</div>

## `ltex.language`

The language (e.g., `"en-US"`) LanguageTool should check against. Use a specific variant like `"en-US"` or `"de-DE"` instead of the generic language code like `"en"` or `"de"` to obtain spelling corrections (in addition to grammar corrections).

*Type:* `string`

*Possible values:*

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

*Default:* `"en-US"`

## `ltex.dictionary`

Lists of additional words that should not be counted as spelling errors.

This setting is language-specific, so use an object of the format `{"<LANGUAGE1>": ["<WORD1>", "<WORD2>", ...], "<LANGUAGE2>": ["<WORD1>", "<WORD2>", ...], ...}`, where `<LANGUAGE>` denotes the language code in [`ltex.language`](settings.html#ltexlanguage).

<!-- ltex-client-specific-begin -->

This setting is a multi-scope setting. [See the documentation for details.](advanced-usage.html#multi-scope-settings)

This setting supports external files. [See the documentation for details.](advanced-usage.html#external-setting-files)

<!-- ltex-client-specific-end -->

By default, no additional spelling errors will be ignored.

*Type:* `object`

*Example:* `{"en-US": ["adaptivity", "precomputed", "subproblem"], "de-DE": ["B-Splines", ":/path/to/externalFile.txt"]}`

*Default:* `{}`

*Full type description:* <button class='expandable-button btn btn-default'>Click to show/hide</button>

<div markdown='1' style='display:none;'>

Object with the following properties:

- `"ar"`: List of additional `ar` (Arabic) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ast-ES"`: List of additional `ast-ES` (Asturian) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"be-BY"`: List of additional `be-BY` (Belarusian) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"br-FR"`: List of additional `br-FR` (Breton) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ca-ES"`: List of additional `ca-ES` (Catalan) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ca-ES-valencia"`: List of additional `ca-ES-valencia` (Catalan (Valencian)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"da-DK"`: List of additional `da-DK` (Danish) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de"`: List of additional `de` (German) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-AT"`: List of additional `de-AT` (German (Austria)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-CH"`: List of additional `de-CH` (German (Swiss)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-DE"`: List of additional `de-DE` (German (Germany)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-DE-x-simple-language"`: List of additional `de-DE-x-simple-language` (Simple German) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"el-GR"`: List of additional `el-GR` (Greek) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en"`: List of additional `en` (English) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-AU"`: List of additional `en-AU` (English (Australian)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-CA"`: List of additional `en-CA` (English (Canadian)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-GB"`: List of additional `en-GB` (English (GB)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-NZ"`: List of additional `en-NZ` (English (New Zealand)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-US"`: List of additional `en-US` (English (US)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-ZA"`: List of additional `en-ZA` (English (South African)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"eo"`: List of additional `eo` (Esperanto) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"es"`: List of additional `es` (Spanish) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"fa"`: List of additional `fa` (Persian) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"fr"`: List of additional `fr` (French) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ga-IE"`: List of additional `ga-IE` (Irish) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"gl-ES"`: List of additional `gl-ES` (Galician) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"it"`: List of additional `it` (Italian) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ja-JP"`: List of additional `ja-JP` (Japanese) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"km-KH"`: List of additional `km-KH` (Khmer) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"nl"`: List of additional `nl` (Dutch) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"nl-BE"`: List of additional `nl-BE` (Dutch (Belgium)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pl-PL"`: List of additional `pl-PL` (Polish) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt"`: List of additional `pt` (Portuguese) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-AO"`: List of additional `pt-AO` (Portuguese (Angola preAO)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-BR"`: List of additional `pt-BR` (Portuguese (Brazil)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-MZ"`: List of additional `pt-MZ` (Portuguese (Moçambique preAO)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-PT"`: List of additional `pt-PT` (Portuguese (Portugal)) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ro-RO"`: List of additional `ro-RO` (Romanian) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ru-RU"`: List of additional `ru-RU` (Russian) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"sk-SK"`: List of additional `sk-SK` (Slovak) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"sl-SI"`: List of additional `sl-SI` (Slovenian) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"sv"`: List of additional `sv` (Swedish) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ta-IN"`: List of additional `ta-IN` (Tamil) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"tl-PH"`: List of additional `tl-PH` (Tagalog) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"uk-UA"`: List of additional `uk-UA` (Ukrainian) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"zh-CN"`: List of additional `zh-CN` (Chinese) words that should not be counted as spelling errors.

  Array where each entry has the following type:

  - Scalar of type `string`

</div>

## `ltex.disabledRules`

Lists of rules that should be disabled (if enabled by default by LanguageTool).

This setting is language-specific, so use an object of the format `{"<LANGUAGE1>": ["<RULE1>", "<RULE2>", ...], "<LANGUAGE2>": ["<RULE1>", "<RULE2>", ...], ...}`, where `<LANGUAGE>` denotes the language code in [`ltex.language`](settings.html#ltexlanguage) and `<RULE>` the ID of the LanguageTool rule.

<!-- ltex-client-specific-begin -->

This setting is a multi-scope setting. [See the documentation for details.](advanced-usage.html#multi-scope-settings)

This setting supports external files. [See the documentation for details.](advanced-usage.html#external-setting-files)

<!-- ltex-client-specific-end -->

By default, no additional rules will be disabled.

*Type:* `object`

*Example:* `{"en-US": ["EN_QUOTES", "UPPERCASE_SENTENCE_START", ":/path/to/externalFile.txt"]}`

*Default:* `{}`

*Full type description:* <button class='expandable-button btn btn-default'>Click to show/hide</button>

<div markdown='1' style='display:none;'>

Object with the following properties:

- `"ar"`: List of additional `ar` (Arabic) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ast-ES"`: List of additional `ast-ES` (Asturian) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"be-BY"`: List of additional `be-BY` (Belarusian) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"br-FR"`: List of additional `br-FR` (Breton) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ca-ES"`: List of additional `ca-ES` (Catalan) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ca-ES-valencia"`: List of additional `ca-ES-valencia` (Catalan (Valencian)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"da-DK"`: List of additional `da-DK` (Danish) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de"`: List of additional `de` (German) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-AT"`: List of additional `de-AT` (German (Austria)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-CH"`: List of additional `de-CH` (German (Swiss)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-DE"`: List of additional `de-DE` (German (Germany)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-DE-x-simple-language"`: List of additional `de-DE-x-simple-language` (Simple German) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"el-GR"`: List of additional `el-GR` (Greek) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en"`: List of additional `en` (English) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-AU"`: List of additional `en-AU` (English (Australian)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-CA"`: List of additional `en-CA` (English (Canadian)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-GB"`: List of additional `en-GB` (English (GB)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-NZ"`: List of additional `en-NZ` (English (New Zealand)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-US"`: List of additional `en-US` (English (US)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-ZA"`: List of additional `en-ZA` (English (South African)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"eo"`: List of additional `eo` (Esperanto) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"es"`: List of additional `es` (Spanish) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"fa"`: List of additional `fa` (Persian) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"fr"`: List of additional `fr` (French) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ga-IE"`: List of additional `ga-IE` (Irish) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"gl-ES"`: List of additional `gl-ES` (Galician) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"it"`: List of additional `it` (Italian) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ja-JP"`: List of additional `ja-JP` (Japanese) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"km-KH"`: List of additional `km-KH` (Khmer) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"nl"`: List of additional `nl` (Dutch) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"nl-BE"`: List of additional `nl-BE` (Dutch (Belgium)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pl-PL"`: List of additional `pl-PL` (Polish) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt"`: List of additional `pt` (Portuguese) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-AO"`: List of additional `pt-AO` (Portuguese (Angola preAO)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-BR"`: List of additional `pt-BR` (Portuguese (Brazil)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-MZ"`: List of additional `pt-MZ` (Portuguese (Moçambique preAO)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-PT"`: List of additional `pt-PT` (Portuguese (Portugal)) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ro-RO"`: List of additional `ro-RO` (Romanian) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ru-RU"`: List of additional `ru-RU` (Russian) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"sk-SK"`: List of additional `sk-SK` (Slovak) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"sl-SI"`: List of additional `sl-SI` (Slovenian) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"sv"`: List of additional `sv` (Swedish) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ta-IN"`: List of additional `ta-IN` (Tamil) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"tl-PH"`: List of additional `tl-PH` (Tagalog) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"uk-UA"`: List of additional `uk-UA` (Ukrainian) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"zh-CN"`: List of additional `zh-CN` (Chinese) rules that should be disabled (if enabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`

</div>

## `ltex.enabledRules`

Lists of rules that should be enabled (if disabled by default by LanguageTool).

This setting is language-specific, so use an object of the format `{"<LANGUAGE1>": ["<RULE1>", "<RULE2>", ...], "<LANGUAGE2>": ["<RULE1>", "<RULE2>", ...], ...}`, where `<LANGUAGE>` denotes the language code in [`ltex.language`](settings.html#ltexlanguage) and `<RULE>` the ID of the LanguageTool rule.

<!-- ltex-client-specific-begin -->

This setting is a multi-scope setting. [See the documentation for details.](advanced-usage.html#multi-scope-settings)

This setting supports external files. [See the documentation for details.](advanced-usage.html#external-setting-files)

<!-- ltex-client-specific-end -->

By default, no additional rules will be enabled.

*Type:* `object`

*Example:* `{"en-GB": ["PASSIVE_VOICE", "OXFORD_SPELLING_NOUNS", ":/path/to/externalFile.txt"]}`

*Default:* `{}`

*Full type description:* <button class='expandable-button btn btn-default'>Click to show/hide</button>

<div markdown='1' style='display:none;'>

Object with the following properties:

- `"ar"`: List of additional `ar` (Arabic) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ast-ES"`: List of additional `ast-ES` (Asturian) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"be-BY"`: List of additional `be-BY` (Belarusian) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"br-FR"`: List of additional `br-FR` (Breton) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ca-ES"`: List of additional `ca-ES` (Catalan) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ca-ES-valencia"`: List of additional `ca-ES-valencia` (Catalan (Valencian)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"da-DK"`: List of additional `da-DK` (Danish) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de"`: List of additional `de` (German) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-AT"`: List of additional `de-AT` (German (Austria)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-CH"`: List of additional `de-CH` (German (Swiss)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-DE"`: List of additional `de-DE` (German (Germany)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-DE-x-simple-language"`: List of additional `de-DE-x-simple-language` (Simple German) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"el-GR"`: List of additional `el-GR` (Greek) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en"`: List of additional `en` (English) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-AU"`: List of additional `en-AU` (English (Australian)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-CA"`: List of additional `en-CA` (English (Canadian)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-GB"`: List of additional `en-GB` (English (GB)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-NZ"`: List of additional `en-NZ` (English (New Zealand)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-US"`: List of additional `en-US` (English (US)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-ZA"`: List of additional `en-ZA` (English (South African)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"eo"`: List of additional `eo` (Esperanto) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"es"`: List of additional `es` (Spanish) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"fa"`: List of additional `fa` (Persian) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"fr"`: List of additional `fr` (French) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ga-IE"`: List of additional `ga-IE` (Irish) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"gl-ES"`: List of additional `gl-ES` (Galician) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"it"`: List of additional `it` (Italian) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ja-JP"`: List of additional `ja-JP` (Japanese) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"km-KH"`: List of additional `km-KH` (Khmer) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"nl"`: List of additional `nl` (Dutch) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"nl-BE"`: List of additional `nl-BE` (Dutch (Belgium)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pl-PL"`: List of additional `pl-PL` (Polish) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt"`: List of additional `pt` (Portuguese) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-AO"`: List of additional `pt-AO` (Portuguese (Angola preAO)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-BR"`: List of additional `pt-BR` (Portuguese (Brazil)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-MZ"`: List of additional `pt-MZ` (Portuguese (Moçambique preAO)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-PT"`: List of additional `pt-PT` (Portuguese (Portugal)) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ro-RO"`: List of additional `ro-RO` (Romanian) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ru-RU"`: List of additional `ru-RU` (Russian) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"sk-SK"`: List of additional `sk-SK` (Slovak) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"sl-SI"`: List of additional `sl-SI` (Slovenian) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"sv"`: List of additional `sv` (Swedish) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ta-IN"`: List of additional `ta-IN` (Tamil) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"tl-PH"`: List of additional `tl-PH` (Tagalog) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"uk-UA"`: List of additional `uk-UA` (Ukrainian) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`
- `"zh-CN"`: List of additional `zh-CN` (Chinese) rules that should be enabled (if disabled by default by LanguageTool).

  Array where each entry has the following type:

  - Scalar of type `string`

</div>

## `ltex.hiddenFalsePositives`

Lists of false-positive diagnostics to hide (by hiding all diagnostics of a specific rule will in a specific sentence).

This setting is language-specific, so use an object of the format `{"<LANGUAGE1>": ["<JSON1>", "<JSON2>", ...], "<LANGUAGE2>": ["<JSON1>", "<JSON2>", ...], ...}`, where `<LANGUAGE>` denotes the language code in [`ltex.language`](settings.html#ltexlanguage) and `<JSON>` is a JSON string containing information about the rule and sentence.

Although it is possible to manually edit this setting, the intended way is the `Hide false positive` quick fix.

The JSON string currently has the form `{"rule": "<RULE>", "sentence": "<SENTENCE>"}`, where `<RULE>` is the identifier of the LanguageTool rule and `<SENTENCE>` is a Java-compatible regular expression. All occurrences of the given rule are hidden in sentences (as determined by the LanguageTool tokenizer) that match the regular expression. [See the documentation for details.](advanced-usage.html#hiding-false-positives-with-regular-expressions)

<!-- ltex-client-specific-begin -->

This setting is a multi-scope setting. [See the documentation for details.](advanced-usage.html#multi-scope-settings)

This setting supports external files. [See the documentation for details.](advanced-usage.html#external-setting-files)

<!-- ltex-client-specific-end -->

If this list is very large, performance may suffer.

*Type:* `object`

*Example:* `{"en-US": [":/path/to/externalFile.txt"]}`

*Default:* `{}`

*Full type description:* <button class='expandable-button btn btn-default'>Click to show/hide</button>

<div markdown='1' style='display:none;'>

Object with the following properties:

- `"ar"`: List of `ar` (Arabic) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ast-ES"`: List of `ast-ES` (Asturian) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"be-BY"`: List of `be-BY` (Belarusian) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"br-FR"`: List of `br-FR` (Breton) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ca-ES"`: List of `ca-ES` (Catalan) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ca-ES-valencia"`: List of `ca-ES-valencia` (Catalan (Valencian)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"da-DK"`: List of `da-DK` (Danish) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de"`: List of `de` (German) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-AT"`: List of `de-AT` (German (Austria)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-CH"`: List of `de-CH` (German (Swiss)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-DE"`: List of `de-DE` (German (Germany)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"de-DE-x-simple-language"`: List of `de-DE-x-simple-language` (Simple German) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"el-GR"`: List of `el-GR` (Greek) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en"`: List of `en` (English) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-AU"`: List of `en-AU` (English (Australian)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-CA"`: List of `en-CA` (English (Canadian)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-GB"`: List of `en-GB` (English (GB)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-NZ"`: List of `en-NZ` (English (New Zealand)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-US"`: List of `en-US` (English (US)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"en-ZA"`: List of `en-ZA` (English (South African)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"eo"`: List of `eo` (Esperanto) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"es"`: List of `es` (Spanish) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"fa"`: List of `fa` (Persian) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"fr"`: List of `fr` (French) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ga-IE"`: List of `ga-IE` (Irish) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"gl-ES"`: List of `gl-ES` (Galician) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"it"`: List of `it` (Italian) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ja-JP"`: List of `ja-JP` (Japanese) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"km-KH"`: List of `km-KH` (Khmer) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"nl"`: List of `nl` (Dutch) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"nl-BE"`: List of `nl-BE` (Dutch (Belgium)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pl-PL"`: List of `pl-PL` (Polish) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt"`: List of `pt` (Portuguese) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-AO"`: List of `pt-AO` (Portuguese (Angola preAO)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-BR"`: List of `pt-BR` (Portuguese (Brazil)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-MZ"`: List of `pt-MZ` (Portuguese (Moçambique preAO)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"pt-PT"`: List of `pt-PT` (Portuguese (Portugal)) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ro-RO"`: List of `ro-RO` (Romanian) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ru-RU"`: List of `ru-RU` (Russian) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"sk-SK"`: List of `sk-SK` (Slovak) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"sl-SI"`: List of `sl-SI` (Slovenian) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"sv"`: List of `sv` (Swedish) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"ta-IN"`: List of `ta-IN` (Tamil) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"tl-PH"`: List of `tl-PH` (Tagalog) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"uk-UA"`: List of `uk-UA` (Ukrainian) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`
- `"zh-CN"`: List of `zh-CN` (Chinese) false-positive diagnostics to hide.

  Array where each entry has the following type:

  - Scalar of type `string`

</div>

## `ltex.bibtex.fields`

List of BibTeX fields whose values are to be checked in BibTeX files.

This setting is an object with the field names as keys (not restricted to classical BibTeX fields) and Booleans as values, where `true` means that the field value should be checked and `false` means that the field value should be ignored.

Some common fields are already ignored, even if you set this setting to an empty object.

*Type:* `object`

*Example:* `{"maintitle": false, "seealso": true}`

*Default:* `{}`

*Full type description:* <button class='expandable-button btn btn-default'>Click to show/hide</button>

<div markdown='1' style='display:none;'>

Object with arbitrary property names, where the value of each property has the following type:

- Scalar of type `boolean`

</div>

## `ltex.latex.commands`

List of LaTeX commands to be handled by the LaTeX parser, listed together with empty arguments (e.g., `"\ref{}"`, `"\documentclass[]{}"`).

This setting is an object with the commands as keys and corresponding actions as values.

<!-- ltex-client-specific-begin -->

If you edit the `settings.json` file directly, don't forget to escape the initial backslash by replacing it with two backslashes. If you use the VS Code Settings panel, only type one backslash.

<!-- ltex-client-specific-end -->

Many common commands are already handled by default, even if you set this setting to an empty object.

*Type:* `object`

*Example:* `{"\\ref{}": "ignore", "\\documentclass[]{}": "ignore", "\\cite{}": "dummy", "\\cite[]{}": "dummy"}`

*Default:* `{}`

*Full type description:* <button class='expandable-button btn btn-default'>Click to show/hide</button>

<div markdown='1' style='display:none;'>

Object with arbitrary property names, where the value of each property has the following type:

- One of the following values:

  - `"default"`: The command is treated like unknown commands are treated by default: The command name itself is ignored, but the arguments are not ignored.
  - `"ignore"`: The whole command together with its arguments is ignored.
  - `"dummy"`: The whole command together with its arguments is replaced with a dummy word (i.e., `Dummy0`, `Dummy1`, etc.). LTeX internally uses this mechanism for equations, citations, references, and similar constructs that are part of the sentence structure and for which LanguageTool would throw an error if simply omitted from the checked text.
  - `"pluralDummy"`: The whole command together with its arguments is replaced with a plural dummy word (i.e., `Dummies`). LTeX internally uses this mechanism for equations, citations, references, and similar constructs that are part of the sentence structure and for which LanguageTool would throw an error if simply omitted from the checked text.

</div>

## `ltex.latex.environments`

List of names of LaTeX environments to be handled by the LaTeX parser.

This setting is an object with the environment names as keys and corresponding actions as values.

Some environments are already handled by default, even if you set this setting to an empty object.

*Type:* `object`

*Example:* `{"lstlisting": "ignore", "verbatim": "ignore"}`

*Default:* `{}`

*Full type description:* <button class='expandable-button btn btn-default'>Click to show/hide</button>

<div markdown='1' style='display:none;'>

Object with arbitrary property names, where the value of each property has the following type:

- One of the following values:

  - `"default"`: The environment is treated like unknown environments are treated by default: The arguments of the environment are ignored, but the contents of the environment are not ignored.
  - `"ignore"`: The whole environment together with its arguments and contents is ignored.

</div>

## `ltex.markdown.nodes`

List of Markdown node types to be handled by the Markdown parser.

This setting is an object with the node types as keys and corresponding actions as values.

The Markdown parser constructs an AST (abstract syntax tree) for the Markdown document, in which all leaves have node type `Text`. The possible node types are listed in the [documentation of flexmark-java](https://javadoc.io/static/com.vladsch.flexmark/flexmark/0.62.2/com/vladsch/flexmark/ast/package-summary.html).

Some common node types are already handled by default, even if you set this setting to an empty object.

*Type:* `object`

*Example:* `{"CodeBlock": "ignore", "FencedCodeBlock": "ignore", "AutoLink": "dummy", "Code": "dummy"}`

*Default:* `{}`

*Full type description:* <button class='expandable-button btn btn-default'>Click to show/hide</button>

<div markdown='1' style='display:none;'>

Object with arbitrary property names, where the value of each property has the following type:

- One of the following values:

  - `"default"`: The node is not treated specially.
  - `"ignore"`: The whole node together with its `Text` leaves is ignored.
  - `"dummy"`: The whole node together with its `Text` leaves is replaced with a dummy word (i.e., `Dummy0`, `Dummy1`, etc.). LTeX internally uses this mechanism for example for inline code (inside backticks) that is part of the sentence structure and for which LanguageTool would throw an error if simply omitted from the checked text.
  - `"pluralDummy"`: The whole node together with its `Text` leaves is replaced with a plural dummy word (i.e., `Dummies`). LTeX internally uses this mechanism for example for inline code (inside backticks) that is part of the sentence structure and for which LanguageTool would throw an error if simply omitted from the checked text.

</div>

## `ltex.configurationTarget`

<!-- ltex-client-specific-begin -->

Controls which `settings.json` or external setting file ([see documentation](advanced-usage.html#external-setting-files)) to update when using one of the quick fixes.

<!-- ltex-client-specific-end -->

*Type:* `object`

*Default:* `{"dictionary": "workspaceFolderExternalFile", "disabledRules": "workspaceFolderExternalFile", "hiddenFalsePositives": "workspaceFolderExternalFile"}`

*Full type description:* <button class='expandable-button btn btn-default'>Click to show/hide</button>

<div markdown='1' style='display:none;'>

Object with the following properties:

- `"dictionary"`: One of the following values:

  - `"user"`: When adding a word to the dictionary, always update the user configuration.
  - `"workspace"`: When adding a word to the dictionary, update the workspace configuration if currently in a workspace, otherwise update the user configuration.
  - `"workspaceFolder"`: When adding a word to the dictionary, update the workspace folder configuration if currently in a workspace folder, otherwise update the workspace configuration if currently in a workspace, otherwise update the user configuration.
  - `"userExternalFile"`: When adding a word to the dictionary, always update the first external setting file listed in the user configuration.
  - `"workspaceExternalFile"`: When adding a word to the dictionary, update the first external setting file listed in the workspace configuration if currently in a workspace, otherwise update the analogous file in the user configuration.
  - `"workspaceFolderExternalFile"`: When adding a word to the dictionary, update the first external setting file listed in the workspace folder configuration if currently in a workspace folder, otherwise update the analogous file in the workspace configuration if currently in a workspace, otherwise update the analogous file in the user configuration.
- `"disabledRules"`: One of the following values:

  - `"user"`: When disabling a rule, always update the user configuration.
  - `"workspace"`: When disabling a rule, update the workspace configuration if currently in a workspace, otherwise update the user configuration.
  - `"workspaceFolder"`: When disabling a rule, update the workspace folder configuration if currently in a workspace folder, otherwise update the workspace configuration if currently in a workspace, otherwise update the user configuration.
  - `"userExternalFile"`: When disabling a rule, always update the first external setting file listed in the user configuration.
  - `"workspaceExternalFile"`: When disabling a rule, update the first external setting file listed in the workspace configuration if currently in a workspace, otherwise update the analogous file in the user configuration.
  - `"workspaceFolderExternalFile"`: When disabling a rule, update the first external setting file listed in the workspace folder configuration if currently in a workspace folder, otherwise update the analogous file in the workspace configuration if currently in a workspace, otherwise update the analogous file in the user configuration.
- `"hiddenFalsePositives"`: One of the following values:

  - `"user"`: When hiding a false positive, always update the user configuration.
  - `"workspace"`: When hiding a false positive, update the workspace configuration if currently in a workspace, otherwise update the user configuration.
  - `"workspaceFolder"`: When hiding a false positive, update the workspace folder configuration if currently in a workspace folder, otherwise update the workspace configuration if currently in a workspace, otherwise update the user configuration.
  - `"userExternalFile"`: When hiding a false positive, always update the first external setting file listed in the user configuration.
  - `"workspaceExternalFile"`: When hiding a false positive, update the first external setting file listed in the workspace configuration if currently in a workspace, otherwise update the analogous file in the user configuration.
  - `"workspaceFolderExternalFile"`: When hiding a false positive, update the first external setting file listed in the workspace folder configuration if currently in a workspace folder, otherwise update the analogous file in the workspace configuration if currently in a workspace, otherwise update the analogous file in the user configuration.

</div>

## `ltex.additionalRules.enablePickyRules`

Enable LanguageTool rules that are marked as picky and that are disabled by default, e.g., rules about passive voice, sentence length, etc.

*Type:* `boolean`

*Default:* `false`

## `ltex.additionalRules.motherTongue`

Optional mother tongue of the user (e.g., `"de-DE"`).

If set, additional rules will be checked to detect false friends. Picky rules may need to be enabled in order to see an effect (see [`ltex.additionalRules.enablePickyRules`](settings.html#ltexadditionalrulesenablepickyrules)). False friend detection improves if a language model is supplied (see [`ltex.additionalRules.languageModel`](settings.html#ltexadditionalruleslanguagemodel)).

*Type:* `string`

*Possible values:*

- `""`: No mother tongue
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

*Default:* `""`

## `ltex.additionalRules.languageModel`

Optional path to a directory with rules of a language model with *n*-gram occurrence counts.

*Type:* `string`

*Default:* `""`

## `ltex.additionalRules.neuralNetworkModel`

Optional path to a directory with rules of a pretrained neural network model.

*Type:* `string`

*Default:* `""`

## `ltex.additionalRules.word2VecModel`

Optional path to a directory with rules of a word2vec language model.

*Type:* `string`

*Default:* `""`

## `ltex.ltex-ls.path`

<!-- ltex-client-specific-begin -->

If set to an empty string, LTeX automatically downloads [ltex-ls from GitHub](https://github.com/valentjn/ltex-ls/releases), stores it in the folder of the extension, and uses it for the checking process. You can point this setting to an ltex-ls release you downloaded by yourself.

Use the path to the root directory of ltex-ls (it contains `bin` and `lib` subdirectories).

Changes require reloading the Visual Studio Code window to take effect.

<!-- ltex-client-specific-end -->

*Type:* `string`

*Default:* `""`

## `ltex.ltex-ls.languageToolHttpServerUri`

If set to a non-empty string, LTeX will not use the bundled, built-in version of LanguageTool. Instead, LTeX will connect to an external [LanguageTool HTTP server](http://wiki.languagetool.org/http-server). Set this setting to the root URI of the server, and do not append `v2/check` or similar.

Note that in this mode, the settings [`ltex.dictionary`](settings.html#ltexdictionary), [`ltex.additionalRules.languageModel`](settings.html#ltexadditionalruleslanguagemodel), [`ltex.additionalRules.neuralNetworkModel`](settings.html#ltexadditionalrulesneuralnetworkmodel), and [`ltex.additionalRules.word2VecModel`](settings.html#ltexadditionalrulesword2vecmodel) will not take any effect, and the `Add to dictionary` quick fix will not appear.

*Type:* `string`

*Example:* `"http://localhost:8081/"`

*Default:* `""`

## `ltex.ltex-ls.logLevel`

Logging level (verbosity) of the ltex-ls server log, which is accessible via `View` › `Output` › `LTeX Language Server`.

The levels in descending order are `"severe"`, `"warning"`, `"info"`, `"config"`, `"fine"`, `"finer"`, and `"finest"`. All messages that have the specified log level or a higher level are logged.

ltex-ls does not use all log levels.

*Type:* `string`

*Possible values:*

- `"severe"`: Minimum verbosity. Only log severe errors.
- `"warning"`: Very low verbosity. Only log severe errors and warnings.
- `"info"`: Low verbosity. Additionally log startup and shutdown messages.
- `"config"`: Medium verbosity. Additionally log configuration messages.
- `"fine"`: Medium to high verbosity (default). Additionally log when LanguageTool is called or LanguageTool has to be reinitialized due to changed settings.
- `"finer"`: High verbosity. Log additional debugging information such as full texts to be checked.
- `"finest"`: Maximum verbosity. Log all available debugging information.

*Default:* `"fine"`

## `ltex.java.path`

<!-- ltex-client-specific-begin -->

If set to an empty string and LTeX could not find Java on your computer, LTeX automatically downloads a Java distribution ([AdoptOpenJDK](https://adoptopenjdk.net/)), stores it in the folder of the extension, and uses it to run ltex-ls. You can point this setting to an existing Java installation on your computer to use that installation instead.

Use the same path as you would use for the `JAVA_HOME` environment variable (it usually contains `bin` and `lib` subdirectories, amongst others).

Changes require reloading the Visual Studio Code window to take effect.

<!-- ltex-client-specific-end -->

*Type:* `string`

*Default:* `""`

## `ltex.java.forceTrySystemWide`

<!-- ltex-client-specific-begin -->

If set to `true`, always try to use a system-wide Java installation before trying to use an automatically downloaded Java distribution.

This is the default behavior on all platforms except Mac (i.e., this setting has no effect on these platforms). On Mac, trying to use a system-wide Java installation might result in a popup prompting to install Java if it's not installed. Therefore, LTeX does not use a system-wide Java installation on Mac by default.

Changes require reloading the Visual Studio Code window to take effect.

<!-- ltex-client-specific-end -->

*Type:* `boolean`

*Default:* `false`

## `ltex.java.initialHeapSize`

<!-- ltex-client-specific-begin -->

Initial size of the Java heap memory in megabytes (corresponds to Java's `-Xms` option, must be a positive integer).

Decreasing this might decrease RAM usage of the Java process.

Changes require reloading the Visual Studio Code window to take effect.

<!-- ltex-client-specific-end -->

*Type:* `integer`

*Default:* `64`

## `ltex.java.maximumHeapSize`

<!-- ltex-client-specific-begin -->

Maximum size of the Java heap memory in megabytes (corresponds to Java's `-Xmx` option, must be a positive integer).

Decreasing this might decrease RAM usage of the Java process. If you set this too small, the Java process may exceed the heap size, in which case an `OutOfMemoryError` is thrown.

Changes require reloading the Visual Studio Code window to take effect.

<!-- ltex-client-specific-end -->

*Type:* `integer`

*Default:* `512`

## `ltex.sentenceCacheSize`

Size of the LanguageTool `ResultCache` in sentences (must be a positive integer).

If only a small portion of the text changed (e.g., a single key press in the editor), LanguageTool uses the cache to avoid rechecking the complete text. LanguageTool internally splits the text into sentences, and sentences that have already been checked are skipped.

Decreasing this might decrease RAM usage of the Java process. If you set this too small, checking time may increase significantly.

Changes require reloading the Visual Studio Code window to take effect.

*Type:* `integer`

*Default:* `2000`

## `ltex.diagnosticSeverity`

Severity of the diagnostics corresponding to the grammar and spelling errors.

Allows to control how and where the diagnostics appear in Visual Studio Code. One of `"error"`, `"warning"`, `"information"`, and `"hint"`.

*Type:* `string`

*Possible values:*

- `"error"`: Error diagnostics are usually underlined with a red squiggly line and appear in editor, minimap, Problems tab, and Explorer.
- `"warning"`: Warning diagnostics are usually underlined with a yellow squiggly line and appear in editor, minimap, Problems tab, and Explorer.
- `"information"`: Information diagnostics are usually underlined with a blue squiggly line and appear in editor, minimap, and Problems tab, but not in the Explorer.
- `"hint"`: Hint diagnostics are not underlined (only subtly marked) and only appear in the editor, not in minimap, Problems tab, or Explorer.

*Default:* `"information"`

## `ltex.checkFrequency`

Controls when documents should be checked.

One of `"edit"`, `"save"`, and `"manual"`.

*Type:* `string`

*Possible values:*

- `"edit"`: Documents are checked when they are opened or edited (on every keystroke), or when the settings change.
- `"save"`: Documents are checked when they are opened or saved, or when the settings change.
- `"manual"`: Documents are not checked automatically, except when the settings change. Use commands such as [`LTeX: Check Current Document`](commands.html#ltex-check-current-document) to manually trigger checks.

*Default:* `"edit"`

## `ltex.clearDiagnosticsWhenClosingFile`

If set to `true`, diagnostics of a file are cleared when the file is closed.

*Type:* `boolean`

*Default:* `true`

## `ltex.statusBarItem`

<!-- ltex-client-specific-begin -->

If set to `true`, an item about the status of LTeX is shown permanently in the status bar.

<!-- ltex-client-specific-end -->

*Type:* `boolean`

*Default:* `false`

## `ltex.trace.server`

<!-- ltex-client-specific-begin -->

Debug setting to log the communication between language client and server.

When reporting issues, set this to `"verbose"` and open the `LTeX Language Client` log in `View` › `Output`. Append the relevant part to the GitHub issue.

Changes require reloading the Visual Studio Code window to take effect.

<!-- ltex-client-specific-end -->

*Type:* `string`

*Possible values:*

- `"off"`: Don't log any of the communication between language client and server.
- `"messages"`: Log the type of requests and responses between language client and server.
- `"verbose"`: Log the type and contents of requests and responses between language client and server.

*Default:* `"off"`
