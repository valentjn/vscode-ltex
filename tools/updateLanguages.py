#!/usr/bin/python3

# Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import argparse
import glob
import json
import os
import pathlib
import re
import shlex
import subprocess
import sys
from typing import Any, Dict, Sequence, Tuple

sys.path.append(str(pathlib.Path(__file__).parent))
import common



toolsDirPath = common.repoDirPath.joinpath("tools")



def run(cmd: Sequence[str], **kwargs: Any) -> subprocess.CompletedProcess[bytes]:
  print("Running {}...".format(" ".join(shlex.quote(x) for x in cmd)))
  return subprocess.run(cmd, stdout=subprocess.PIPE, cwd=toolsDirPath)

def fetchLanguages(toolsDirPath: pathlib.Path,
      ltexLsPath: pathlib.Path) -> Tuple[Sequence[str], Sequence[str]]:
  classPath = os.pathsep.join([str(toolsDirPath), str(ltexLsPath.joinpath("lib", "*"))])
  run(["javac", "-cp", classPath, "LanguageToolLanguageLister.java"])
  process = run(["java", "-cp", classPath, "LanguageToolLanguageLister"])
  stdout = process.stdout.decode()
  languages = sorted([dict(zip(("languageShortCode", "languageName"), line.split(";")))
        for line in stdout.splitlines()]
      + [{
        "languageShortCode" : "auto",
        "languageName" : "Automatic language detection (not recommended)",
      }], key=lambda x: x["languageShortCode"])
  ltLanguageShortCodes = [x["languageShortCode"] for x in languages]
  ltLanguageNames = [x["languageName"] for x in languages]
  return ltLanguageShortCodes, ltLanguageNames



def updatePackageJson(ltLanguageShortCodes: Sequence[str]) -> None:
  packageJsonPath = common.repoDirPath.joinpath("package.json")
  with open(packageJsonPath, "r") as f: packageJson = json.load(f)
  settings = packageJson["contributes"]["configuration"]["properties"]

  for settingName in ["ltex.language", "ltex.additionalRules.motherTongue"]:
    curLtLanguageShortCodes = list(ltLanguageShortCodes)

    if settingName == "ltex.additionalRules.motherTongue":
      curLtLanguageShortCodes.insert(0, "")
      curLtLanguageShortCodes.remove("auto")

    settings[settingName]["enum"] = curLtLanguageShortCodes
    settings[settingName]["markdownEnumDescriptions"] = [
        f"%ltex.i18n.configuration.{settingName}.{x if len(x) > 0 else 'emptyString'}."
        "markdownEnumDescription%"
        for x in curLtLanguageShortCodes]
    settings[settingName]["enumDescriptions"] = [
        f"%ltex.i18n.configuration.{settingName}.{x if len(x) > 0 else 'emptyString'}."
        "enumDescription%"
        for x in curLtLanguageShortCodes]

  for settingName in ["ltex.dictionary", "ltex.disabledRules", "ltex.enabledRules",
        "ltex.hiddenFalsePositives"]:
    settings[settingName]["propertyNames"] = {
          "type": "string",
          "enum": ltLanguageShortCodes,
        }
    settings[settingName]["properties"] = {
          languageShortCode: {
            "type" : "array",
            "items" : {
              "type" : "string",
            },
            "markdownDescription" : f"%ltex.i18n.configuration.{settingName}."
              f"{languageShortCode}.markdownDescription%",
          }
          for languageShortCode in ltLanguageShortCodes
        }

  with open(packageJsonPath, "w") as f:
    json.dump(packageJson, f, indent=2, ensure_ascii=False)
    f.write("\n")



