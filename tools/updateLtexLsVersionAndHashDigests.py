#!/usr/bin/python3

# Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import argparse
import hashlib
import pathlib
import re
import sys
from typing import Dict, Iterable
import urllib.parse

import semver

sys.path.append(str(pathlib.Path(__file__).parent))
import common



def getLatestLtexLsVersion(versions: Iterable[str],
      allowPrerelease: bool = False) -> semver.VersionInfo:
  latestVersion = None

  for versionString in versions:
    if semver.VersionInfo.isvalid(versionString):
      version = semver.VersionInfo.parse(versionString)

      if ((allowPrerelease or (version.prerelease is None)) and
            ((latestVersion is None) or (version > latestVersion))):
        latestVersion = version

  return latestVersion



def getDownloadUrlsOfGitHubReleases(organizationName: str, repositoryName: str,
      tagName: str) -> Dict[str, str]:
  apiUrl = (f"https://api.github.com/repos/{urllib.parse.quote_plus(organizationName)}/"
      f"{urllib.parse.quote_plus(repositoryName)}/releases/tags/{urllib.parse.quote_plus(tagName)}")
  response = common.requestFromGitHub(apiUrl)
  return {x["name"] : x["browser_download_url"] for x in response["assets"]}



def main() -> None:
  parser = argparse.ArgumentParser(description="Update version and hash digest of LTeX LS")
  parser.add_argument("--allow-prerelease", action="store_true",
      help="Allow prerelease versions")
  parser.add_argument("--tag",
      help="Tag to use; if omitted, tag with latest semantic version will be used")
  args = parser.parse_args()

  print("Retrieving list of releases of LTeX LS...")
  releases = common.requestFromGitHub("https://api.github.com/repos/valentjn/ltex-ls/releases")

  if args.tag is not None:
    ltexLsTag = args.tag

    for release in releases:
      if release["tag_name"] == ltexLsTag:
        ltexLsVersion = release["name"]
        break
  else:
    ltexLsVersion = getLatestLtexLsVersion([x["tag_name"] for x in releases],
        allowPrerelease=args.allow_prerelease)
    ltexLsVersion = str(ltexLsVersion)
    ltexLsTag = ltexLsVersion

  print(f"Retrieving list of assets for LTeX LS {ltexLsVersion} (tag '{ltexLsTag}')...")
  downloadUrls = getDownloadUrlsOfGitHubReleases("valentjn", "ltex-ls", ltexLsTag)
  assetFileNames = [x for x in downloadUrls if x != f"ltex-ls-{ltexLsVersion}.tar.gz"]
  assetFileNames.sort()
  hashDigests = []

  for assetFileName in assetFileNames:
    print(f"Downloading '{assetFileName}'...")
    ltexLsUrl = ("https://github.com/valentjn/ltex-ls/releases/download/"
        f"{urllib.parse.quote_plus(ltexLsTag)}/{assetFileName}")
    response = common.requestFromGitHub(ltexLsUrl, decodeAsJson=False)

    print("Computing hash digest...")
    hashDigest = hashlib.sha256(response).hexdigest()
    print(f"Hash digest is '{hashDigest}'.")
    hashDigests.append(hashDigest)

  hashDigestsTypescript = "".join(f"    '{x}':\n      '{y}',\n"
      for x, y in zip(assetFileNames, hashDigests))

  print("Writing version and hash digests to 'src/DependencyManager.ts'...")
  dependencyManagerFilePath = common.repoDirPath.joinpath("src", "DependencyManager.ts")
  with open(dependencyManagerFilePath, "r") as f: dependencyManagerTypescript = f.read()
  dependencyManagerTypescript = re.sub(r"(_toBeDownloadedLtexLsTag: string =\n *').*?(';\n)",
      rf"\g<1>{ltexLsTag}\g<2>", dependencyManagerTypescript)
  dependencyManagerTypescript = re.sub(r"(_toBeDownloadedLtexLsVersion: string =\n *').*?(';\n)",
      rf"\g<1>{ltexLsVersion}\g<2>", dependencyManagerTypescript)
  dependencyManagerTypescript = re.sub(
      r"(_toBeDownloadedLtexLsHashDigests: \{\[fileName: string\]: string\} = \{\n).*?(  \};\n)",
      fr"\g<1>{hashDigestsTypescript}\g<2>", dependencyManagerTypescript, flags=re.DOTALL)
  with open(dependencyManagerFilePath, "w") as f: f.write(dependencyManagerTypescript)



if __name__ == "__main__":
  main()
