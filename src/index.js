const path = require('path')

const fetchCommand = require('./fetchCommand')
const parse = require('./parse')

async function git2stats (dir, options = { silent: true }) {
  dir = path.resolve(dir)
  !options.silent && console.log('git2stats reading ', dir)
  options.dir = dir
  const data = await fetchCommand('git log --stat', options)
    .then(data => {
      return data.map(chunk => parse(chunk))
    })
    .catch(err => console.error(err))
  return data
}

module.exports = git2stats