def updatePackageNlsJson(ltLanguageShortCodes: Sequence[str], ltLanguageNames: Sequence[str],
      uiLanguage: str) -> None:
  packageNlsJsonPath = common.repoDirPath.joinpath("package.nls.json" if uiLanguage == "en" else
      f"package.nls.{uiLanguage}.json")
  with open(packageNlsJsonPath, "r") as f: oldPackageNlsJson = json.load(f)

  newPackageNlsJson = {}

  for key, value in oldPackageNlsJson.items():
    if key == "ltex.i18n.configuration.ltex.language.fullMarkdownDescription":
      newPackageNlsJson[key] = value

      for ltLanguageShortCode, ltLanguageName in zip(ltLanguageShortCodes, ltLanguageNames):
        prefix = f"ltex.i18n.configuration.ltex.language.{ltLanguageShortCode}"
        newPackageNlsJson[f"{prefix}.markdownEnumDescription"] = ltLanguageName
        newPackageNlsJson[f"{prefix}.enumDescription"] = ltLanguageName

    elif re.match(r"^ltex\.i18n\.configuration\.ltex\.language\..+\.", key) is not None:
      continue

    elif key == "ltex.i18n.configuration.ltex.dictionary.fullMarkdownDescription":
      newPackageNlsJson[key] = value

      for ltLanguageShortCode, ltLanguageName in zip(ltLanguageShortCodes, ltLanguageNames):
        prefix = f"ltex.i18n.configuration.ltex.dictionary.{ltLanguageShortCode}"

        if uiLanguage == "de":
          newPackageNlsJson[f"{prefix}.markdownDescription"] = (
              "Liste von zusätzlichen Wörtern der Sprache "
              f"`{ltLanguageShortCode}` ({ltLanguageName}), die nicht als Schreibfehler "
              "gewertet werden sollen.")
        else:
          newPackageNlsJson[f"{prefix}.markdownDescription"] = (
              f"List of additional `{ltLanguageShortCode}` ({ltLanguageName}) words that should "
              "not be counted as spelling errors.")

    elif re.match(r"^ltex\.i18n\.configuration\.ltex\.dictionary\..+\.", key) is not None:
      continue

    elif key == "ltex.i18n.configuration.ltex.disabledRules.fullMarkdownDescription":
      newPackageNlsJson[key] = value

      for ltLanguageShortCode, ltLanguageName in zip(ltLanguageShortCodes, ltLanguageNames):
        prefix = f"ltex.i18n.configuration.ltex.disabledRules.{ltLanguageShortCode}"

        if uiLanguage == "de":
          newPackageNlsJson[f"{prefix}.markdownDescription"] = (
              "Liste von zusätzlichen Regeln der Sprache "
              f"`{ltLanguageShortCode}` ({ltLanguageName}), die deaktiviert werden sollen "
              "(falls standardmäßig durch LanguageTool aktiviert).")
        else:
          newPackageNlsJson[f"{prefix}.markdownDescription"] = (
              f"List of additional `{ltLanguageShortCode}` ({ltLanguageName}) rules that should "
              "be disabled (if enabled by default by LanguageTool).")

    elif re.match(r"^ltex\.i18n\.configuration\.ltex\.disabledRules\..+\.", key) is not None:
      continue

    elif key == "ltex.i18n.configuration.ltex.enabledRules.fullMarkdownDescription":
      newPackageNlsJson[key] = value

      for ltLanguageShortCode, ltLanguageName in zip(ltLanguageShortCodes, ltLanguageNames):
        prefix = f"ltex.i18n.configuration.ltex.enabledRules.{ltLanguageShortCode}"

        if uiLanguage == "de":
          newPackageNlsJson[f"{prefix}.markdownDescription"] = (
              "Liste von zusätzlichen Regeln der Sprache "
              f"`{ltLanguageShortCode}` ({ltLanguageName}), die aktiviert werden sollen "
              "(falls standardmäßig durch LanguageTool deaktiviert).")
        else:
          newPackageNlsJson[f"{prefix}.markdownDescription"] = (
              f"List of additional `{ltLanguageShortCode}` ({ltLanguageName}) rules that should "
              "be enabled (if disabled by default by LanguageTool).")

    elif re.match(r"^ltex\.i18n\.configuration\.ltex\.enabledRules\..+\.", key) is not None:
      continue

    elif key == "ltex.i18n.configuration.ltex.hiddenFalsePositives.fullMarkdownDescription":
      newPackageNlsJson[key] = value

      for ltLanguageShortCode, ltLanguageName in zip(ltLanguageShortCodes, ltLanguageNames):
        prefix = f"ltex.i18n.configuration.ltex.hiddenFalsePositives.{ltLanguageShortCode}"

        if uiLanguage == "de":
          newPackageNlsJson[f"{prefix}.markdownDescription"] = (
              "Liste von falschen Fehlern der Sprache "
              f"`{ltLanguageShortCode}` ({ltLanguageName}), die verborgen werden sollen.")
        else:
          newPackageNlsJson[f"{prefix}.markdownDescription"] = (
              f"List of `{ltLanguageShortCode}` ({ltLanguageName}) false-positive diagnostics to hide.")

    elif re.match(r"^ltex\.i18n\.configuration\.ltex\.hiddenFalsePositives\..+\.", key) is not None:
      continue

    elif key == "ltex.i18n.configuration.ltex.additionalRules.motherTongue.markdownDescription":
      newPackageNlsJson[key] = value

      prefix = f"ltex.i18n.configuration.ltex.additionalRules.motherTongue.emptyString"

      if uiLanguage == "de":
        newPackageNlsJson[f"{prefix}.markdownEnumDescription"] = "Keine Muttersprache"
        newPackageNlsJson[f"{prefix}.enumDescription"] = "Keine Muttersprache"
      else:
        newPackageNlsJson[f"{prefix}.markdownEnumDescription"] = "No mother tongue"
        newPackageNlsJson[f"{prefix}.enumDescription"] = "No mother tongue"

      for ltLanguageShortCode, ltLanguageName in zip(ltLanguageShortCodes, ltLanguageNames):
        if ltLanguageShortCode == "auto": continue
        prefix = f"ltex.i18n.configuration.ltex.additionalRules.motherTongue.{ltLanguageShortCode}"
        newPackageNlsJson[f"{prefix}.markdownEnumDescription"] = ltLanguageName
        newPackageNlsJson[f"{prefix}.enumDescription"] = ltLanguageName

    elif re.match(r"^ltex\.i18n\.configuration\.ltex\.additionalRules.motherTongue\..+\.",
          key) is not None:
      continue

    else:
      newPackageNlsJson[key] = value

  with open(packageNlsJsonPath, "w") as f:
    json.dump(newPackageNlsJson, f, indent=2, ensure_ascii=False)
    f.write("\n")



