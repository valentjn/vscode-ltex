#!/usr/bin/python3

# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import argparse
import functools
import json
import os
import re
import sys
from typing import Any, Callable, Dict, Optional, Sequence, Tuple

sys.path.append(os.path.dirname(__file__))
from linkSettingsAndCommands import linkSettingsAndCommands



licenseHeader = """
# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.
"""

i18nStrings = {
      "en" : {
        "arrayWhereEachEntryHasTheFollowingType" : "Array where each entry has the following type",
        "arrayWithTheFollowingEntries" : "Array with the following entries",
        "clickToShowHide" : "Click to show/hide",
        "commandIntroduction" : "This page is specific to vscode-ltex. It does not apply "
          "if you use a different LTeX plugin for an editor other than VS Code.\n\n"
          "To run a command, open the Command Palette (`Ctrl+Shift+P`) and "
          "start typing the name of the command.",
        "default" : "Default",
        "example" : "Example",
        "examples" : "Examples",
        "fullTypeDescription" : "Full type description",
        "objectWithArbitraryPropertyNames" : "Object with arbitrary property names, "
          "where the value of each property has the following type",
        "objectWithTheFollowingProperties" : "Object with the following properties",
        "oneOfTheFollowingTypes" : "One of the following types",
        "oneOfTheFollowingValues" : "One of the following values",
        "oneType" : "`{}`",
        "possibleValues" : "Possible values",
        "scalarOfType" : "Scalar of type {}",
        "threePlusTypesSuffix" : ", `{}`, or `{}`",
        "twoTypes" : "`{}` or `{}`",
        "type" : "Type",
      },
      "de" : {
        "arrayWhereEachEntryHasTheFollowingType" : "Array, bei dem jeder Eintrag folgenden Typ hat",
        "arrayWithTheFollowingEntries" : "Array mit folgenden Einträgen",
        "clickToShowHide" : "Klick zum Zeigen/Verbergen",
        "commandIntroduction" : "Diese Seite gilt nur für vscode-ltex. Sie gilt nicht, falls Sie "
          "ein anderes LTeX-Plugin für einen anderen Editor als VS Code verwenden.\n\n"
          "Um einen Befehl auszuführen, öffnen Sie die Befehlspalette "
          "(`Ctrl+Shift+P`) und beginnen Sie mit der Eingabe des Befehlsnamens.",
        "default" : "Voreinstellung",
        "example" : "Beispiel",
        "examples" : "Beispiele",
        "fullTypeDescription" : "Vollständige Beschreibung des Typs",
        "objectWithArbitraryPropertyNames" : "Objekt mit beliebigen Eigenschaftsnamen, "
          "wobei die Werte jeder Eigenschaft folgenden Typ hat",
        "objectWithTheFollowingProperties" : "Objekt mit folgenden Eigenschaften",
        "oneOfTheFollowingTypes" : "Einer der folgenden Typen",
        "oneOfTheFollowingValues" : "Einer der folgenden Werte",
        "oneType" : "`{}`",
        "possibleValues" : "Mögliche Werte",
        "scalarOfType" : "Skalar vom Typ {}",
        "threePlusTypesSuffix" : ", `{}` oder `{}`",
        "twoTypes" : "`{}` oder `{}`",
        "type" : "Typ",
      },
    }



def formatList(json_: Sequence[Any]) -> str:
  return "\n".join(f"- {formatAsJson(x)}" for x in json_)



def formatType(type_: str, packageNlsJson: Dict[str, str]) -> str:
  if isinstance(type_, str) or (len(type_) == 1):
    return packageNlsJson["oneType"].format(type_)
  elif len(type_) == 1:
    return packageNlsJson["oneType"].format(type_[0])
  elif len(type_) == 2:
    return packageNlsJson["twoTypes"].format(type_[0], type_[1])
  else:
    return (", ".join(packageNlsJson["oneType"].format(x) for x in type_[:-2]) +
        packageNlsJson["threePlusTypesSuffix"].format(type_[-2], type_[-1]))



def formatEnum(enumNames: Sequence[str], enumDescriptions: Sequence[str],
      packageNlsJson: Dict[str, str], indent: int = 0) -> str:
  formatEnumEntries: Callable[[str, str], str] = (lambda x, y: formatAsJson(x) +
      (f": {formatDescription(y, packageNlsJson)}" if y is not None else ""))
  markdown = "\n".join(f"- {formatEnumEntries(x, y)}" for x, y in zip(enumNames, enumDescriptions))
  markdown += "\n"
  return markdown



def formatAsJson(json_: Any) -> str:
  return f"`{json.dumps(json_)}`"



