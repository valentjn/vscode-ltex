#!/usr/bin/python3

# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import datetime
import json
import os
import traceback
from typing import Any, Callable, Dict, List, Optional, Tuple

import bokeh.embed
import bokeh.plotting
import bokeh.themes
import cartopy
import matplotlib as mpl
mpl.use("Agg")
import matplotlib.pyplot as plt
import numpy as np



repoDirPath = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

if hasattr(datetime.date, "fromisoformat"):
  fromisoformat = datetime.date.fromisoformat
else:
  fromisoformat = (lambda s: datetime.date(int(s[:4]), int(s[5:7]), int(s[8:10])))



def parseDate(s: str) -> datetime.datetime:
  return datetime.datetime.combine(fromisoformat(s), datetime.datetime.min.time())

def formatDate(date: datetime.datetime) -> str:
  return date.date().isoformat()

def formatInt(x: int) -> str:
  return (f"{x:,}" if x >= 10000 else str(x))



def writeToSummaryYaml(data: Dict[str, str]) -> None:
  yamlPath = os.path.join(repoDirPath, "_data", "stats", "summary.yml")
  with open(yamlPath, "w") as f: json.dump(data, f)



def plotStats() -> None:
  statsPath = os.path.join(repoDirPath, "_data", "stats", "stats.json")
  with open(statsPath, "r") as f: stats = json.load(f)

  getUpdateCount: Callable[[datetime.datetime], int] = (
      lambda s: int(stats["statistics"][formatDate(s)]["uc"]))
  statDates = [parseDate(x) for x in stats["statistics"]]
  tomorrow = datetime.datetime.now() + datetime.timedelta(days=1)

  releaseDates: List[datetime.datetime] = []
  updateCounts: List[int] = []
  users: List[float] = []
  normalizedUsers = []
  daysSinceFirstRelease = []

  for releaseDate in list(stats["versions"].values()) + [tomorrow]:
    if not isinstance(releaseDate, datetime.datetime): releaseDate = parseDate(releaseDate)
    feasibleDates = [x for x in statDates
        if (x < releaseDate) and ("uc" in stats["statistics"][formatDate(x)])]
    if len(feasibleDates) == 0: continue
    updateCount = getUpdateCount(max(feasibleDates))

    if len(releaseDates) > 0:
      curUsers = updateCount - updateCounts[-1]
      curNormalizedUsers = np.nan

      if releaseDates[-1] + datetime.timedelta(days=7) <= releaseDate:
        feasibleDates = [x for x in statDates
            if (x < releaseDates[-1] + datetime.timedelta(days=7)) and
            ("uc" in stats["statistics"][formatDate(x)])]

        if len(feasibleDates) > 0:
          curNormalizedUsers = getUpdateCount(max(feasibleDates)) - updateCounts[-1]

      curDaysSinceFirstRelease = (releaseDate - releaseDates[0]).days
    else:
      curUsers = 0
      curNormalizedUsers = 0
      curDaysSinceFirstRelease = 0

    releaseDates.append(releaseDate)
    updateCounts.append(updateCount)
    users.append(curUsers)
    normalizedUsers.append(curNormalizedUsers)
    daysSinceFirstRelease.append(curDaysSinceFirstRelease)

  daysSinceFirstReleaseArray = np.array(daysSinceFirstRelease)
  normalizedUsersArray = np.array(normalizedUsers)
  idx = np.isnan(normalizedUsersArray)
  normalizedUsersArray[idx] = np.interp(daysSinceFirstReleaseArray[idx],
      daysSinceFirstReleaseArray[~idx], normalizedUsersArray[~idx])
  normalizedUsers = list(normalizedUsersArray)

  names = [
        (["s1", "s2"], "stars"),
        ("nu", "normalizedUsers"),
        ("u", "users"),
        ("i", "install"),
        ("uc", "updateCount"),
        ("td", "trendingdaily"),
        ("tw", "trendingweekly"),
        ("tm", "trendingmonthly"),
        ("dc", "downloadCount"),
      ]

  for name in names:
    figure = bokeh.plotting.figure(title=name[1], width=750, height=400, x_axis_type="datetime")

    if name[1] == "normalizedUsers":
      dates = releaseDates
      values = normalizedUsers
    elif name[1] == "users":
      dates = releaseDates
      values = users
    else:
      shortNames = name[0]
      if isinstance(shortNames, str): shortNames = [shortNames]
      dates, values = [], []

      for x, y in stats["statistics"].items():
        value = 0
        skipItem = False

        for shortName in shortNames:
          if shortName not in y:
            skipItem = True
            break

          value += y[shortName]

        if not skipItem:
          dates.append(parseDate(x))
          values.append(value)

    figure.line(dates, values)
    script, divs = bokeh.embed.components(figure,
        theme=bokeh.themes.built_in_themes["dark_minimal"])
    html = script + divs
    htmlPath = os.path.join(repoDirPath, "_includes", "stats", "{}.html".format(name[1]))
    with open(htmlPath, "w") as f: f.write(html)

  lastStatEntry = list(stats["statistics"].values())[-1]

  averageRating = lastStatEntry["ar"]
  averageRating = round(2 * averageRating) / 2
  numberOfFullRatingStars = int(averageRating)
  numberOfHalfRatingStars = int(2 * (averageRating - numberOfFullRatingStars))
  numberOfEmptyRatingStars = 5 - numberOfFullRatingStars - numberOfHalfRatingStars
  averageRatingHtml = (
      (numberOfFullRatingStars * "<i class=\"fa fa-star\" aria-hidden=\"true\"></i>") +
      (numberOfHalfRatingStars * "<i class=\"fa fa-star-half-o\" aria-hidden=\"true\"></i>") +
      (numberOfEmptyRatingStars * "<i class=\"fa fa-star-o\" aria-hidden=\"true\"></i>"))

  numberOfStars = lastStatEntry["s1"] + lastStatEntry["s2"]
  numberOfUsers = int(max([x for x in users[-5:] if x is not None]) if len(users) > 0 else 0)

  writeToSummaryYaml({
        "stars" : formatInt(numberOfStars),
        "users" : formatInt(numberOfUsers),
        "installs" : formatInt(lastStatEntry["i"]),
        "averageRating" : averageRatingHtml,
        "numberOfRatings" : formatInt(lastStatEntry["rc"]),
      })



