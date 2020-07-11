#!/usr/bin/python

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

sys.path.append(os.path.dirname(__file__))
from linkSettings import linkSettings



licenseHeader = """
# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.
"""


def formatList(json_):
  return "\n".join(f"- {formatAsJson(x)}" for x in json_)

def formatType(type_):
  if isinstance(type_, str) or (len(type_) == 1):
    return f"`{type_}`"
  elif len(type_) == 2:
    return f"`{type_[0]}` or `{type_[1]}`"
  else:
    return ", ".join(f"`{x}`" for x in type_[:-2]) + f", `{type_[-2]}` or `{type_[-1]}`"

def formatEnum(enumNames, enumDescriptions, packageNlsJson, indent=0):
  formatEnumEntries = (lambda x, y: formatAsJson(x) +
      (f": {formatDescription(y, packageNlsJson)}" if y is not None else ""))
  markdown = "\n".join(f"- {formatEnumEntries(x, y)}" for x, y in zip(enumNames, enumDescriptions))
  markdown += "\n"
  return markdown

def formatAsJson(json_):
  return f"`{json.dumps(json_)}`"

def replaceNlsKey(packageNlsJson, match):
  key = match.group(1)
  if key not in packageNlsJson: raise RuntimeError("unknown NLS key '{}'".format(key))
  return packageNlsJson[key]

def formatDescription(description, packageNlsJson):
  return re.sub(r"%([A-Za-z0-9\-_\.]+)%", functools.partial(replaceNlsKey, packageNlsJson),
      description)

def formatFullType(settingJson, packageNlsJson, indent=0):
  markdown = ""
  description = settingJson.get("markdownDescription", None)

  if (description is not None) and (indent > 0):
    markdown += f"{formatDescription(description, packageNlsJson)}\n\n{indent * ' '}"

  if "type" not in settingJson:
    markdown += formatAsJson(settingJson) + "\n"
  elif settingJson["type"] == "object":
    markdown += "Object with the following properties:\n\n"
    markdown += "".join(
        f"{indent * ' '}- {formatAsJson(x)}: {formatFullType(y, packageNlsJson, indent+2)}"
        for x, y in settingJson["properties"].items())
  elif settingJson["type"] == "array":
    itemTypes = settingJson["items"]

    if isinstance(itemTypes, dict):
      markdown += "Array where each entry has the following type:\n\n"
      markdown += f"{indent * ' '}- {formatFullType(itemTypes, packageNlsJson, indent+2)}"
    else:
      markdown += "Array with the following entries:\n\n"
      markdown += "".join(
          f"{indent * ' '}- {formatFullType(x, packageNlsJson, indent+2)}" for x in itemTypes)
  elif "enum" in settingJson:
    enumNames = settingJson["enum"]
    enumDescriptions = settingJson["enumDescriptions"]
    markdown += "One of the following values:\n\n"
    markdown += "".join(
        f"{indent * ' '}- {formatAsJson(x)}: {formatDescription(y, packageNlsJson)}\n"
        for x, y in zip(enumNames, enumDescriptions))
  else:
    markdown += f"Scalar of type {formatType(settingJson['type'])}\n"

  return markdown

def formatSetting(settingName, settingJson, packageNlsJson):
  if "markdownDescription" not in settingJson: return None
  markdown = (f"## `{settingName}`\n\n"
      f"{formatDescription(settingJson['markdownDescription'], packageNlsJson)}\n")

  type_ = settingJson["type"]
  examples = settingJson.get("examples", [])
  markdown += f"\n*Type:* {formatType(type_)}\n"

  if "enum" in settingJson:
    enum = settingJson["enum"]
    enumDescriptions = settingJson.get("enumDescriptions", len(enum) * [None])
    markdown += f"\n*Possible values:*\n\n{formatEnum(enum, enumDescriptions, packageNlsJson)}\n"

  if len(examples) == 1:
    markdown += f"\n*Example:* {formatAsJson(examples[0])}\n"
  elif len(examples) >= 2:
    markdown += f"\n*Examples:*\n\n{formatList(examples)}\n"

  if "default" in settingJson:
    markdown += f"\n*Default:* {formatAsJson(settingJson['default'])}\n"

  if type_ in ["array", "object"]:
    markdown += ("\n*Full type description:* <button class='expandable-button btn btn-default'>"
        "Click to show/hide</button>\n\n<div markdown='1' style='display:none;'>\n\n"
        f"{formatFullType(settingJson, packageNlsJson)}\n</div>\n\n")

  return markdown

