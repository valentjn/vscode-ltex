#!/usr/bin/python3

# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import argparse
import json
import os
import platform
import re
import shlex
import shutil
import subprocess
import sys
import tarfile
import urllib.error
import urllib.parse
import urllib.request
import zipfile

import semver

sys.path.append(os.path.dirname(__file__))
import common



libDirPath = os.path.join(common.repoDirPath, "lib")

# to get proper logs with CI services
oldPrint = print
print = (lambda *args, **kwargs: oldPrint(*args, **kwargs, flush=True))



def cleanLibDir():
  cmd = ["git", "-C", common.repoDirPath, "clean", "-f", "-x", libDirPath]
  print("Cleaning lib/ by running '{}'...".format(" ".join(shlex.quote(x) for x in cmd)))
  subprocess.run(cmd)



def getLtexVersion():
  with open(os.path.join(common.repoDirPath, "package.json"), "r") as f: packageJson = json.load(f)
  return semver.VersionInfo.parse(packageJson["version"])



def downloadLtexLs():
  dependencyManagerFilePath = os.path.join(common.repoDirPath, "src", "DependencyManager.ts")
  with open(dependencyManagerFilePath, "r") as f: dependencyManagerTypescript = f.read()
  ltexLsVersion = re.search(r"(?:_toBeDownloadedLtexLsVersion: string = ')(.*?)(?:';\n)",
      dependencyManagerTypescript).group(1)

  ltexLsUrl = ("https://github.com/valentjn/ltex-ls/releases/download/"
      f"{ltexLsVersion}/ltex-ls-{ltexLsVersion}.tar.gz")
  ltexLsArchivePath = os.path.join(libDirPath, f"ltex-ls-{ltexLsVersion}.tar.gz")
  print(f"Downloading ltex-ls {ltexLsVersion} from '{ltexLsUrl}' to '{ltexLsArchivePath}'...")
  urllib.request.urlretrieve(ltexLsUrl, ltexLsArchivePath)

  extractLtexLs(ltexLsArchivePath)

  print("Removing ltex-ls archive...")
  os.remove(ltexLsArchivePath)

def extractLtexLs(ltexLsArchivePath):
  print("Extracting ltex-ls archive...")
  with tarfile.open(ltexLsArchivePath, "r:gz") as f: f.extractall(path=libDirPath)



def removeJava():
  path = os.path.join(libDirPath, f"jdk-{common.toBeDownloadedJavaVersion}-jre")

  if os.path.isdir(path):
    print(f"Removing old Java directory '{path}'...")
    shutil.rmtree(path)

  path = os.path.join(libDirPath, f"._jdk-{common.toBeDownloadedJavaVersion}-jre")

  if os.path.isfile(path):
    print(f"Removing old Java file '{path}'...")
    os.remove(path)

def downloadJava(platform, arch):
  javaArchiveType = ("zip" if platform == "windows" else "tar.gz")
  javaArchiveName = (f"OpenJDK11U-jre_{arch}_{platform}_hotspot_"
      f"{common.toBeDownloadedJavaVersion.replace('+', '_')}.{javaArchiveType}")

  javaUrl = ("https://github.com/AdoptOpenJDK/openjdk11-binaries/releases/download/"
      f"jdk-{urllib.parse.quote_plus(common.toBeDownloadedJavaVersion)}/{javaArchiveName}")
  javaArchivePath = os.path.join(libDirPath, javaArchiveName)
  print(f"Downloading Java from '{javaUrl}' to '{javaArchivePath}'...")
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
    packageName = f"vscode-ltex-{ltexVersion}.vsix"
  else:
    packageName = f"vscode-ltex-{ltexVersion}-offline-{ltexPlatform}-{ltexArch}.vsix"

  assert re.match(r"^[\-\.0-9A-Z_a-z]+$", packageName) is not None
  cmd = f"vsce package -o \"{packageName}\""
  print(f"Creating package by running '{cmd}'...")
  subprocess.run(cmd, shell=True)



def main():
  parser = argparse.ArgumentParser(description="Build offline packages of LTeX")
  parser.add_argument("--current-system", action="store_true",
      help="Build offline package only for current platform/architecture")
  parser.add_argument("--ltex-ls-path", metavar="PATH",
      help="Don't download ltex-ls from GitHub, but use *.tar.gz archive from this path")
  args = parser.parse_args()

  if args.current_system:
    ltexPlatform = {
          "Linux" : "linux",
          "Darwin" : "mac",
          "Windows" : "windows",
        }[platform.system()]
    ltexArch = {
          "AMD64" : "x64",
          "x86_64" : "x64",
        }[platform.machine()]
    ltexPlatformArchs = [(ltexPlatform, ltexArch)]
  else:
    ltexPlatformArchs = [("linux", "x64"), ("mac", "x64"), ("windows", "x64")]

  ltexLsArchivePath = args.ltex_ls_path
  cleanLibDir()

  for ltexPlatform, ltexArch in ltexPlatformArchs:
    print("")
    print(f"Processing platform '{ltexPlatform}' and architecture '{ltexArch}'...")

    if ltexLsArchivePath is None:
      downloadLtexLs()
    else:
      extractLtexLs(ltexLsArchivePath)

    downloadJava(ltexPlatform, ltexArch)
    createPackage(ltexPlatform, ltexArch)
    cleanLibDir()



if __name__ == "__main__":
  main()
