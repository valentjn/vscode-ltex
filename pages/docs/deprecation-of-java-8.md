---
# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

title: "Deprecation of Java 8"
permalink: "/docs/deprecation-of-java-8.html"
sidebar: "sidebar"
---

Java 8 has been published in 2014 and is approaching its end of life. Fortunately, with Java 11, a new long-term support (LTS) release of Java is available. Therefore, starting November 1, 2020, new versions of LTeX will require Java 11 or newer (in the following: “Java 11+”).

## What Do I Have to Do?

Due to LTeX's feature of automatically downloading Java 11 (via [AdoptOpenJDK](https://adoptopenjdk.net/)) if necessary, the impact on most users will be minimal. The necessary actions you should perform depend on how you used LTeX with Java in the past (substitute “Java 8” with any other version older than Java 11):

* **Scenario:** You already have Java 11+ installed, either system-wide or by using the [`ltex.java.path`](settings.html#ltexjavapath) setting.

  *Necessary actions:* Nothing to do, you're all set!

* **Scenario:** You have Java 8 installed system-wide (e.g., Windows installer, Linux package, etc.).

  *Necessary actions:* You should update your system-wide installation of Java, i.e., remove your old Java installation via the Windows Control Panel or your Linux package manager, and install Java 11+ via Windows installer, Linux package, etc. Otherwise, LTeX will continue to work, but it will download Java 11 to the extension folder after every update of LTeX.

* **Scenario:** You have Java 8 installed in a custom location and you use the [`ltex.java.path`](settings.html#ltexjavapath) setting to point to this location.

  *Necessary actions:* You should update the Java installation of your custom location. Otherwise, LTeX will continue to work, but it will download Java 11 to the extension folder after every update of LTeX. Don't forget to update [`ltex.java.path`](settings.html#ltexjavapath) if the name of the directory of your Java installation included the Java version.

* **Scenario:** You don't have Java installed at all.

  *Necessary actions:* Nothing to do. LTeX should continue to work as it used to do, as LTeX already downloads Java 11 if it fails to find Java on your system. If you want, you can install Java 11+ system-wide on your system to [prevent LTeX from redownloading Java after every update of LTeX](faq.html#how-can-i-prevent-ltex-from-redownloading-ltex-ls-and-java-after-every-update).

If one of the necessary actions includes updating your installation of Java, LTeX recommends AdoptOpenJDK to do so (although there are many more Java distributions). Just go to <https://adoptopenjdk.net/> and click on the blue “Latest release” button, leaving the default settings (OpenJDK 11 (LTS) and HotSpot) as they are.

If you need more choices (e.g., an archive instead of an installer, JRE instead of JDK, or a different platform), click on “Other platforms” instead. As long as you choose a Java version of 11 or newer, you should be good to go. (Note that the JRE suffices for LTeX, but the JDK also works, as the JRE is a subset of the JDK.)

## Details on How LTeX Decides Which Java Installation to Use

Up to the migration deadline mentioned above, LTeX will do the following during startup:

1. Search an installation of Java 11+ on your system (via [`ltex.java.path`](settings.html#ltexjavapath) and/or the environment variable `PATH`).
2. If none can be found, search for Java 11+ in the `lib/` directory of the extension.
3. If none can be found, download Java 11 (via [AdoptOpenJDK](https://adoptopenjdk.net/)) to `lib/` and use that.
4. If that fails somehow (which it shouldn't), repeat steps 1 to 3, this time allowing older Java versions. If one of the steps succeeds, use that Java installation and display a warning message that LTeX will stop working if the user doesn't update Java themselves.

When querying your version of Java with `java -version`, note that Java 8 identifies itself with a version string of the form `1.8.x`, similarly with older Java versions (`1.7.x` is Java 7 and so on). Starting with Java 9, the version string is given as expected (e.g., Java 11 is `11.x`).
