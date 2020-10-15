#!/usr/bin/python3

# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import os
import re

repoDirPath = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

with open(os.path.join(repoDirPath, "src", "DependencyManager.ts"), "r") as f:
  dependencyManagerTypescript = f.read()

matches = re.findall(r"_toBeDownloadedJavaVersion: string = '(.*?)';",
    dependencyManagerTypescript)
assert len(matches) == 1
toBeDownloadedJavaVersion = matches[0]

del dependencyManagerTypescript
del f
del matches
