const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml') // you need to npm install this !!!
// NOT provided in this package (tests only)

const git2stats = require('../src/index')

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