def main() -> None:
  parser = argparse.ArgumentParser(description="Fetch all supported language codes from "
      "LanguageTool and updates the language-specific parts of package.json accordingly")
  parser.add_argument("--ltex-ls-path", type=pathlib.Path,
      default=pathlib.Path(__file__).parent.parent.parent.joinpath(
        "ltex-ls", "target", "appassembler"),
      help="Path to ltex-ls relative from the root directory of LTeX, supports wildcards")
  args = parser.parse_args()

  ltexLsPaths = glob.glob(str(common.repoDirPath.joinpath(args.ltex_ls_path)))
  assert len(ltexLsPaths) > 0, "ltex-ls not found"
  assert len(ltexLsPaths) < 2, "multiple ltex-ls found via wildcard"
  ltexLsPath = pathlib.Path(ltexLsPaths[0])
  print(f"Using ltex-ls from {ltexLsPath}")

  print("Fetching languages from LanguageTool...")
  ltLanguageShortCodes, ltLanguageNames = fetchLanguages(toolsDirPath, ltexLsPath)
  assert len(ltLanguageShortCodes) > 0, "No languages found."
  print("LanguageTool languages: {}".format(", ".join(ltLanguageShortCodes)))

  print("Updating package.json...")
  updatePackageJson(ltLanguageShortCodes)

  print("Updating package.nls.json...")
  updatePackageNlsJson(ltLanguageShortCodes, ltLanguageNames, "en")

  for childPath in sorted(common.repoDirPath.iterdir()):
    match = re.match(r"^package\.nls\.([A-Za-z0-9\-_]+)\.json$", childPath.name)
    if match is None: continue
    uiLanguage = match.group(1)
    print(f"Updating package.nls.{uiLanguage}.json...")
    updatePackageNlsJson(ltLanguageShortCodes, ltLanguageNames, uiLanguage)



if __name__ == "__main__":
  main()
