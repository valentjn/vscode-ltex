#!/usr/bin/python3

import ast
import base64
import json
import os
import pathlib
import re
import sys
from typing import Any, List

import jsonschema

sys.path.append(str(pathlib.Path(__file__).parent))
import common



packageJsonFilePath = common.repoDirPath.joinpath("package.json")
with open(packageJsonFilePath, "r") as f: packageJson = json.load(f)



def getJsonSchemaFromVsCodeGitHub(typeScriptPath: str, regex: re.Pattern[str]) -> Any:
  response = common.requestFromGitHub(
      f"https://api.github.com/repos/microsoft/vscode/contents/{typeScriptPath}")
  assert(response["encoding"] == "base64")
  configurationExtensionPointJavaScript = base64.b64decode(response["content"]).decode()

  regexMatch = regex.search(configurationExtensionPointJavaScript)
  assert regexMatch is not None
  string = regexMatch.group(1)

  string = re.sub(r"^([ \t]*)([$A-Za-z]+):", r'\1"\2":', string, flags=re.MULTILINE)
  string = string.replace("[{ body: {", "[{ \"body\": {")
  string = string.replace("{ command: ", "{ \"command\": ")
  string = string.replace("{ title: '', properties: {} }", "{ \"title\": '', \"properties\": {} }")

  string = re.sub(r"^([ \t]*)\"([$A-Za-z]+)\": false(,)?$", r'\1"\2": False\3', string,
      flags=re.MULTILINE)
  string = re.sub(r"^([ \t]*)\"([$A-Za-z]+)\": true(,)?$", r'\1"\2": True\3', string,
      flags=re.MULTILINE)

  stringRegex = r"(?:'.*?'|\".*?\"|`.*?`)"
  string = re.sub(rf"(?:nls\.)?localize\({stringRegex}, ({stringRegex})(?:, {stringRegex})*\)",
      lambda x: f'"{x.group(1)[1:-1]}"', string)
  jsonSchema = ast.literal_eval(string)

  return jsonSchema



def validatePackageJsonWithSchema() -> None:
  print("Validating package.json with schema from JSON Schema Store...")

  packageJsonSchemaFilePath = common.repoDirPath.joinpath("schemas", "package.schema.json")
  with open(packageJsonSchemaFilePath, "r") as f: packageJsonSchema = json.load(f)
  jsonschema.validate(packageJson, packageJsonSchema)



def validatePackageJsonWalkthroughsWithSchema() -> None:
  print("Validating package.json walkthroughs with schema from VS Code...")

  jsonSchema = getJsonSchemaFromVsCodeGitHub(
      "src/vs/workbench/contrib/welcome/gettingStarted/browser/gettingStartedExtensionPoint.ts",
      re.compile(r"const walkthroughsExtensionPoint.* = (?s:.*?^\tjsonSchema: (\{.*?^\t\}))",
        flags=re.MULTILINE))
  jsonschema.validate(packageJson["contributes"]["walkthroughs"], jsonSchema)



def validatePackageJsonConfigurationWithSchema() -> None:
  print("Validating package.json configuration with schema from VS Code...")

  configurationEntrySchema = getJsonSchemaFromVsCodeGitHub(
      "src/vs/workbench/api/common/configurationExtensionPoint.ts",
      re.compile(r"const configurationEntrySchema.* = (?s:(\{.*?^\}))",
        flags=re.MULTILINE))
  configurationSchema = {
		"description" : "Contributes configuration settings.",
		"oneOf" : [
			configurationEntrySchema,
			{
				"type" : "array",
				"items" : configurationEntrySchema,
			},
		],
  }

  jsonschema.validate(packageJson["contributes"]["configuration"], configurationSchema)



def validatePackageJsonConfigurationWithCustomConstraints() -> None:
  print("Validating package.json configuration with custom constraints...")

  for settingName, setting in packageJson["contributes"]["configuration"]["properties"].items():
    try:
      jsonschema.validate(setting["default"], setting)
      for example in setting.get("examples", []): jsonschema.validate(example, setting)

      assert "markdownDescription" in setting
      validateSetting(setting)
    except:
      print("")
      print(f"Could not validate '{settingName}'!")
      raise



