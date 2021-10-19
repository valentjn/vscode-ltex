#!/usr/bin/python3

# Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import os
import pathlib
import re
import sys
from typing import Any

import yaml

sys.path.append(str(pathlib.Path(__file__).parent))
import common



pagesDirPath = pathlib.Path("/mnt/d/repos/ltex")



def getSlug(markdown: str) -> str:
  return re.sub(r"[^a-z0-9\-]", "", re.sub(r"[ ]", "-", markdown.lower()))

def getMarkdownStructure(baseUrl: str, markdownPath: str) -> Any:
  with open(markdownPath, "r") as f: markdown = f.read()

  iterator = re.finditer(r"^---$", markdown, flags=re.MULTILINE)
  match = next(iterator)
  match = next(iterator)
  metadata = yaml.load(markdown[:match.start()], Loader=yaml.SafeLoader)
  if not metadata.get("toc", True): return []
  markdown = markdown[match.end():]

  matches = re.findall(r"^(#+) (.*)$", markdown, flags=re.MULTILINE)
  structure: Any = []

  for match in matches:
    level = len(match[0]) - 2
    listToAppend = structure
    for i in range(level): listToAppend = listToAppend[-1]["children"]
    slug = getSlug(match[1])
    listToAppend.append({"title" : processTitle(match[1]), "url" : "{}#{}".format(baseUrl, slug),
        "children" : []})

  return structure

def convertToMarkdown(structure: Any, indent: int = 0) -> str:
  markdown = ""

  for entry in structure:
    markdown += f"{indent * ' '}- [{entry['title']}]({entry['url']})\n"

    if len(entry["children"]) > 0:
      markdown += convertToMarkdown(entry["children"], indent + 2)

  return markdown

def processTitle(title: str) -> str:
  title = title.replace("LaTeX", "L<sup>A</sup>T<sub>E</sub>X").replace("TeX", "T<sub>E</sub>X")
  prevTitle = None

  while title != prevTitle:
    prevTitle = title
    title = re.sub(r"(`.*?)LT<sub>E</sub>X", r"\1LTeX", title)

  return title



def updateReadme() -> None:
  serverUrl = "https://valentjn.github.io/ltex"
  sidebarYamlPath = pagesDirPath.joinpath("_data", "sidebars", "sidebar.yml")
  with open(sidebarYamlPath, "r") as f: sidebarYaml = yaml.load(f, Loader=yaml.SafeLoader)

  structure = []

  for folder in sidebarYaml["entries"][0]["folders"]:
    children = []

    for entry in folder["folderitems"]:
      if "url" in entry:
        url = serverUrl + entry["url"]
        markdownPath = "{}{}.md".format(pagesDirPath.joinpath("pages"),
            os.path.splitext(entry["url"])[0])
        grandChildren = getMarkdownStructure(url, markdownPath)
      else:
        url = entry["external_url"]
        grandChildren = []

      children.append({"title": processTitle(entry["title"]), "url" : url,
          "children" : grandChildren})

    structure.append({"title" : processTitle(folder["title"]), "url" : children[0]["url"],
        "children" : children})

  markdown = convertToMarkdown(structure)

  readmePath = common.repoDirPath.joinpath("README.md")
  with open(readmePath, "r") as f: readme = f.read()

  readme = re.sub(r"## Information & Documentation\n\n.*?^( *[^\-\*\n ])",
      r"## Information & Documentation\n\n{}\n\1".format(markdown.replace("\\", "\\\\")), readme,
      flags=re.MULTILINE | re.DOTALL)

  with open(readmePath, "w") as f: f.write(readme)



def main() -> None:
  updateReadme()



if __name__ == "__main__":
  main()
