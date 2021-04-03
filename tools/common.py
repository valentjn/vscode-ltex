#!/usr/bin/python3

# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import json
import os
import re
import sys
import traceback
from typing import Any
import urllib.parse
import urllib.request



repoDirPath = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

with open(os.path.join(repoDirPath, "src", "DependencyManager.ts"), "r") as f:
  dependencyManagerTypescript = f.read()

matches = re.findall(r"_toBeDownloadedJavaVersion: string = '(.*?)';",
    dependencyManagerTypescript)
assert len(matches) == 1
toBeDownloadedJavaVersion = matches[0]

matches = re.findall(r"_toBeDownloadedLtexLsVersion: string = '(.*?)';",
    dependencyManagerTypescript)
assert len(matches) == 1
toBeDownloadedLtexLsVersion = matches[0]

del dependencyManagerTypescript
del f
del matches



def requestFromGitHub(url: str, decodeAsJson: bool = True) -> Any:
  headers = {}

  if "LTEX_GITHUB_OAUTH_TOKEN" in os.environ:
    print("Setting GitHub OAuth token...")
    headers["Authorization"] = "token {}".format(os.environ["LTEX_GITHUB_OAUTH_TOKEN"])
  else:
    print("LTEX_GITHUB_OAUTH_TOKEN not set.")

  apiRequest = urllib.request.Request(url, headers=headers)

  try:
    with urllib.request.urlopen(apiRequest) as f: response = f.read()
  except urllib.error.HTTPError as e:
    traceback.print_exc()
    print("Response body: \"{!r}\"".format(e.read()))
    sys.exit(1)

  if decodeAsJson: response = json.loads(response)
  return response
