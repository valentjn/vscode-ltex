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



def replaceSettingsCommandsMatch(
      markdownPath, pagesDirPath, markdown, settingNames, commandNames, match):
  i = markdown.rfind("\n", 0, match.start())
  contextBefore = markdown[i+1:match.start()]
  key = match.group(1)
  if re.search(r"^#+\s*", contextBefore) or (contextBefore[-1] == "["):
    return match.group(0)

  if key in settingNames:
    url = "{}#{}".format(os.path.relpath(os.path.join(pagesDirPath, "docs", "settings.html"),
        os.path.dirname(markdownPath)), getSlug(key))
    return f"[`{key}`]({url})"
  elif key in commandNames:
    url = "{}#{}".format(os.path.relpath(os.path.join(pagesDirPath, "docs", "commands.html"),
        os.path.dirname(markdownPath)), getSlug(commandNames[key]))
    return f"[`{key}`]({url})"
  else:
    return match.group(0)

def getSlug(markdown):
  return re.sub(r"[^a-z0-9\-]", "", re.sub(r"[ ]", "-", markdown.lower()))

def replaceNlsKey(packageNlsJson, match):
  key = match.group(1)
  if key not in packageNlsJson: raise RuntimeError("unknown NLS key '{}'".format(key))
  return packageNlsJson[key]

def formatTitle(description, packageNlsJson):
  return re.sub(r"%([A-Za-z0-9\-_\.]+)%", functools.partial(replaceNlsKey, packageNlsJson),
      description)

def linkSettingsAndCommands(markdownPath, pagesDirPath, ltexRepoDirPath):
  packageJsonPath = os.path.join(ltexRepoDirPath, "package.json")
  with open(packageJsonPath, "r") as f: packageJson = json.load(f)

  packageNlsJsonPath = os.path.join(ltexRepoDirPath, "package.nls.json")
  with open(packageNlsJsonPath, "r") as f: packageNlsJson = json.load(f)

  settingsJson = packageJson["contributes"]["configuration"]["properties"]
  settingNames = [x for x in settingsJson.keys() if "markdownDescription" in settingsJson[x]]

  commandsJson = packageJson["contributes"]["commands"]
  commandNames = {formatTitle(x["title"], packageNlsJson) : x["command"]
      for x in commandsJson if "markdownDescription" in x}

  with open(markdownPath, "r") as f: markdown = f.read()
  markdown = re.sub(r"`((?:ltex\.[^`]+)|(?:LTeX: [^`]+))`",
      functools.partial(replaceSettingsCommandsMatch, markdownPath, pagesDirPath, markdown,
        settingNames, commandNames), markdown)
  with open(markdownPath, "w") as f: f.write(markdown)



def main():
  parser = argparse.ArgumentParser(description="link settings in all pages")
  parser.add_argument("--ltex-repo",
      default=os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "vscode-ltex")),
      help="path to main repo")
  args = parser.parse_args()

  pagesDirPath = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "pages"))
  ltexRepoDirPath = args.ltex_repo

  for root, dirNames, fileNames in os.walk(pagesDirPath):
    dirNames.sort()

    for fileName in fileNames:
      if fileName.endswith(".md"):
        linkSettingsAndCommands(os.path.join(root, fileName), pagesDirPath, ltexRepoDirPath)

if __name__ == "__main__":
  main()