def updateSettings(ltexRepoDirPath, pagesRepoDirPath):
  packageJsonPath = os.path.join(ltexRepoDirPath, "package.json")
  with open(packageJsonPath, "r") as f: packageJson = json.load(f)

  packageNlsJsonPath = os.path.join(ltexRepoDirPath, "package.nls.json")
  with open(packageNlsJsonPath, "r") as f: packageNlsJson = json.load(f)

  settingsJson = packageJson["contributes"]["configuration"]["properties"]
  settingsMarkdown = [formatSetting(x, y, packageNlsJson) for x, y in settingsJson.items()]
  markdown = """---{}
title: "Settings"
permalink: "/docs/settings.html"
sidebar: "sidebar"
---

""".format(licenseHeader)
  markdown += "\n".join(x for x in settingsMarkdown if x is not None)
  markdown = re.sub("\n\n+", "\n\n", markdown)

  dstPath = os.path.join(pagesRepoDirPath, "pages", "docs", "settings.md")
  with open(dstPath, "w") as f: f.write(markdown)
  linkSettings(dstPath, os.path.join(pagesRepoDirPath, "pages"), ltexRepoDirPath)



def copyMarkdown(srcPath, dstPath, metaData, ltexRepoDirPath, pagesRepoDirPath):
  with open(srcPath, "r") as f: markdown = f.read()
  lines = markdown.split("\n")
  i = next(i for i, line in enumerate(lines) if line.startswith("#"))
  markdown = metaData + "\n".join(lines[i+1:])
  markdown = markdown.replace("L<sup>A</sup>T<sub>E</sub>X", "LaTeX").replace(
      "T<sub>E</sub>X", "TeX")
  with open(dstPath, "w") as f: f.write(markdown)
  linkSettings(dstPath, os.path.join(pagesRepoDirPath, "pages"), ltexRepoDirPath)

def updateChangelog(ltexRepoDirPath, pagesRepoDirPath):
  copyMarkdown(os.path.join(ltexRepoDirPath, "CHANGELOG.md"),
      os.path.join(pagesRepoDirPath, "pages", "docs", "changelog.md"), """---{}
title: "Changelog"
permalink: "/docs/changelog.html"
sidebar: "sidebar"
toc: false
---
""".format(licenseHeader), ltexRepoDirPath, pagesRepoDirPath)

def updateContributing(ltexRepoDirPath, pagesRepoDirPath):
  copyMarkdown(os.path.join(ltexRepoDirPath, "CONTRIBUTING.md"),
      os.path.join(pagesRepoDirPath, "pages", "docs", "contributing-code-issues.md"), """---{}
title: "Contributing Code/Issues"
permalink: "/docs/contributing-code-issues.html"
sidebar: "sidebar"
---
""".format(licenseHeader), ltexRepoDirPath, pagesRepoDirPath)

def updateAcknowledgments(ltexRepoDirPath, pagesRepoDirPath):
  copyMarkdown(os.path.join(ltexRepoDirPath, "ACKNOWLEDGMENTS.md"),
      os.path.join(pagesRepoDirPath, "pages", "docs", "acknowledgments.md"), """---{}
title: "Acknowledgments"
permalink: "/docs/acknowledgments.html"
sidebar: "sidebar"
---
""".format(licenseHeader), ltexRepoDirPath, pagesRepoDirPath)



def main():
  parser = argparse.ArgumentParser(description="update Markdown according to main repo")
  parser.add_argument("--ltex-repo",
      default=os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "vscode-ltex")),
      help="path to main repo")
  args = parser.parse_args()

  ltexRepoDirPath = args.ltex_repo
  pagesRepoDirPath = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
  updateSettings(ltexRepoDirPath, pagesRepoDirPath)
  updateChangelog(ltexRepoDirPath, pagesRepoDirPath)
  updateContributing(ltexRepoDirPath, pagesRepoDirPath)
  updateAcknowledgments(ltexRepoDirPath, pagesRepoDirPath)



if __name__ == "__main__":
  main()
