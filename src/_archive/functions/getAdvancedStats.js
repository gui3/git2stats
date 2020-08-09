const sanitizeDir = require('../shared/sanitizeDir')
const setProgress = require('../shared/setProgress')
const logger = require('../shared/logger')
const fetchCommand = require('../shared/fetchCommand')
const parselogstat = require('../shared/parselogstat')
// const getCommitDiffs = require('../advanced/getCommitDiffs')
// const zipCommitDiffs = require('../advanced/zipCommitDiffs')
const getCommitFileDiff = require('../advanced/getCommitFileDiff')
const GitData = require('../classes/GitData')

async function getAdvancedStats (dir, options = { silent: true, maxFileChanges:10000 }) {
  options.dir = sanitizeDir(dir, options)
  options = setProgress(options)
  options = logger(options)
  const data = await fetchCommand('git log --stat', options)
    .then(async data => {
      data = await data.map(chunk => parselogstat(chunk, options))
      for (let ci = 0; ci < data.length; ci++) {
        const commit = data[ci]
        // const diffs = await getCommitDiffs(commit.sha, options)
        // data[ci] = zipCommitDiffs(commit, diffs, options)
        for (let fi = 0; fi < commit.files.length; fi++) {
          const file = commit.files[fi]
          data[ci].files[fi] = await getCommitFileDiff(
            commit.sha,
            file,
            options
          )
        }
      }
      return data
      // return logs2diff(data.map(chunk => parselogstat(chunk, options)), options)
    })
    .catch(err => { console.log(err) })
  options.logger('git2stats -> ' + data.length + ' commits')
  return new GitData(data)
}

module.exports = getAdvancedStats
