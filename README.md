# git2stats

a lightweight parser for `git log --stat` with 0 dependencies.

> parses git logs into a complete serializable javascript object -
> gives changes/files/commits

For now it is not really **branch-aware**,
but the **advanced** mode gathers quite more data than other packages,
including **the lines that have changed and their line number** before/after change.

## install

```
npm install git2stats
```

## use

the git2stats object exposes 2 **asynchronous** functions working similarly,
`git2stats.getBasicStats(path[,options])`
& `git2stats.getAdvancedStats(path[,options])`

to learn more about output data, see nex section *structure of output*

use it in your project like this

```js
const git2stats = require('git2stats')

git2stats
  .getBasicStats('C:/path/to/your/git/repository')
  .then(data => {
    // your magik goes here
    console.log(data)
  })
  .catch(err => console.error(err))

```

### to save git stats in a **JSON** file :

```js
const path = require('path')
const fs = require('fs')

const git2stats = require('git2stats')

const output = 'gitstats.json'

git2stats
  .getAdvancedStats(path.resolve(__dirname, '../')) // resolve your own path
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

### to save them in **YAML** file
(*much more readable and lightweight*)

```js
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml') // you need to npm install this

const git2stats = require('git2stats')

const output = 'gitstats.yml'

git2stats
  .getAdvancedStats(path.resolve(__dirname, '../')) // resolve your own path again
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

## structure of output

you have different (similar, but more complete) output
depending on the function you call

- `.getBasicStats` will not have the `diff` section for files

```js
[                         // array of commits
  {
    "sha": "",            // the sha of the commit
    "branches": []        // branches are not supported for now
    "author": {
      "alias": "",        // author name
      "email": ""         // author email if provided
    },
    "date": {             // date in 3 formats
      "origin": "Wed Aug 5 13:40:57 2020 +0200",
      "epoch": 1596627657000,
      "iso": "2020-08-05T11:40:57.000Z"
    },
    "message": "",        // commit message
    "files": [            // array of files impacted by commit
      {
        "path": "",            // path of file from root
        // BEWARE : can contain {ex => new} if file was moved
        // TODO: handle this
        "bin": false,          // true if file is binary
        "changes": 19,         // total changes
        "insertionRatio": 10,  // the number of green + in git log --stat
        "deletionRatio": 9,    // the number of red - in git log --stat
        "name": "",            // the file's name without the path
        "diff": {              // the changes (if printable, no binary files)
          "lines": [           // array of lines
            {                       // one line
              "change": " ",        // space for unchanged, + for added, - for removed
              "lineBefore": 17,     // the index of this line before
              "lineAfter": 17,      // index after
              "content": ""         // the content of the line (script)
            }
          ], // back to the file
          "contentBefore": "", // a digest of the content of the file before change
          "contentAfter": "",  // content after change
          // (see section about commit.files[i].diff.contentAfter)
          "pathBefore": "",    // the name before
          "pathAfter": "",     // the path after
          // TODO: handle deleted or moved files
        } // end of diff
      } // end of file
    ], // back to commit
    "insertions": 25,     // total insertions of commit
    "deletions": 1,       // total deletions of commit
    "raw": "<raw data excluded>"   
    // if option "includeRaw", includes the git log result
  } // end of commit
] // end of data
```

## samples of output

these samples's key may not be updated,
**please refer to the section above (structure of output)**
for regularly updated info


### .getBasicStats

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


### .getAdvancedStats
(in json)
```js
[                               // array of commits
  {
    "sha": "b02912d40576f4860e4c7cb84ee71c6593b4e295",
    "branches": [              // branches are not supported for now
      ""
    ],
    "author": {
      "alias": "gui3",         // author name
      "email": "gui.silvent@gmail.com"  // author email if provided
    },
    "date": {                  // date in 3 formats
      "origin": "Wed Aug 5 13:40:57 2020 +0200",
      "epoch": 1596627657000,
      "iso": "2020-08-05T11:40:57.000Z"
    },
    "message": "yan testing",  // commit message
    "files": [                 // array of files impacted by commit
      {
        "path": "tests/_drafts/dataLoader.js",  // path of file from root
        "bin": false,          // true if dile is binary
        "changes": 19,         // total changes
        "insertionRatio": 10,  // the number of green + in git log --stat
        "deletionRatio": 9,    // the number of red - in git log --stat
        "name": "dataLoader.js",  // the file's name without the path
        "diff": {              // the changes (if printable, no binary files)
          "lines": [           // array of lines
            {
              "change": " ",   // this line is unchanged (space)
              "lineBefore": 17,
              "lineAfter": 17,
              "content": "function dataLoaderAsync (arg1, arg2) {"
            },
            {
              "change": "-",   // this line was removed (-)
              "lineBefore": 24,
              "lineAfter": -1,
              "content": "  const result = loader('hello', 'world')"
            },
            {
              "change": "+",   // this line was added (+)
              "lineBefore": -1,
              "lineAfter": 24,
              "content": "  const result = loader.get('hello', 'world')"
            }
            // {another line},
            // {another line},
          ],
          "contentBefore": "\n@@ from line 16 @@\nfunction dataLoaderAsync (arg1, arg2) {\n  })\n}\n\nconst loader = multiMemoize(dataLoaderAsync, 60*60*1000)\n\nfunction test (text) {\n  const result = loader('hello', 'world')\n  console.log(text + JSON.stringify(result))\n  result.then(data => console.log(text + ':result:' + data))\n    .catch(err => { throw err })\n\n}\ntest('1:')\ntest('2:')\ntest('3:')\ntest('4:')\n\nsetTimeout(_=> {\n  test('5 +1000:')\n},1000)\n\nsetTimeout(_=> {\n  test('5 +6000:')\n},6000)\n\nsetTimeout(_=> {\n  test('5 +6500:')\n},6500)\n\n/*\nloader.get('hello', 'world')\n",
          "contentAfter": "\n@@ from line 16 @@\nfunction dataLoaderAsync (arg1, arg2) {\n  })\n}\n\nconst loader = multiMemoize(dataLoaderAsync, 60 * 60 * 1000)\n\nfunction test (text) {\n  const result = loader.get('hello', 'world')\n  console.log(text + JSON.stringify(result))\n  result.then(data => console.log(text + ':result:' + data))\n    .catch(err => { throw err })\n}\n\ntest('1:')\ntest('2:')\ntest('3:')\nloader.clean()\ntest('4:')\n\nsetTimeout(_ => {\n  test('5 +1000:')\n}, 1000)\n\nsetTimeout(_ => {\n  test('5 +6000:')\n}, 6000)\n\nsetTimeout(_ => {\n  test('5 +6500:')\n}, 6500)\n\n/*\nloader.get('hello', 'world')\n",
          "nameBefore": "tests/_drafts/dataLoader.js ",
          "nameAfter": "tests/_drafts/dataLoader.js",
          "deleted": false
        }
      }
      // ,{ another file}
      // ,{ another file}
    ],
    "insertions": 25, // total insertions of commit
    "deletions": 1,   // total deletions of commit
    "raw": "<raw data excluded>"   
    // if option "includeRaw", includes the git log result
  },
  // { another commit},
  // { another commit} ...
```


## command-line tool

for fun, this package works also as a command line tool,
you can use it anywhere with npx

```
npx git2stats
```

Anyway, it only allows you to preview the json data that's extracted...
