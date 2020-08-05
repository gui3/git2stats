const sanitizeDir = require('./sanitizeDir')
const setProgress = require('./setProgress')
const logger = require('./logger')
const fetchCommand = require('./fetchCommand')
const parselogstat = require('./parselogstat')
const logs2diff = require('./logs2diff')
const getCommitDiffs = require('./getCommitDiffs')
const zipCommitDiffs = require('./zipCommitDiffs')

async function getAdvancedStats (dir, options = { silent: true }) {
  options.dir = sanitizeDir(dir, options)
  options = setProgress(options)
  options = logger(options)
  const data = await fetchCommand('git log --stat', options)
    .then(async data => {
      data = await data.map(chunk => parselogstat(chunk, options))
      for (let i = 0; i < data.length; i++) {
        const commit = data[i]
        const diffs = await getCommitDiffs(commit.sha, options)
        data[i] = zipCommitDiffs(commit, diffs, options)
      }
      return data
      // return logs2diff(data.map(chunk => parselogstat(chunk, options)), options)
    })
    .catch(err => { console.log(err) })
  options.logger('git2stats -> ' + data.length + ' commits')
  return data
}

module.exports = getAdvancedStats
