#!/usr/bin/python3

# Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import argparse
import json
import os
import pathlib
import re
import sys
from typing import Any, Callable, Dict, List, Tuple, Union

sys.path.append(str(pathlib.Path(__file__).parent))
import common

allTargets = ["coc.nvim", "vscode"]



def setInListOrDict(x: Union[List[Any], Dict[str, Any]], key: str, value: str) -> None:
  if isinstance(x, list):
    if key not in x: x.append(key)
  else:
    x[key] = value

def deleteFromListOrDict(x: Union[List[Any], Dict[str, Any]], key: str) -> None:
  if isinstance(x, list):
    if key in x: x.remove(key)
  else:
    if key in x: del x[key]

def sortDict(d: Dict[str, Any]) -> None:
  key: Callable[[Tuple[str, Any]], str] = lambda x: x[0]
  items = sorted(list(d.items()), key=key)
  d.clear()
  d.update(items)

def moveFromDictToDict(sourceDict: Dict[str, Any], targetDict: Dict[str, Any],
      keys: List[str]) -> List[str]:
  for dependency in keys:
    targetDict[dependency] = sourceDict[dependency]
    deleteFromListOrDict(sourceDict, dependency)

  return keys



def patchPackageJson(newTarget: str) -> str:
  packageJsonFilePath = common.repoDirPath.joinpath("package.json")
  print(f"Patching '{packageJsonFilePath}'...")
  with open(packageJsonFilePath, "r") as f: packageJson: Dict[str, Any] = json.load(f)

  ltexAdditionalInformation: Dict[str, Any] = packageJson["ltexAdditionalInformation"]
  oldTarget: str = ltexAdditionalInformation["currentTarget"]
  if oldTarget == newTarget: return oldTarget
  ltexAdditionalInformation["currentTarget"] = newTarget

  packageJson.setdefault("devDependencies", {})
  packageJson.setdefault("dependencies", {})

  for target in allTargets:
    if target == newTarget: continue
    ltexAdditionalInformation["targetChanges"].setdefault(target, {})

  movedDevDependencies = moveFromDictToDict(
      packageJson["devDependencies"], packageJson["dependencies"],
      ltexAdditionalInformation["targetChanges"][newTarget].get(
        "moveFromDevDependenciesToDependencies", []))

  for (changeKey, changeValue) in ltexAdditionalInformation["targetChanges"][newTarget].items():
    if changeKey in ["moveFromDependenciesToDevDependencies",
          "moveFromDevDependenciesToDependencies"]:
      continue

    for target in allTargets:
      if target == newTarget: continue
      ltexAdditionalInformation["targetChanges"][target].setdefault(changeKey, {})

    if isinstance(changeValue, str):
      for target in allTargets:
        if target == newTarget: continue
        ltexAdditionalInformation["targetChanges"][target][changeKey] = packageJson[changeKey]

      packageJson[changeKey] = changeValue
    elif isinstance(changeValue, dict):
      for key, value in changeValue.items():
        for target in allTargets:
          if target == newTarget: continue
          targetChanges = ltexAdditionalInformation["targetChanges"][target][changeKey]

          if key not in targetChanges:
            if isinstance(packageJson[changeKey], list):
              targetChanges[key] = ("+" if key in packageJson[changeKey] else "-")
            else:
              targetChanges[key] = packageJson[changeKey].get(key, "-")

          if value == targetChanges[key]: deleteFromListOrDict(targetChanges, key)

        if value == "-":
          deleteFromListOrDict(packageJson[changeKey], key)
        else:
          setInListOrDict(packageJson[changeKey], key, value)
    else:
      raise RuntimeError(f"Unsupported value type '{type(changeValue)}'")

  movedDependencies = moveFromDictToDict(
      packageJson["dependencies"], packageJson["devDependencies"],
      ltexAdditionalInformation["targetChanges"][newTarget].get(
        "moveFromDependenciesToDevDependencies", []))

  for devDependency in list(movedDevDependencies):
    if devDependency not in packageJson["dependencies"]: movedDevDependencies.remove(devDependency)

  for dependency in list(movedDependencies):
    if dependency not in packageJson["devDependencies"]: movedDependencies.remove(dependency)

  for target in allTargets:
    if target == newTarget: continue

    if len(movedDevDependencies) > 0:
      ltexAdditionalInformation["targetChanges"][target] \
          ["moveFromDependenciesToDevDependencies"] = movedDevDependencies

    if len(movedDependencies) > 0:
      ltexAdditionalInformation["targetChanges"][target] \
          ["moveFromDevDependenciesToDependencies"] = movedDependencies

  sortDict(packageJson["devDependencies"])
  sortDict(packageJson["dependencies"])
  if len(packageJson["devDependencies"]) == 0: deleteFromListOrDict(packageJson, "devDependencies")
  if len(packageJson["dependencies"]) == 0: deleteFromListOrDict(packageJson, "dependencies")

  deleteFromListOrDict(ltexAdditionalInformation["targetChanges"], newTarget)

  deleteFromListOrDict(packageJson, "ltexAdditionalInformation")
  packageJson["ltexAdditionalInformation"] = ltexAdditionalInformation

  with open(packageJsonFilePath, "w") as f:
    json.dump(packageJson, f, indent=2, ensure_ascii=False)
    f.write("\n")

  return oldTarget



