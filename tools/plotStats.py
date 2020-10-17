#!/usr/bin/python3

# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import datetime
import json
import os
import subprocess
import traceback

import bokeh.io
import bokeh.plotting
import cartopy
import matplotlib as mpl
mpl.use("Agg")
import matplotlib.pyplot as plt
import yaml



repoDirPath = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

if hasattr(datetime.date, "fromisoformat"):
  fromisoformat = datetime.date.fromisoformat
else:
  fromisoformat = (lambda s: datetime.date(int(s[:4]), int(s[5:7]), int(s[8:10])))



def writeToSummaryYaml(key, value):
  yamlPath = os.path.join(repoDirPath, "_data", "stats", "summary.yml")

  if os.path.exists(yamlPath):
    with open(yamlPath, "r") as f: summaryYaml = yaml.load(f, Loader=yaml.SafeLoader)
    if not isinstance(summaryYaml, dict): summaryYaml = {}
  else:
    summaryYaml = {}

  summaryYaml[key] = value
  with open(yamlPath, "w") as f: yaml.dump(summaryYaml, f)



def parseDate(s):
  return datetime.datetime.combine(fromisoformat(s), datetime.datetime.min.time())

def convertDateToString(date):
  return date.date().isoformat()

def plotStats():
  statsPath = os.path.join(repoDirPath, "_data", "stats", "stats.json")
  with open(statsPath, "r") as f: stats = json.load(f)

  getUpdateCount = (lambda s: int(stats["statistics"][convertDateToString(s)]["uc"]))
  statDates = [parseDate(x) for x in stats["statistics"]]
  releaseDates = []
  updateCounts = []
  lastUpdateCount = None

  for version, releaseDate in stats["versions"].items():
    releaseDate = parseDate(releaseDate)
    releaseDates.append(releaseDate)
    feasibleDates = [x for x in statDates if x < releaseDate]

    if len(feasibleDates) > 0:
      updateCount = getUpdateCount(max(feasibleDates))
    else:
      updateCount = None

    updateCounts.append(updateCount)

  updateCounts.append(getUpdateCount(max(statDates)))
  deltaUpdateCounts = [(y - x if (x is not None) and (y is not None) else None)
      for x, y in zip(updateCounts[:-1], updateCounts[1:])]

  keep = [(x is not None) for x in deltaUpdateCounts]
  releaseDates = [x for i, x in enumerate(releaseDates) if keep[i]]
  deltaUpdateCounts = [x for i, x in enumerate(deltaUpdateCounts) if keep[i]]

  names = [
        ("u", "users"),
        ("i", "install"),
        ("uc", "updateCount"),
        ("td", "trendingdaily"),
        ("tw", "trendingweekly"),
        ("tm", "trendingmonthly"),
        ("dc", "downloadCount"),
      ]

  for name in names:
    figure = bokeh.plotting.figure(title=name[1], width=1000, height=500, x_axis_type="datetime")

    if name[1] == "users":
      dates = releaseDates
      values = deltaUpdateCounts
    else:
      statsSubset = [(parseDate(x), y[name[0]])
          for x, y in stats["statistics"].items() if name[0] in y]
      dates, values = list(zip(*statsSubset))

    figure.line(dates, values)
    script, divs = bokeh.embed.components(figure)
    html = script + divs
    htmlPath = os.path.join(repoDirPath, "_includes", "stats", "{}.html".format(name[1]))
    with open(htmlPath, "w") as f: f.write(html)

  lastStatEntry = list(stats["statistics"].values())[-1]
  averageRating = lastStatEntry["ar"]
  averageRating = round(2 * averageRating) / 2
  numberOfFullStars = int(averageRating)
  numberOfHalfStars = int(2 * (averageRating - numberOfFullStars))
  numberOfEmptyStars = 5 - numberOfFullStars - numberOfHalfStars
  averageRatingHtml = ((numberOfFullStars * "<i class=\"fa fa-star\" aria-hidden=\"true\"></i>") +
      (numberOfHalfStars * "<i class=\"fa fa-star-half-o\" aria-hidden=\"true\"></i>") +
      (numberOfEmptyStars * "<i class=\"fa fa-star-o\" aria-hidden=\"true\"></i>"))

  numberOfUsers = (max(deltaUpdateCounts[-5:]) if len(deltaUpdateCounts) > 0 else 0)
  writeToSummaryYaml("users", numberOfUsers)
  writeToSummaryYaml("installs", lastStatEntry["i"])
  writeToSummaryYaml("averageRating", averageRatingHtml)
  writeToSummaryYaml("numberOfRatings", lastStatEntry["rc"])



def plotMap():
  mapPath = os.path.join(repoDirPath, "_data", "stats", "map.json")
  with open(mapPath, "r") as f: map_ = json.load(f)

  fig = plt.figure(figsize=(14, 7))
  ax = fig.add_subplot(1, 1, 1, projection=cartopy.crs.Robinson())

  ax.set_global()
  ax.stock_img()
  ax.coastlines(alpha=0.3)
  ax.outline_patch.set_edgecolor("#0000004c")

  for child in ax.get_children():
    if isinstance(child, mpl.image.AxesImage): child.set_alpha(0.5)

  for stargazer in map_["stargazers"].values():
    if stargazer is None: continue
    ax.plot(stargazer["lon"], stargazer["lat"], ".", color="#8888ff", mec="#5555ff", ms=14,
        transform=cartopy.crs.PlateCarree())

  ax.set_facecolor("none")

  try:
    plt.savefig(os.path.join(repoDirPath, "images", "stats", "map.png"),
        facecolor="none", bbox_inches="tight")
  except Exception:
    print("Could not save map, because the following exception occurred:")
    print(traceback.format_exc())



def main():
  plotStats()
  plotMap()



if __name__ == "__main__":
  main()
