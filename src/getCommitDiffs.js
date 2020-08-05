const fetchCommand = require('./fetchCommand')
const parseDiffs = require('./parseDiffs')

async function getCommitDiffs (sha, options) {
  const data = {
    sha,
    files: {}
  }
  const raws = await fetchCommand('git show ' + sha, options)
    .catch(err => console.log(err))
  data.files = parseDiffs(raws.join(''))
  return data
}

module.exports = getCommitDiffs
