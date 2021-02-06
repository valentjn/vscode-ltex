#!/usr/bin/python3

# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import shlex
import subprocess
from typing import Any, Callable, Dict, Sequence

oldPrint = print
print: Callable[[str], None] = (lambda *args, **kwargs: oldPrint(*args, **kwargs, flush=True))



def run(cmd: Sequence[str], **kwargs: Any) -> subprocess.CompletedProcess[bytes]:
  print(" ".join(shlex.quote(x) for x in cmd))
  return subprocess.run(cmd, **kwargs)



def main() -> None:
  run(["git", "status"])
  run(["git", "add", "_data/stats/*.yml", "_includes/stats/", "images/stats/"])
  run(["git", "status"])
  hasChanges = (run(["git", "diff-index", "--quiet", "HEAD"], check=False).returncode == 1)

  if not hasChanges:
    print("No differences after adding, exiting.")
    return

  lastCommitMessage = run(["git", "log", "-1", "--pretty=format:%B"],
      stdout=subprocess.PIPE).stdout.decode()
  commitMessage = "Update plotted stats"

  commitCmd = ["git", "commit", "-m", commitMessage]
  if lastCommitMessage == commitMessage: commitCmd.append("--amend")
  run(commitCmd)
  run(["git", "status"])

  run(["git", "push", "-f", "origin", "gh-pages"])



if __name__ == "__main__":
  main()
