#!/usr/bin/python3

import argparse
import os
import re
import subprocess

def main():
  parser = argparse.ArgumentParser(description="Fetches all supported language codes from "
      "LanguageTool and updates the language-specific parts of package.json and README.md "
      "accordingly")
  parser.add_argument("--ltex-ls-path",
      default="../../ltex-ls/build/install/ltex-ls-4.9.999-alpha.1",
      help="path to ltex-ls")
  args = parser.parse_args()

  toolsDirPath = os.path.dirname(os.path.abspath(__file__))
  ltexPath = os.path.join(toolsDirPath, "..")
  ltexLsPath = os.path.join(toolsDirPath, args.ltex_ls_path)

  print("Fetching languages from LanguageTool...")
  classPath = os.pathsep.join([toolsDirPath, os.path.join(ltexLsPath, "lib", "*")])
  process = subprocess.run(["java", "-cp", classPath,
      os.path.join(toolsDirPath, "LanguageToolLanguageLister.java")], stdout=subprocess.PIPE)
  languages = sorted([dict(zip(("languageShortCode", "languageName"), line.split(";")))
      for line in process.stdout.decode().splitlines()], key=lambda x: x["languageShortCode"])
  assert len(languages) > 0, "No languages found."
  print("Languages: {}".format(", ".join([x["languageShortCode"] for x in languages])))

  packageJsonTemplate = """
        "ltex.languageSettings.{languageShortCode}.dictionary": {{
          "type": "array",
          "scope": "resource",
          "default": [],
          "markdownDescription": "List of additional `{languageShortCode}` ({languageName}) words that should not be counted as spelling errors.",
          "description": "List of additional \\"{languageShortCode}\\" ({languageName}) words that should not be counted as spelling errors."
        }},
        "ltex.{languageShortCode}.dictionary": {{
          "type": "array",
          "scope": "resource",
          "default": [],
          "markdownDeprecationMessage": "**Deprecated:** This setting has been renamed to `ltex.languageSettings.{languageShortCode}.dictionary`.",
          "deprecationMessage": "Deprecated: This setting has been renamed to \\"ltex.languageSettings.{languageShortCode}.dictionary\\"."
        }},
        "ltex.languageSettings.{languageShortCode}.disabledRules": {{
          "type": "array",
          "scope": "resource",
          "default": [],
          "markdownDescription": "List of `{languageShortCode}` ({languageName}) rules that should be disabled (if enabled by default by LanguageTool).",
          "description": "List of additional \\"{languageShortCode}\\" ({languageName}) rules that should be disabled (if enabled by default by LanguageTool)."
        }},
        "ltex.{languageShortCode}.disabledRules": {{
          "type": "array",
          "scope": "resource",
          "default": [],
          "markdownDeprecationMessage": "**Deprecated:** This setting has been renamed to `ltex.languageSettings.{languageShortCode}.disabledRules`.",
          "deprecationMessage": "Deprecated: This setting has been renamed to \\"ltex.languageSettings.{languageShortCode}.disabledRules\\"."
        }},
        "ltex.languageSettings.{languageShortCode}.enabledRules": {{
          "type": "array",
          "scope": "resource",
          "default": [],
          "markdownDescription": "List of `{languageShortCode}` ({languageName}) rules that should be enabled (if disabled by default by LanguageTool).",
          "description": "List of additional \\"{languageShortCode}\\" ({languageName}) rules that should be enabled (if disabled by default by LanguageTool)."
        }},
        "ltex.{languageShortCode}.enabledRules": {{
          "type": "array",
          "scope": "resource",
          "default": [],
          "markdownDeprecationMessage": "**Deprecated:** This setting has been renamed to `ltex.languageSettings.{languageShortCode}.enabledRules`.",
          "deprecationMessage": "Deprecated: This setting has been renamed to \\"ltex.languageSettings.{languageShortCode}.enabledRules\\"."
        }},
"""

  print("Updating package.json...")
  packageJsonPath = os.path.join(ltexPath, "package.json")
  with open(packageJsonPath, "r") as f: packageJson = f.read()

  replacement = ("          \"enum\": [\n            {}\n          ],\n"
      "          \"enumDescriptions\": [\n            {}\n          ],\n").format(
      ",\n            ".join(["\"{languageShortCode}\"".format(**x) for x in languages]),
      ",\n            ".join(["\"{languageName}\"".format(**x) for x in languages]))
  packageJson = re.sub(r"(\"ltex.language\":.*?\"default\": \"en-US\",\n)"
      r"(          \"enum\": \[\n.*?\n          ],\n"
      r"          \"enumDescriptions\": \[\n.*?          ],\n)*",
      r"\1{}".format(replacement), packageJson, flags=re.DOTALL)

  replacement = "{}\n".format("\n".join([packageJsonTemplate.strip("\n").format(**x)
      for x in languages]))
  packageJson = re.sub(r"(\n        \"ltex\.language\": \{\n.*?\n        },\n)"
      r"(        \"ltex\.languageSettings\..*?\n        },\n)*",
      r"\1{}".format(replacement), packageJson, flags=re.DOTALL)

  with open(packageJsonPath, "w") as f: f.write(packageJson)

  print("Updating README.md...")
  readmeMdPath = os.path.join(ltexPath, "README.md")
  with open(readmeMdPath, "r") as f: readmeMd = f.read()

  replacement = "Possible values: {}".format(", ".join([
      "`{languageShortCode}` ({languageName}{remark})".format(**x,
      remark=(", default" if x["languageShortCode"] == "en-US" else "")) for x in languages]))
  readmeMd = re.sub(r"(\n\* `ltex\.language`: .*?\n  \* ).*?\n",
      r"\1{}\n".format(replacement), readmeMd)

  with open(readmeMdPath, "w") as f: f.write(readmeMd)



if __name__ == "__main__":
  main()