def patchSourceFiles(sourceDirPath: pathlib.Path, oldTarget: str, newTarget: str) -> None:
  assert sourceDirPath.is_dir(), f"'{sourceDirPath}' is not a directory"

  for rootDirPathStr, dirPathStrs, filePathStrs in os.walk(sourceDirPath):
    dirPathStrs.sort()
    filePathStrs.sort()

    for filePathStr in filePathStrs:
      patchSourceFile(pathlib.Path(rootDirPathStr, filePathStr), oldTarget, newTarget)



def patchSourceFile(sourceFilePath: pathlib.Path, oldTarget: str, newTarget: str) -> None:
  print(f"Patching '{sourceFilePath}'...")

  with open(sourceFilePath, "r") as f: sourceLines = f.read().split("\n")

  if sourceFilePath.suffix == ".md":
    lineCommentStart = r"<!-- "
    lineCommentEnd = r" -->"
  elif sourceFilePath.suffix == ".ts":
    lineCommentStart = r"// "
    lineCommentEnd = r""
  else:
    raise RuntimeError(f"Unknown source file suffix '{sourceFilePath.suffix}'")

  ifElseIfLineRegex = (r"^[ \t]*" + re.escape(lineCommentStart)
      + r"#(?:else)?if TARGET == '(.*?)'" + re.escape(lineCommentEnd) + r"$")
  endIfLineRegex = (r"^[ \t]*" + re.escape(lineCommentStart) + r"#endif"
      + re.escape(lineCommentEnd) + r"$")
  commentLineRegex = ("^([ \t]*)(?:" + re.escape(lineCommentStart) + r"(.*)"
      + re.escape(lineCommentEnd) + r"|" + re.escape(lineCommentStart.rstrip()) + ")$")

  blockTarget = None
  newSourceLines = []

  for sourceLine in sourceLines:
    newSourceLine = sourceLine

    if ((regexMatch := re.match(ifElseIfLineRegex, sourceLine)) is not None):
      blockTarget = regexMatch.group(1)
    elif re.match(endIfLineRegex, sourceLine) is not None:
      blockTarget = None
    elif len(sourceLine) > 0:
      if oldTarget != blockTarget == newTarget:
        regexMatch = re.match(commentLineRegex, sourceLine)
        assert regexMatch is not None
        commentedSourceLine = regexMatch.group(2)
        newSourceLine = (regexMatch.group(1) + commentedSourceLine
            if commentedSourceLine is not None else "")
      elif oldTarget == blockTarget != newTarget:
        regexMatch = re.match("^([ \t]*)(.*)$", sourceLine)
        assert regexMatch is not None
        newSourceLine = (regexMatch.group(1) + lineCommentStart + regexMatch.group(2)
            + lineCommentEnd).rstrip()

    newSourceLines.append(newSourceLine)

  with open(sourceFilePath, "w") as f: f.write("\n".join(newSourceLines))



def patchForTarget(target: str) -> None:
  oldTarget = patchPackageJson(target)
  patchSourceFile(common.repoDirPath.joinpath("README.md"), oldTarget, target)
  patchSourceFiles(common.repoDirPath.joinpath("src"), oldTarget, target)
  patchSourceFiles(common.repoDirPath.joinpath("test"), oldTarget, target)



def main() -> None:
  parser = argparse.ArgumentParser(
      description="Patch package.json and source files for specific build target")
  parser.add_argument("--target", choices=allTargets, default="coc.nvim",
      help="Build target to patch files for")
  args = parser.parse_args()
  patchForTarget(args.target)



if __name__ == "__main__":
  main()
