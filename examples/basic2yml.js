const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml') // you need to npm install this !!!
// NOT provided in this package (tests only)

const git2stats = require('../src/index')

const output = 'basicOutput.yml'

git2stats.getBasicStats(path.resolve(__dirname, '../'), { silent: false })
  .then(data => {
    fs.writeFile(
      output,
      yaml.safeDump(data), // to turn your object into yaml
      'utf-8',
      (err) => err && console.error(err)
    )
  })
  .catch(err => console.error(err))
