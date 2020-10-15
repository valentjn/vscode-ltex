#!/usr/bin/python3

# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import os
import re
import urllib.parse
import sys

sys.path.append(os.path.dirname(__file__))
import common



def getDownloadUrlsOfGitHubReleases(organizationName, repositoryName, tagName):
  apiUrl = (f"https://api.github.com/repos/{urllib.parse.quote_plus(organizationName)}/"
      f"{urllib.parse.quote_plus(repositoryName)}/releases/tags/{urllib.parse.quote_plus(tagName)}")
  response = common.requestFromGitHub(apiUrl)
  return {x["name"] : x["browser_download_url"] for x in response["assets"]}



def main():
  print(f"Retrieving list of assets for tag 'jdk-{common.toBeDownloadedJavaVersion}'...")
  downloadUrls = getDownloadUrlsOfGitHubReleases("AdoptOpenJDK", "openjdk11-binaries",
      f"jdk-{common.toBeDownloadedJavaVersion}")
  assetFileNames = [x for x in downloadUrls
      if ("-jre_" in x) and (x.endswith(".zip") or x.endswith(".tar.gz"))]
  assetFileNames.sort()
  hashDigests = []

  for assetFileName in assetFileNames:
    print(f"Retrieving hash digest for '{assetFileName}'...")
    response = common.requestFromGitHub(
        f"{downloadUrls[assetFileName]}.sha256.txt", decodeAsJson=False).decode().strip()
    match = re.match(r"^([A-Fa-f0-9]{64}) +(.*)$", response)
    hashDigest = match.group(1)
    assert match.group(2) == assetFileName
    print(f"Hash digest is '{hashDigest}'.")
    hashDigests.append(hashDigest)

  hashDigestsTypescript = "".join(f"    '{x}':\n      '{y}',\n"
      for x, y in zip(assetFileNames, hashDigests))

  print("Writing hash digests to 'src/DependencyManager.ts'...")
  dependencyManagerFilePath = os.path.join(common.repoDirPath, "src", "DependencyManager.ts")
  with open(dependencyManagerFilePath, "r") as f: dependencyManagerTypescript = f.read()
  dependencyManagerTypescript = re.sub(
      r"(_toBeDownloadedJavaHashDigests: \{\[fileName: string\]: string\} = \{\n).*?(  \};\n)",
      fr"\g<1>{hashDigestsTypescript}\g<2>", dependencyManagerTypescript, flags=re.DOTALL)
  with open(dependencyManagerFilePath, "w") as f: f.write(dependencyManagerTypescript)



if __name__ == "__main__":
  main()
