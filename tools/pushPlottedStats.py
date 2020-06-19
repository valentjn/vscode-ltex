#!/usr/bin/python

import shlex
import subprocess

oldPrint = print
print = (lambda *args, **kwargs: oldPrint(*args, **kwargs, flush=True))



def run(cmd, **kwargs):
  print(" ".join(shlex.quote(x) for x in cmd))
  return subprocess.run(cmd, **kwargs)



def main():
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

  run(["git", "remote", "set-url", "origin", "git@github.com:valentjn/vscode-ltex"])
  run(["git", "push", "-f", "origin", "gh-pages"])



if __name__ == "__main__":
  main()
