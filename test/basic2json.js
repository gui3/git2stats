const path = require('path')
const fs = require('fs')
const git2stats = require('../src/index.js')

const output = path.resolve(__dirname, 'basicOutput.json')

git2stats.getBasicStats(path.resolve(__dirname, '../'), { silent: false })
  .then(data => {
    fs.writeFile(
      output,
      JSON.stringify(data, null, 2),
      'utf-8',
      (err) => err && console.error(err) // if error log error
    )
  })
  .catch(err => console.error(err))