def plotMap() -> None:
  mapPath = os.path.join(repoDirPath, "_data", "stats", "map.json")
  with open(mapPath, "r") as f: map_ = json.load(f)

  fig = plt.figure(figsize=(14, 7))
  ax = fig.add_subplot(1, 1, 1, projection=cartopy.crs.Robinson())

  ax.set_global()
  ax.stock_img()
  ax.coastlines(alpha=0.3)
  ax.spines["geo"].set_edgecolor("#0000004c")

  for child in ax.get_children():
    if isinstance(child, mpl.image.AxesImage): child.set_alpha(0.5)

  stargazers = sorted(list(set((stargazer["lon"], stargazer["lat"])
      for repoName in ["vscode-ltex", "ltex-ls"]
      for stargazer in map_["stargazers"][repoName].values()
      if stargazer is not None)))

  for stargazer in stargazers:
    ax.plot(stargazer[0], stargazer[1], ".", color="#8888ff", mec="#5555ff", ms=14,
        transform=cartopy.crs.PlateCarree())

  ax.set_facecolor("none")

  try:
    plt.savefig(os.path.join(repoDirPath, "images", "stats", "map.png"),
        facecolor="none", bbox_inches="tight")
  except Exception:
    print("Could not save map, because the following exception occurred:")
    print(traceback.format_exc())



def main() -> None:
  plotStats()
  plotMap()



if __name__ == "__main__":
  main()
