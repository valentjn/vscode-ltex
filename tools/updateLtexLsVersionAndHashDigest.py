#!/usr/bin/python3

# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import argparse
import hashlib
import os
import re
import sys
import urllib.parse

import semver

sys.path.append(os.path.dirname(__file__))
import common



def getLatestLtexLsVersion(versions, allowPrerelease=False):
  latestVersion = None

  for version in versions:
    if semver.VersionInfo.isvalid(version):
      version = semver.VersionInfo.parse(version)

      if ((allowPrerelease or (version.prerelease is None)) and
            ((latestVersion is None) or (version > latestVersion))):
        latestVersion = version

  return latestVersion



def main():
  parser = argparse.ArgumentParser(description="Update version and hash digest of LTeX LS")
  parser.add_argument("--allow-prerelease", action="store_true",
      help="Allow prerelease versions")
  args = parser.parse_args()

  print("Retrieving list of releases of LTeX LS...")
  releases = common.requestFromGitHub("https://api.github.com/repos/valentjn/ltex-ls/releases")
  ltexLsVersion = getLatestLtexLsVersion([x["tag_name"] for x in releases],
      allowPrerelease=args.allow_prerelease)
  ltexLsVersion = str(ltexLsVersion)

  print(f"Downloading LTeX LS {ltexLsVersion}...")
  ltexLsUrl = ("https://github.com/valentjn/ltex-ls/releases/download/"
      f"{urllib.parse.quote_plus(ltexLsVersion)}/"
      f"ltex-ls-{urllib.parse.quote_plus(ltexLsVersion)}.tar.gz")
  response = common.requestFromGitHub(ltexLsUrl, decodeAsJson=False)

  print("Computing hash digest...")
  ltexLsHashDigest = hashlib.sha256(response).hexdigest()
  print(f"Hash digest is '{ltexLsHashDigest}'.")

  print("Writing version and hash digest to 'src/DependencyManager.ts'...")
  dependencyManagerFilePath = os.path.join(common.repoDirPath, "src", "DependencyManager.ts")
  with open(dependencyManagerFilePath, "r") as f: dependencyManagerTypescript = f.read()
  dependencyManagerTypescript = re.sub(r"(_toBeDownloadedLtexLsVersion: string = ').*?(';\n)",
      rf"\g<1>{ltexLsVersion}\g<2>", dependencyManagerTypescript)
  dependencyManagerTypescript = re.sub(
      r"(_toBeDownloadedLtexLsHashDigest: string =\n *').*?(';\n)",
      fr"\g<1>{ltexLsHashDigest}\g<2>", dependencyManagerTypescript)
  with open(dependencyManagerFilePath, "w") as f: f.write(dependencyManagerTypescript)



if __name__ == "__main__":
  main()