def replaceNlsKey(packageNlsJson: Dict[str, str], match: re.Match[str]) -> Any:
  key = match.group(1)

  keys = [key]
  if key.endswith(".markdownDescription"): keys.insert(0, f"{key[:-20]}.fullMarkdownDescription")

  for curKey in keys:
    if curKey in packageNlsJson: return packageNlsJson[curKey]

  raise RuntimeError("unknown NLS key '{}'".format(key))



def formatDescription(description: str, packageNlsJson: Dict[str, str]) -> str:
  return re.sub(r"%([A-Za-z0-9\-_\.]+)%", functools.partial(replaceNlsKey, packageNlsJson),
      description)



def formatFullType(settingJson: Dict[str, Any], packageNlsJson: Dict[str, str],
      indent: int = 0) -> str:
  markdown = ""
  description = settingJson.get("markdownDescription", None)

  if (description is not None) and (indent > 0):
    markdown += f"{formatDescription(description, packageNlsJson)}\n\n{indent * ' '}"

  if "oneOf" in settingJson:
    itemTypes = settingJson["oneOf"]
    markdown += f"{packageNlsJson['oneOfTheFollowingTypes']}:\n\n"
    markdown += "".join(
        f"{indent * ' '}- {formatFullType(x, packageNlsJson, indent+2)}" for x in itemTypes)
  elif "type" not in settingJson:
    markdown += formatAsJson(settingJson) + "\n"
  elif settingJson["type"] == "object":
    if "patternProperties" in settingJson:
      assert len(settingJson["patternProperties"]) == 1
      assert "^.*$" in settingJson["patternProperties"]
      propertyType = settingJson["patternProperties"]["^.*$"]
      markdown += f"{packageNlsJson['objectWithArbitraryPropertyNames']}:\n\n"
      markdown += f"{indent * ' '}- {formatFullType(propertyType, packageNlsJson, indent+2)}"
    else:
      markdown += f"{packageNlsJson['objectWithTheFollowingProperties']}:\n\n"
      markdown += "".join(
          f"{indent * ' '}- {formatAsJson(x)}: {formatFullType(y, packageNlsJson, indent+2)}"
          for x, y in settingJson["properties"].items())
  elif settingJson["type"] == "array":
    itemTypes = settingJson["items"]

    if isinstance(itemTypes, dict):
      markdown += f"{packageNlsJson['arrayWhereEachEntryHasTheFollowingType']}:\n\n"
      markdown += f"{indent * ' '}- {formatFullType(itemTypes, packageNlsJson, indent+2)}"
    else:
      markdown += f"{packageNlsJson['arrayWithTheFollowingEntries']}:\n\n"
      markdown += "".join(
          f"{indent * ' '}- {formatFullType(x, packageNlsJson, indent+2)}" for x in itemTypes)
  elif "enum" in settingJson:
    enumNames = settingJson["enum"]
    enumDescriptions = (settingJson["markdownEnumDescriptions"]
        if "markdownEnumDescriptions" in settingJson else settingJson["enumDescriptions"])
    markdown += f"{packageNlsJson['oneOfTheFollowingValues']}:\n\n"
    markdown += "".join(
        f"{indent * ' '}- {formatAsJson(x)}: {formatDescription(y, packageNlsJson)}\n"
        for x, y in zip(enumNames, enumDescriptions))
  else:
    markdown += "{}\n".format(packageNlsJson["scalarOfType"].format(
        formatType(settingJson['type'], packageNlsJson)))

  return markdown



def formatSetting(settingName: str, settingJson: Dict[str, Any],
      packageNlsJson: Dict[str, str]) -> Optional[str]:
  if "markdownDescription" not in settingJson: return None
  markdown = (f"## `{settingName}`\n\n"
      f"{formatDescription(settingJson['markdownDescription'], packageNlsJson)}\n")

  if "type" in settingJson:
    type_ = settingJson["type"]
  elif "oneOf" in settingJson:
    type_ = [x["type"] for x in settingJson["oneOf"]]
  else:
    raise ValueError("Missing type")

  examples = settingJson.get("examples", [])
  markdown += f"\n*{packageNlsJson['type']}:* {formatType(type_, packageNlsJson)}\n"

  if "enum" in settingJson:
    enum = settingJson["enum"]
    enumDescriptions = (settingJson["markdownEnumDescriptions"]
        if "markdownEnumDescriptions" in settingJson else
        settingJson.get("enumDescriptions", len(enum) * [None]))
    markdown += f"\n*{packageNlsJson['possibleValues']}:*\n\n{formatEnum(enum, enumDescriptions, packageNlsJson)}\n"

  if len(examples) == 1:
    markdown += f"\n*{packageNlsJson['example']}:* {formatAsJson(examples[0])}\n"
  elif len(examples) >= 2:
    markdown += f"\n*{packageNlsJson['examples']}:*\n\n{formatList(examples)}\n"

  if "default" in settingJson:
    markdown += f"\n*{packageNlsJson['default']}:* {formatAsJson(settingJson['default'])}\n"

  if (type_ in ["array", "object"]) or (not isinstance(type_, str)):
    markdown += (f"\n*{packageNlsJson['fullTypeDescription']}:* "
        f"<button class='expandable-button btn btn-default'>{packageNlsJson['clickToShowHide']}"
        "</button>\n\n<div markdown='1' style='display:none;'>\n\n"
        f"{formatFullType(settingJson, packageNlsJson)}\n</div>\n\n")

  return markdown



