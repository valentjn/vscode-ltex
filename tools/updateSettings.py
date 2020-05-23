#!/usr/bin/python

import argparse
import json
import os
import re

def formatList(json_):
  return "\n".join(f"- `{x}`" for x in json_)

def formatType(type_):
  if isinstance(type_, str) or (len(type_) == 1):
    return f"`{type_}`"
  elif len(type_) == 2:
    return f"`{type_[0]}` or `{type_[1]}`"
  else:
    return ", ".join(f"`{x}`" for x in type_[:-2]) + f", `{type_[-2]}` or `{type_[-1]}`"

def formatEnum(enumNames, enumDescriptions, indent=0):
  formatEnumEntries = (lambda x, y: f"`{x}`: {y}" if y is not None else f"`{x}`")
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
    markdown += formatAsJson(settingJson)
  elif settingJson["type"] == "object":
    assert settingJson["propertyNames"]["type"] == "string"
    markdown += "Object with the following properties:\n\n"
    markdown += "\n".join(f"{indent * ' '}- `{x}`: {formatFullType(y, indent+2)}"
        for x, y in settingJson["properties"].items())
    markdown += "\n"
  elif settingJson["type"] == "array":
    itemTypes = settingJson["items"]

    if isinstance(itemTypes, dict):
      markdown += "Array where each entry has the following type:\n\n"
      markdown += f"{indent * ' '}- {formatFullType(itemTypes, indent+2)}"
      markdown += "\n"
    else:
      markdown += "Array with the following entries:\n\n"
      markdown += "\n".join(f"{indent * ' '}- {formatFullType(x, indent+2)}" for x in itemTypes)
      markdown += "\n"
  elif "enum" in settingJson:
    enumNames = settingJson["enum"]
    enumDescriptions = settingJson["enumDescriptions"]
    markdown += "One of the following values:\n\n"
    markdown += "\n".join(f"{indent * ' '}- `{x}`: {y}"
        for x, y in zip(enumNames, enumDescriptions))
    markdown += "\n"
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
    markdown += f"\n*Full type description:* {formatFullType(settingJson)}\n"

  return markdown

def main():
  parser = argparse.ArgumentParser(description="update settings.md according to package.json")
  parser.add_argument("--source",
      default=os.path.join(os.path.dirname(__file__), "..", "..", "vscode-ltex", "package.json"),
      help="path to package.json")
  args = parser.parse_args()

  with open(args.source, "r") as f: packageJson = json.load(f)

  settingsJson = packageJson["contributes"]["configuration"]["properties"]
  settingsMarkdown = [formatSetting(x, y) for x, y in settingsJson.items()]
  markdown = """---
title: "Settings"
sidebar: "sidebar"
permalink: "docs_settings.html"
---

"""
  markdown += "\n".join(x for x in settingsMarkdown if x is not None)
  markdown = re.sub("\n\n+", "\n\n", markdown)

  destPath = os.path.join(os.path.dirname(__file__), "..", "pages", "docs", "settings.md")
  with open(destPath, "w") as f: f.write(markdown)



if __name__ == "__main__":
  main()
