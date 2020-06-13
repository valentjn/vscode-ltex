#!/usr/bin/python

import datetime
import json
import os
import re
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request

repoDirPath = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
oldPrint = print
print = (lambda *args, **kwargs: oldPrint(*args, **kwargs, flush=True))



def updateStats():
  statsPath = os.path.join(repoDirPath, "_data", "stats", "stats.json")

  if os.path.exists(statsPath):
    with open(statsPath, "r") as f: stats = json.load(f)
  else:
    stats = {}

  process = subprocess.run(["vsce", "show", "--json", "valentjn.vscode-ltex"],
      stdout=subprocess.PIPE)
  vsceStats = json.loads(process.stdout.decode())

  today = datetime.date.today().isoformat()
  if "statistics" not in stats: stats["statistics"] = {}
  if today not in stats["statistics"]: stats["statistics"][today] = {}

  shortNames = {
        "install" : "i",
        "averagerating" : "ar",
        "ratingcount" : "rc",
        "trendingdaily" : "td",
        "trendingmonthly" : "tm",
        "trendingweekly" : "tw",
        "updateCount" : "uc",
        "weightedRating" : "wr",
      }

  for entry in vsceStats["statistics"]:
    shortName = shortNames[entry["statisticName"]]
    value = entry["value"]
    if isinstance(value, float): value = float("{:.4g}".format(value))
    stats["statistics"][today][shortName] = value

  if "versions" not in stats: stats["versions"] = {}

  for entry in vsceStats["versions"][::-1]:
    stats["versions"][entry["version"]] = datetime.datetime.strptime(entry["lastUpdated"],
        "%Y-%m-%dT%H:%M:%S.%fZ").date().isoformat()

  with open(statsPath, "w") as f: json.dump(stats, f, separators=(",", ":"))



def requestJson(url, headers={}):
  headers = {b"User-Agent" : b"vscode-ltex-stats", **headers}
  request = urllib.request.Request(url, headers=headers)

  try:
    with urllib.request.urlopen(request) as response: data = response.read().decode()
  except urllib.error.HTTPError as e:
    raise RuntimeError(f"Request to '{url}' failed with status code {e.code}, "
        f"reason '{e.reason}', and body '{e.read().decode()}'")

  return {"data" : json.loads(data), "response" : response}

def requestGitHub(url):
  headers = {b"Accept" : b"application/vnd.github.v3+json"}
  gitHubOauthToken = os.environ.get("GITHUB_OAUTH_TOKEN", "")
  if len(gitHubOauthToken) > 0: headers[b"Authorization"] = f"token {gitHubOauthToken}".encode()
  response = requestJson(url, headers)
  linkHeader = response["response"].getheader("Link", b"")
  links = re.findall(r"<(.*?)>; rel=\"(.*?)\"", linkHeader)
  links = dict((y, x) for x, y in links)
  return {"data" : response["data"], "links" : links}

def getLastPage(url):
  response = requestGitHub(url)
  return (requestGitHub(response["links"]["last"]) if "last" in response["links"] else response)

def addUserToStargazers(stargazers, userName, url):
  print(f"Adding user '{userName}' to stargazers...")
  gitHubResponse = requestGitHub(url)
  location = gitHubResponse["data"]["location"]

  createOsmUrl = (lambda x: "https://nominatim.openstreetmap.org/search?q={}&format=json".format(
      urllib.parse.quote_plus(x)))
  roundCoordinate = (lambda x: round(float(x), 3))

  for fieldName in ["location", "company"]:
    fieldValue = gitHubResponse["data"][fieldName]
    if (fieldValue is None) or (len(fieldValue) < 2): continue
    time.sleep(1)
    osmResponse = requestJson(createOsmUrl(fieldValue))
    data = osmResponse["data"]

    if len(data) > 0:
      stargazers[userName] = {
            "lat" : roundCoordinate(data[0]["lat"]),
            "lon" : roundCoordinate(data[0]["lon"]),
          }
      return

  stargazers[userName] = None

def updateStargazersWithPage(oldStargazers, newStargazers, response):
  for entry in response["data"][::-1]:
    if entry["type"] != "User": continue
    userName = entry["login"]
    if userName in oldStargazers: return False
    addUserToStargazers(newStargazers, userName, entry["url"])

  return True

def updateMap():
  mapPath = os.path.join(repoDirPath, "_data", "stats", "map.json")

  if os.path.exists(mapPath):
    with open(mapPath, "r") as f: map_ = json.load(f)
  else:
    map_ = {}

  if "stargazers" not in map_: map_["stargazers"] = {}

  oldStargazers = map_["stargazers"]
  newStargazers = {}
  response = getLastPage("https://api.github.com/repos/valentjn/vscode-ltex/stargazers")

  while (updateStargazersWithPage(oldStargazers, newStargazers, response) and
        ("prev" in response["links"])):
    response = requestGitHub(response["links"]["prev"])

  print(f"Adding {len(newStargazers)} stargazers to map...")
  for x, y in list(newStargazers.items())[::-1]: map_["stargazers"][x] = y

  with open(mapPath, "w") as f: json.dump(map_, f, separators=(",", ":"))



def main():
  updateStats()
  updateMap()



if __name__ == "__main__":
  main()