def formatCommand(commandJson: Dict[str, Any], packageNlsJson: Dict[str, str]) -> Optional[str]:
  description = f"%ltex.i18n.commands.{commandJson['command']}.fullMarkdownDescription%"
  markdown = (f"## `LTeX: {formatDescription(commandJson['title'], packageNlsJson)}`\n\n"
      f"{formatDescription(description, packageNlsJson)}\n")
  return markdown



def getNlsLanguages(ltexRepoDirPath: str) -> Sequence[Tuple[str, str, str]]:
  languages = []
  languageNames = {
        "en" : "English",
        "de" : "German",
      }

  for fileName in os.listdir(ltexRepoDirPath):
    if (match := re.match(r"^package\.nls(?:\.([^\.]+))?\.json$", fileName)) is not None:
      languageCode = (match.group(1) if match.group(1) is not None else "en")
      packageNlsJsonPath = os.path.join(ltexRepoDirPath, fileName)
      languages.append((languageCode, languageNames[languageCode], packageNlsJsonPath))

  languages.sort(key=lambda x: (x[0] if x[0] != "en" else ""))

  return languages



def updateSettings(ltexRepoDirPath: str, pagesRepoDirPath: str) -> None:
  packageJsonPath = os.path.join(ltexRepoDirPath, "package.json")
  with open(packageJsonPath, "r") as f: packageJson = json.load(f)

  nlsLanguages = getNlsLanguages(ltexRepoDirPath)
  languageLinks = ", ".join((f"[{languageName}](settings-{languageCode}.html)"
        if languageCode != "en" else "[English](settings.html)")
      for languageCode, languageName, _ in nlsLanguages)

  for languageCode, _, packageNlsJsonPath in nlsLanguages:
    pageNameSuffix = (f"-{languageCode}" if languageCode != "en" else "")

    with open(packageNlsJsonPath, "r") as f: packageNlsJson = json.load(f)
    packageNlsJson.update(i18nStrings[languageCode])

    settingsJson = packageJson["contributes"]["configuration"]["properties"]
    settingsMarkdown = [formatSetting(x, y, packageNlsJson) for x, y in settingsJson.items()]
    markdown = """---{}
title: "Settings"
permalink: "/docs/settings{}.html"
sidebar: "sidebar"
---

Change language of this page: {}

""".format(licenseHeader, pageNameSuffix, languageLinks)
    markdown += "\n".join(x for x in settingsMarkdown if x is not None)
    markdown = re.sub("\n\n+", "\n\n", markdown)
    markdown = markdown.replace("https://valentjn.github.io/vscode-ltex/docs/", "")

    dstPath = os.path.join(pagesRepoDirPath, "pages", "docs", f"settings{pageNameSuffix}.md")
    with open(dstPath, "w") as f: f.write(markdown)
    linkSettingsAndCommands(dstPath, os.path.join(pagesRepoDirPath, "pages"), ltexRepoDirPath)



def updateCommands(ltexRepoDirPath: str, pagesRepoDirPath: str) -> None:
  packageJsonPath = os.path.join(ltexRepoDirPath, "package.json")
  with open(packageJsonPath, "r") as f: packageJson = json.load(f)

  nlsLanguages = getNlsLanguages(ltexRepoDirPath)
  languageLinks = ", ".join((f"[{languageName}](commands-{languageCode}.html)"
        if languageCode != "en" else "[English](commands.html)")
      for languageCode, languageName, _ in nlsLanguages)

  for languageCode, _, packageNlsJsonPath in nlsLanguages:
    pageNameSuffix = (f"-{languageCode}" if languageCode != "en" else "")

    with open(packageNlsJsonPath, "r") as f: packageNlsJson = json.load(f)
    packageNlsJson.update(i18nStrings[languageCode])

    commandsJson = packageJson["contributes"]["commands"]
    commandsMarkdown = [formatCommand(x, packageNlsJson) for x in commandsJson]
    markdown = """---{}
title: "Commands"
permalink: "/docs/commands{}.html"
sidebar: "sidebar"
---

Change language of this page: {}

{}

""".format(licenseHeader, pageNameSuffix, languageLinks, packageNlsJson["commandIntroduction"])
    markdown += "\n".join(x for x in commandsMarkdown if x is not None)
    markdown = re.sub("\n\n+", "\n\n", markdown)
    markdown = markdown.replace("https://valentjn.github.io/vscode-ltex/docs/", "")

    dstPath = os.path.join(pagesRepoDirPath, "pages", "docs", f"commands{pageNameSuffix}.md")
    with open(dstPath, "w") as f: f.write(markdown)
    linkSettingsAndCommands(dstPath, os.path.join(pagesRepoDirPath, "pages"), ltexRepoDirPath)



