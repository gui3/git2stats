const fetchCommand = require('../shared/fetchCommand')
const parseDiffs = require('./parseDiffs')

async function getCommitDiffs (sha, rawFile, options) {
  if (rawFile.changes < options.maxFileChanges) {
    const raws = await fetchCommand(
      'git show ' + sha + ' -- ' + rawFile.path,
      options
    )
      .catch(err => console.log(err))

    const foundFilesDict = parseDiffs(raws.join(''))
    // console.log(Object.keys(foundFilesDict).length + ' files found')
    rawFile.diff = foundFilesDict[rawFile.path] || { exists: false }
  } else {
    options.logger('file ' + rawFile.path + 'has too much changes\n' +
      '  on commit ' + sha + '\n' +
      '  ' + rawFile.changes + 'changes in file,\n' +
      '  options.maxFileChanges = ' + options.maxFileChanges + '\n' +
      '  to get this file\'s data, set a higher option.maxFileChanges'
    )
  }
  return rawFile
}

module.exports = getCommitDiffs
