const fetchCommand = require('../shared/fetchCommand')
const parselogstat = require('../shared/parselogstat')
const sanitizeDir = require('../shared/sanitizeDir')
const setProgress = require('../shared/setProgress')
const logger = require('../shared/logger')
// const GitData = require('../classes/GitData')

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
