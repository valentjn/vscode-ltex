#!/usr/bin/python

import argparse
import json
import os
import re



def formatList(json_):
  return "\n".join(f"- {formatAsJson(x)}" for x in json_)

def formatType(type_):
  if isinstance(type_, str) or (len(type_) == 1):
    return f"`{type_}`"
  elif len(type_) == 2:
    return f"`{type_[0]}` or `{type_[1]}`"
  else:
    return ", ".join(f"`{x}`" for x in type_[:-2]) + f", `{type_[-2]}` or `{type_[-1]}`"

def formatEnum(enumNames, enumDescriptions, indent=0):
  formatEnumEntries = (lambda x, y: formatAsJson(x) + (f": {y}" if y is not None else ""))
  markdown = "\n".join(f"- {formatEnumEntries(x, y)}" for x, y in zip(enumNames, enumDescriptions))
  markdown += "\n"
  return markdown

def formatAsJson(json_):
  return f"`{json.dumps(json_)}`"

def formatFullType(settingJson, indent=0):
  markdown = ""
  description = settingJson.get("markdownDescription", None)
  if (description is not None) and (indent > 0): markdown += f"{description}\n\n{indent * ' '}"

  if "type" not in settingJson:
    markdown += formatAsJson(settingJson) + "\n"
  elif settingJson["type"] == "object":
    assert settingJson["propertyNames"]["type"] == "string"
    markdown += "Object with the following properties:\n\n"
    markdown += "".join(f"{indent * ' '}- `{x}`: {formatFullType(y, indent+2)}"
        for x, y in settingJson["properties"].items())
  elif settingJson["type"] == "array":
    itemTypes = settingJson["items"]

    if isinstance(itemTypes, dict):
      markdown += "Array where each entry has the following type:\n\n"
      markdown += f"{indent * ' '}- {formatFullType(itemTypes, indent+2)}"
    else:
      markdown += "Array with the following entries:\n\n"
      markdown += "".join(f"{indent * ' '}- {formatFullType(x, indent+2)}" for x in itemTypes)
  elif "enum" in settingJson:
    enumNames = settingJson["enum"]
    enumDescriptions = settingJson["enumDescriptions"]
    markdown += "One of the following values:\n\n"
    markdown += "".join(f"{indent * ' '}- `{x}`: {y}\n"
        for x, y in zip(enumNames, enumDescriptions))
  else:
    markdown += f"Scalar of type {formatType(settingJson['type'])}\n"

  return markdown

def formatSetting(settingName, settingJson):
  if "markdownDescription" not in settingJson: return None
  markdown = f"## `{settingName}`\n\n{settingJson['markdownDescription']}\n"

  type_ = settingJson["type"]
  examples = settingJson.get("examples", [])
  markdown += f"\n*Type:* {formatType(type_)}\n"

  if "enum" in settingJson:
    enum = settingJson["enum"]
    enumDescriptions = settingJson.get("enumDescriptions", len(enum) * [None])
    markdown += f"\n*Possible values:*\n\n{formatEnum(enum, enumDescriptions)}\n"

  if len(examples) == 1:
    markdown += f"\n*Example:* {formatAsJson(examples[0])}\n"
  elif len(examples) >= 2:
    markdown += f"\n*Examples:*\n\n{formatList(examples)}\n"

  if "default" in settingJson:
    markdown += f"\n*Default:* {formatAsJson(settingJson['default'])}\n"

  if type_ in ["array", "object"]:
    markdown += f"\n*Full type description:* <button class='expandable-button btn btn-default'>Click to show/hide</button>\n\n<div markdown='1' style='display:none;'>\n\n{formatFullType(settingJson)}\n</div>\n\n"

  return markdown

def updateSettings(ltexRepoDirPath, pagesRepoDirPath):
  packageJsonPath = os.path.join(ltexRepoDirPath, "package.json")
  with open(packageJsonPath, "r") as f: packageJson = json.load(f)

  settingsJson = packageJson["contributes"]["configuration"]["properties"]
  settingsMarkdown = [formatSetting(x, y) for x, y in settingsJson.items()]
  markdown = """---
title: "Settings"
permalink: "/docs/settings.html"
sidebar: "sidebar"
---

"""
  markdown += "\n".join(x for x in settingsMarkdown if x is not None)
  markdown = re.sub("\n\n+", "\n\n", markdown)

  dstPath = os.path.join(pagesRepoDirPath, "pages", "docs", "settings.md")
  with open(dstPath, "w") as f: f.write(markdown)



def copyMarkdown(srcPath, dstPath, metaData):
  with open(srcPath, "r") as f: markdown = f.read()
  markdown = metaData + "\n".join(markdown.split("\n")[2:])
  markdown = markdown.replace("LT<sub>E</sub>X", "LTeX").replace(
      "L<sup>A</sup>T<sub>E</sub>X", "LaTeX")
  with open(dstPath, "w") as f: f.write(markdown)

def updateChangelog(ltexRepoDirPath, pagesRepoDirPath):
  copyMarkdown(os.path.join(ltexRepoDirPath, "CHANGELOG.md"),
      os.path.join(pagesRepoDirPath, "pages", "docs", "changelog.md"), """---
title: "Changelog"
permalink: "/docs/changelog.html"
sidebar: "sidebar"
toc: false
---

""")

def updateContributing(ltexRepoDirPath, pagesRepoDirPath):
  copyMarkdown(os.path.join(ltexRepoDirPath, "CONTRIBUTING.md"),
      os.path.join(pagesRepoDirPath, "pages", "docs", "contributing-code-issues.md"), """---
title: "Contributing Code/Issues"
permalink: "/docs/contributing-code-issues.html"
sidebar: "sidebar"
---

""")

def updateAcknowledgments(ltexRepoDirPath, pagesRepoDirPath):
  copyMarkdown(os.path.join(ltexRepoDirPath, "ACKNOWLEDGMENTS.md"),
      os.path.join(pagesRepoDirPath, "pages", "docs", "acknowledgments.md"), """---
title: "Acknowledgments"
permalink: "/docs/acknowledgments.html"
sidebar: "sidebar"
---

""")



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
