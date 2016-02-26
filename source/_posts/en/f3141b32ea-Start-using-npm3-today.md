title: 'Start using npm3 today!'
type: js
lang: en
date: 2016-02-26 12:44:27
tags:
- npm
- tools
---

The version 3 of `npm` has been available for a while, but is not the default version you get when you install node or iojs. There's a dead simple way to use it today!

<!-- more -->

So here's the trick: instead of installing npm 3 system-wide and losing npm 2 (or 1 if you have a legacy setup), you can just install a new package with the `-g` flag, called `npm3`.

It will install the new version in your global npm path and add a new binary called `npm3` in your path. The API and commands are just as same as the other versions, but there's a lot of cool things on version 3!

First of all, the `node_modules` folder is no longer a tree of packages with zillions of nested folders. Now the entire folder is just a flat structure.

Also, progress bars were added, so you can know better what's going on while running a install.

There are several new things in the npm3. But that's for you to discover :)

Go ahead and try it!