def validateSetting(setting: Any) -> None:
  if isinstance(setting, list):
    for entry in setting: validateSetting(entry)
    return
  elif not isinstance(setting, dict):
    return

  if "enum" in setting:
    assert len(setting["markdownEnumDescriptions"]) == len(setting["enum"])
    assert len(setting["enumDescriptions"]) == len(setting["enum"])

  if setting.get("type", None) == "object":
    assert setting["additionalProperties"] == False

  for key, value in setting.items():
    if key == "propertyNames": continue
    validateSetting(value)



def validatePackageNlsJson() -> None:
  usedNlsKeys = getUsedNlsKeysFromPackageNlsJson(packageJson)

  for childPath in common.repoDirPath.iterdir():
    if not childPath.is_file(): continue
    regexMatch = re.match(r"^package\.nls(\..+)?\.json$", childPath.name)
    if regexMatch is None: continue

    print(f"Validating {childPath.name}...")
    with open(childPath, "r") as f: packageNlsJson = json.load(f)

    for nlsKey in sorted(list(packageNlsJson)):
      if nlsKey.endswith(".fullMarkdownDescription"): continue
      assert nlsKey in usedNlsKeys, f"NLS key '{nlsKey}' is defined, but unused"

    for nlsKey in usedNlsKeys:
      assert nlsKey in packageNlsJson, f"NLS key '{nlsKey}' is used, but undefined"



def getUsedNlsKeysFromPackageNlsJson(setting: Any) -> List[str]:
  usedNlsKeys = []

  if isinstance(setting, list):
    for entry in setting: usedNlsKeys.extend(getUsedNlsKeysFromPackageNlsJson(entry))
  elif isinstance(setting, dict):
    for value in setting.values(): usedNlsKeys.extend(getUsedNlsKeysFromPackageNlsJson(value))
  elif isinstance(setting, str):
    if setting.startswith("%") and setting.endswith("%"): usedNlsKeys.append(setting[1 : -1])

  return sorted(list(set(usedNlsKeys)))



def validateMessagesNlsJson() -> None:
  usedNlsKeys = getUsedNlsKeysFromTypeScript()

  for childPath in common.repoDirPath.joinpath("i18n").iterdir():
    if not childPath.is_file(): continue
    regexMatch = re.match(r"^messages\.nls(\..+)?\.json$", childPath.name)
    if regexMatch is None: continue

    print(f"Validating {childPath.name}...")
    with open(childPath, "r") as f: messagesNlsJson = json.load(f)

    for nlsKey in sorted(list(messagesNlsJson)):
      assert nlsKey in usedNlsKeys, f"NLS key '{nlsKey}' is defined, but unused"

    previousNlsKey = None

    for nlsKey in messagesNlsJson:
      if previousNlsKey is None:
        previousNlsKey = nlsKey
      else:
        assert nlsKey > previousNlsKey, \
            f"NLS key '{previousNlsKey}' should come after NLS key '{nlsKey}', but comes before"

    if childPath.name == "messages.nls.json":
      for nlsKey in usedNlsKeys:
        assert nlsKey in messagesNlsJson, f"NLS key '{nlsKey}' is used, but undefined"



def getUsedNlsKeysFromTypeScript() -> List[str]:
  usedNlsKeys = []

  for rootPathString, dirNames, fileNames in os.walk(common.repoDirPath.joinpath("src")):
    rootPath = pathlib.Path(rootPathString)
    dirNames.sort()
    fileNames.sort()

    for fileName in fileNames:
      filePath = rootPath.joinpath(fileName)
      with open(filePath, "r") as f: typeScript = f.read()
      usedNlsKeys.extend(re.findall("i18n\('(.*?)'", typeScript))

  return sorted(list(set(usedNlsKeys)))



def main() -> None:
  validatePackageJsonWithSchema()
  validatePackageJsonWalkthroughsWithSchema()
  validatePackageJsonConfigurationWithSchema()
  validatePackageJsonConfigurationWithCustomConstraints()
  validatePackageNlsJson()
  validateMessagesNlsJson()



if __name__ == "__main__":
  main()
