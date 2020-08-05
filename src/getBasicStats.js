const fetchCommand = require('./fetchCommand')
const parselogstat = require('./parselogstat')
const sanitizeDir = require('./sanitizeDir')
const setProgress = require('./setProgress')
const logger = require('./logger')

async function getBasicStats (dir, options = { silent: true }) {
  options.dir = sanitizeDir(dir, options)
  options = setProgress(options)
  options = logger(options)
  const data = await fetchCommand('git log --stat', options)
    .then(data => {
      return data.map(chunk => parselogstat(chunk, options))
    })
    .catch(err => { console.log(err) })
  options.logger('git2stats -> ' + data.length + ' commits')
  return data
}

module.exports = getBasicStats
