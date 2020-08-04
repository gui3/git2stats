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

## command-line tool

for fun, this package works also as a command line tool,
but I'm not so shure how you can make it work

Anyway, it only allows you to preview the json data that's extracted...
