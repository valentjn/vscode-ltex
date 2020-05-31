#!/usr/bin/python

import os
import re

import yaml

def getSlug(markdown):
  return re.sub(r"[^a-z0-9\-]", "", re.sub(r"[ ]", "-", markdown.lower()))

def getMarkdownStructure(baseUrl, markdownPath):
  with open(markdownPath, "r") as f: markdown = f.read()

  iterator = re.finditer(r"^---$", markdown, flags=re.MULTILINE)
  for i in range(2): match = next(iterator)
  metadata = yaml.load(markdown[:match.start()], Loader=yaml.SafeLoader)
  if not metadata.get("toc", True): return []

  matches = re.findall(r"^(#+) (.*)$", markdown, flags=re.MULTILINE)
  structure = []

  for match in matches:
    level = len(match[0]) - 2
    listToAppend = structure
    for i in range(level): listToAppend = listToAppend[-1]["children"]
    slug = getSlug(match[1])
    listToAppend.append({"title" : match[1], "url" : "{}#{}".format(baseUrl, slug),
        "children" : []})

  return structure

def convertToMarkdown(structure, indent=0):
  markdown = ""

  for entry in structure:
    markdown += f"{indent * ' '}- [{entry['title']}]({entry['url']})\n"

    if len(entry["children"]) > 0:
      markdown += convertToMarkdown(entry["children"], indent + 2)

  return markdown

def processTitle(title):
  return title.replace("LaTeX", "L<sup>A</sup>T<sub>E</sub>X").replace(
      "TeX", "</sup>T<sub>E</sub>X")

def main():
  serverUrl = "https://valentjn.github.io/vscode-ltex"
  pagesRootDirPath = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..",
      "vscode-ltex-gh-pages"))
  sidebarYamlPath = os.path.join(pagesRootDirPath, "_data", "sidebars", "sidebar.yml")
  with open(sidebarYamlPath, "r") as f: sidebarYaml = yaml.load(f, Loader=yaml.SafeLoader)

  structure = []

  for folder in sidebarYaml["entries"][0]["folders"]:
    children = []

    for entry in folder["folderitems"]:
      if "url" in entry:
        url = serverUrl + entry["url"]
        markdownPath = "{}{}.md".format(os.path.join(pagesRootDirPath, "pages"),
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

  readmePath = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "README.md"))
  with open(readmePath, "r") as f: readme = f.read()

  readme = re.sub(r"## Information & Documentation\n\n.*?^( *[^\-\*\n ])",
      r"## Information & Documentation\n\n{}\n\1".format(markdown), readme,
      flags=re.MULTILINE | re.DOTALL)

  with open(readmePath, "w") as f: f.write(readme)



if __name__ == "__main__":
  main()