def copyMarkdown(srcPath: str, dstPath: str, metaData: str, ltexRepoDirPath: str,
      pagesRepoDirPath: str) -> None:
  with open(srcPath, "r") as f: markdown = f.read()
  lines = markdown.split("\n")
  i = next(i for i, line in enumerate(lines) if line.startswith("#"))
  markdown = metaData + "\n".join(lines[i+1:])
  markdown = markdown.replace("L<sup>A</sup>T<sub>E</sub>X", "LaTeX").replace(
      "T<sub>E</sub>X", "TeX")
  markdown = markdown.replace("https://valentjn.github.io/vscode-ltex/docs/", "")
  with open(dstPath, "w") as f: f.write(markdown)
  linkSettingsAndCommands(dstPath, os.path.join(pagesRepoDirPath, "pages"), ltexRepoDirPath)



def updateChangelog(ltexRepoDirPath: str, pagesRepoDirPath: str) -> None:
  copyMarkdown(os.path.join(ltexRepoDirPath, "CHANGELOG.md"),
      os.path.join(pagesRepoDirPath, "pages", "docs", "changelog.md"), """---{}
title: "Changelog"
permalink: "/docs/changelog.html"
sidebar: "sidebar"
toc: false
---

This is the changelog of vscode-ltex. If you use a different LTeX plugin for an editor other than VS Code, check the [changelog of LTeX LS](https://github.com/valentjn/ltex-ls/blob/release/CHANGELOG.md) (look up which version of LTeX LS your LTeX plugin uses).
""".format(licenseHeader), ltexRepoDirPath, pagesRepoDirPath)



def updateContributing(ltexRepoDirPath: str, pagesRepoDirPath: str) -> None:
  copyMarkdown(os.path.join(ltexRepoDirPath, "CONTRIBUTING.md"),
      os.path.join(pagesRepoDirPath, "pages", "docs", "contributing-code-issues.md"), """---{}
title: "Contributing Code/Issues"
permalink: "/docs/contributing-code-issues.html"
sidebar: "sidebar"
---
""".format(licenseHeader), ltexRepoDirPath, pagesRepoDirPath)



def updateCodeOfConduct(ltexRepoDirPath: str, pagesRepoDirPath: str) -> None:
  copyMarkdown(os.path.join(ltexRepoDirPath, "CODE_OF_CONDUCT.md"),
      os.path.join(pagesRepoDirPath, "pages", "docs", "code-of-conduct.md"), """---
title: "Code of Conduct"
permalink: "/docs/code-of-conduct.html"
sidebar: "sidebar"
---
""", ltexRepoDirPath, pagesRepoDirPath)



def updateAcknowledgments(ltexRepoDirPath: str, pagesRepoDirPath: str) -> None:
  copyMarkdown(os.path.join(ltexRepoDirPath, "ACKNOWLEDGMENTS.md"),
      os.path.join(pagesRepoDirPath, "pages", "docs", "acknowledgments.md"), """---{}
title: "Acknowledgments"
permalink: "/docs/acknowledgments.html"
sidebar: "sidebar"
---
""".format(licenseHeader), ltexRepoDirPath, pagesRepoDirPath)



def main() -> None:
  parser = argparse.ArgumentParser(description="update Markdown according to main repo")
  parser.add_argument("--ltex-repo",
      default=os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "vscode-ltex")),
      help="path to main repo")
  args = parser.parse_args()

  ltexRepoDirPath = args.ltex_repo
  pagesRepoDirPath = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
  updateSettings(ltexRepoDirPath, pagesRepoDirPath)
  updateCommands(ltexRepoDirPath, pagesRepoDirPath)
  updateChangelog(ltexRepoDirPath, pagesRepoDirPath)
  updateContributing(ltexRepoDirPath, pagesRepoDirPath)
  updateCodeOfConduct(ltexRepoDirPath, pagesRepoDirPath)
  updateAcknowledgments(ltexRepoDirPath, pagesRepoDirPath)



if __name__ == "__main__":
  main()
