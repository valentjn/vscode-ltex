#!/usr/bin/python

# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import argparse
import json
import os
import platform
import shlex
import shutil
import subprocess
import sys
import tarfile
import traceback
import urllib.error
import urllib.parse
import urllib.request
import zipfile

import semver



ltexRootDirPath = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
libDirPath = os.path.join(ltexRootDirPath, "lib")
javaVersion = "11.0.8+10"

# to get proper logs in Travis CI
oldPrint = print
print = (lambda *args, **kwargs: oldPrint(*args, **kwargs, flush=True))



def cleanLibDir():
  cmd = ["git", "-C", ltexRootDirPath, "clean", "-f", "-x", libDirPath]
  print("Cleaning lib/ by running '{}'...".format(" ".join(shlex.quote(x) for x in cmd)))
  subprocess.run(cmd)



def getLtexVersion():
  with open(os.path.join(ltexRootDirPath, "package.json"), "r") as f: packageJson = json.load(f)
  return semver.VersionInfo.parse(packageJson["version"])

def getLatestCompatibleLtexLsVersion(versions):
  ltexVersion = getLtexVersion()
  latestVersion = None

  for version in versions:
    if semver.VersionInfo.isvalid(version):
      version = semver.VersionInfo.parse(version)

      if (version <= ltexVersion) and ((latestVersion is None) or (version > latestVersion)):
        latestVersion = version

  return latestVersion

def downloadLtexLs():
  releasesUrl = "https://api.github.com/repos/valentjn/ltex-ls/releases"
  headers = {}

  if "LTEX_GITHUB_OAUTH_TOKEN" in os.environ:
    print("Setting GitHub OAuth token...")
    headers["Authorization"] = "token {}".format(os.environ["LTEX_GITHUB_OAUTH_TOKEN"])
  else:
    print("LTEX_GITHUB_OAUTH_TOKEN not set.")

  print("Fetching list of ltex-ls releases from '{}'...".format(releasesUrl))
  apiRequest = urllib.request.Request(releasesUrl, headers=headers)

  try:
    with urllib.request.urlopen(apiRequest) as f: releases = json.load(f)
  except urllib.error.HTTPError as e:
    traceback.print_exc()
    print("Response body: \"{}\"".format(e.read()))
    sys.exit(1)

  ltexLsVersion = getLatestCompatibleLtexLsVersion([x["tag_name"] for x in releases])
  print("Latest compatible release is 'ltex-ls-{}'.".format(ltexLsVersion))

  ltexLsUrl = ("https://github.com/valentjn/ltex-ls/releases/download/"
      "{0}/ltex-ls-{0}.tar.gz").format(ltexLsVersion)
  ltexLsArchivePath = os.path.join(libDirPath, "ltex-ls-{}.tar.gz".format(ltexLsVersion))
  print("Downloading ltex-ls from '{}' to '{}'...".format(ltexLsUrl, ltexLsArchivePath))
  urllib.request.urlretrieve(ltexLsUrl, ltexLsArchivePath)

  ltexLsArchivePath(ltexLsArchivePath)

  print("Removing ltex-ls archive...")
  os.remove(ltexLsArchivePath)

def extractLtexLs(ltexLsArchivePath):
  print("Extracting ltex-ls archive...")
  with tarfile.open(ltexLsArchivePath, "r:gz") as f: f.extractall(path=libDirPath)



def removeJava():
  path = os.path.join(libDirPath, "jdk-{}-jre".format(javaVersion))

  if os.path.isdir(path):
    print("Removing old Java directory '{}'...".format(path))
    shutil.rmtree(path)

  path = os.path.join(libDirPath, "._jdk-{}-jre".format(javaVersion))

  if os.path.isfile(path):
    print("Removing old Java file '{}'...".format(path))
    os.remove(path)

def downloadJava(platform, arch):
  javaArchiveType = ("zip" if platform == "windows" else "tar.gz")
  javaArchiveName = "OpenJDK11U-jre_{}_{}_hotspot_{}.{}".format(
      arch, platform, javaVersion.replace("+", "_"), javaArchiveType)

  javaUrl = ("https://github.com/AdoptOpenJDK/openjdk11-binaries/releases/download/"
      "jdk-{}/{}").format(urllib.parse.quote_plus(javaVersion), javaArchiveName)
  javaArchivePath = os.path.join(libDirPath, javaArchiveName)
  print("Downloading Java from '{}' to '{}'...".format(javaUrl, javaArchivePath))
  urllib.request.urlretrieve(javaUrl, javaArchivePath)
  print("Extracting Java archive...")

  if javaArchiveType == "zip":
    with zipfile.ZipFile(javaArchivePath, "r") as f: f.extractall(path=libDirPath)
  else:
    with tarfile.open(javaArchivePath, "r:gz") as f: f.extractall(path=libDirPath)

  print("Removing Java archive...")
  os.remove(javaArchivePath)



def createPackage(ltexPlatform=None, ltexArch=None):
  ltexVersion = getLtexVersion()

  if ltexPlatform is None:
    packageName = "vscode-ltex-{}.vsix".format(ltexVersion)
  else:
    packageName = "vscode-ltex-{}-offline-{}-{}.vsix".format(ltexVersion, ltexPlatform, ltexArch)

  cmd = ["vsce", "package", "-o", packageName]
  print("Creating package by running '{}'...".format(" ".join(shlex.quote(x) for x in cmd)))
  subprocess.run(cmd)



def main():
  parser = argparse.ArgumentParser(description="build offline packages of LTeX")
  parser.add_argument("--current-system", action="store_true",
      help="build offline package only for current platform/architecture")
  parser.add_argument("--ltex-ls-path", metavar="PATH",
      help="don't download ltex-ls from GitHub, but use *.tar.gz archive from this path")
  args = parser.parse_args()

  if args.current_system:
    ltexPlatform = {
          "Linux" : "linux",
          "Darwin" : "mac",
          "Windows" : "windows",
        }[platform.system()]
    ltexArch = {
          "x86_64" : "x64",
        }[platform.machine()]
    ltexPlatformArchs = [(ltexPlatform, ltexArch)]
  else:
    ltexPlatformArchs = [("linux", "x64"), ("mac", "x64"), ("windows", "x64")]

  ltexLsArchivePath = args.ltex_ls_path
  cleanLibDir()

  for ltexPlatform, ltexArch in ltexPlatformArchs:
    print("")
    print("Processing platform '{}' and architecture '{}'...".format(ltexPlatform, ltexArch))

    if ltexLsArchivePath is None:
      downloadLtexLs()
    else:
      extractLtexLs(ltexLsArchivePath)

    downloadJava(ltexPlatform, ltexArch)
    createPackage(ltexPlatform, ltexArch)
    cleanLibDir()



if __name__ == "__main__":
  main()
