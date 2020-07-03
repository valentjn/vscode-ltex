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



def replaceSettingsMatch(markdownPath, pagesDirPath, markdown, settingNames, match):
  i = markdown.rfind("\n", 0, match.start())
  contextBefore = markdown[i+1:match.start()]
  settingName = match.group(1)
  if (re.search(r"^#+\s*", contextBefore) or (contextBefore[-1] == "[") or
        (settingName not in settingNames)):
    return match.group(0)

  url = "{}#{}".format(os.path.relpath(os.path.join(pagesDirPath, "docs", "settings.html"),
      os.path.dirname(markdownPath)), getSlug(settingName))
  return f"[`{settingName}`]({url})"

def getSlug(markdown):
  return re.sub(r"[^a-z0-9\-]", "", re.sub(r"[ ]", "-", markdown.lower()))

def linkSettings(markdownPath, pagesDirPath, ltexRepoDirPath):
  packageJsonPath = os.path.join(ltexRepoDirPath, "package.json")
  with open(packageJsonPath, "r") as f: packageJson = json.load(f)
  settingsJson = packageJson["contributes"]["configuration"]["properties"]
  settingNames = [x for x in settingsJson.keys() if "markdownDescription" in settingsJson[x]]

  with open(markdownPath, "r") as f: markdown = f.read()
  markdown = re.sub(r"`(ltex\.[^`]+)`",
      functools.partial(replaceSettingsMatch, markdownPath, pagesDirPath, markdown, settingNames),
      markdown)
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
        linkSettings(os.path.join(root, fileName), pagesDirPath, ltexRepoDirPath)

if __name__ == "__main__":
  main()
