# git2stats

a lightweight parser for `git log --stat` with 0 dependencies

> parses git logs into a complete serializable javascript object -
> gives changes/files/commits

## install

```
npm install git2stats
```

## use

use it in your project like this

```js
const git2stats = require('git2stats')

git2stats('C:/path/to/your/git/repository')
  .then(data => {
    // your magik goes here
    console.log(data)
  })
  .catch(err => console.error(err))

```

to save git stats in a **JSON** file :

```js
const path = require('path')
const fs = require('fs')

const git2stats = require('git2stats')

const output = 'gitstats.json'

git2stats(path.resolve(__dirname, '../')) // resolve your own path
  .then(data => {
    fs.writeFile(
      output,
      JSON.stringify(data, null, 2),
      'utf-8',
      (err) => err && console.error(err) // if error log error
    )
  })
  .catch(err => console.error(err))

```

OR to save them in **YAML** file (*much more readable and lightweight*)

```js
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml') // you need to npm install this

const git2stats = require('git2stats')

const output = 'gitstats.yml'

git2stats(path.resolve(__dirname, '../')) // resolve your own path again
  .then(data => {
    fs.writeFile(
      output,
      yaml.safeDump(data), // to turn your object into yaml
      'utf-8',
      (err) => err && console.error(err)
    )
  })
  .catch(err => console.error(err))
```

## sample of the output

(in json)
```json
{
  "sha": "970c30f71c1c9db891e46e39dce4c3ad5a598af7",
  "branches": [
    ""
  ],
  "author": {
    "alias": "gui3",
    "email": "gui.silvent@gmail.com"
  },
  "date": {
    "origin": "Tue Aug 4 22:46:00 2020 +0200",
    "epoch": 1596573960000,
    "iso": "2020-08-04T20:46:00.000Z"
  },
  "message": "v0.0.1 ready to use, setup cli",
  "files": [
    {
      "path": "bin/cli.js",
      "bin": false,
      "changes": 4,
      "insertionRatio": 1,
      "deletionRatio": 2,
      "name": "cli.js"
    },
    {
      "path": "package-lock.json",
      "bin": false,
      "changes": 5,
      "insertionRatio": 4,
      "deletionRatio": 0,
      "name": "package-lock.json"
    },

    ...

  ],
  "insertions": 125,
  "deletions": 0,
  "_raw": "commit 970c30f71c1c9db891e46e39dce4c3ad5a598af7\nAuthor: gui3 <gui.silvent@gmail.com>\nDate:   Tue Aug 4 22:46:00 2020 +0200\n\n    v0.0.1 ready to use, setup cli\n\n bin/cli.js                |  4 +--\n package-lock.json         |  5 ++++\n src/fetchCommand.js       | 32 +++++++++++++++++++++++\n src/index.js              | 18 ++++++++++---\n src/parse.js              | 65 +++++++++++++++++++++++++++++++++++++++++++++++\n src/utils/fetchCommand.js | 25 ------------------\n src/utils/parse.js        |  0\n test/autoTest.js          |  6 +++++\n 8 files changed, 125 insertions(+), 30 deletions(-)\n"
}

```

(in yaml)

```yml
- sha: 8622a211ea359454c72090b3bbf3a3aae2a67325
  branches:
    - ''
  author:
    alias: gui3
    email: gui.silvent@gmail.com
  date:
    origin: 'Tue Aug 4 20:15:51 2020 +0200'
    epoch: 1596564951000
    iso: '2020-08-04T18:15:51.000Z'
  message: I N I T I A L setup some cli logic and fetchCommand function
  files:
    - path: README.md
      bin: false
      changes: 4
      insertionRatio: 3
      deletionRatio: 1
      name: README.md
    - path: bin/cli.js
      bin: false
      changes: 4
      insertionRatio: 4
      deletionRatio: 0
      name: cli.js
    - path: src/index.js
      bin: false
      changes: 6
      insertionRatio: 6
      deletionRatio: 0
      name: index.js
    ...
  insertions: 70
  deletions: 1
  _raw: |

    commit 8622a211ea359454c72090b3bbf3a3aae2a67325
    Author: gui3 <gui.silvent@gmail.com>
    Date:   Tue Aug 4 20:15:51 2020 +0200

        I N I T I A L setup some cli logic and fetchCommand function

     README.md                 |  4 +++-
     bin/cli.js                |  4 ++++
     package.json              | 32 ++++++++++++++++++++++++++++++++
     src/index.js              |  6 ++++++
     src/utils/fetchCommand.js | 25 +++++++++++++++++++++++++
     src/utils/parse.js        |  0
     6 files changed, 70 insertions(+), 1 deletion(-)
```

## command-line tool

for fun, this package works also as a command line tool,
but I'm not so shure how you can make it work

Anyway, it only allows you to preview the json data that's extracted...
