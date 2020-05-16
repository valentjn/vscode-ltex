#!/usr/bin/python

import json
import os
import sys

import semver

def main():
  ltexRootDirPath = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
  with open(os.path.join(ltexRootDirPath, "package.json"), "r") as f: packageJson = json.load(f)
  ltexVersion = semver.VersionInfo.parse(packageJson["version"])
  print("1" if ltexVersion.prerelease is not None else "0", end="")

if __name__ == "__main__":
  main()
