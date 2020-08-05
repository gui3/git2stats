const fetchCommand = require('./fetchCommand')
const parseDiff = require('./parseDiff')

async function logs2diff (data, options) {
  for (let icommit = 0; icommit < data.length; icommit++) {
    const commit = data[icommit]
    for (let ifile = 0; ifile < commit.files.length; ifile++) {
      const file = commit.files[ifile]
      if (file.path.match(/=>/)) {
        const match = file.path.match(/(.*)\{(.+) *=> *(.+)\}(.*)/)
        //                              1     2        3     4
        file.diff = {
          rename: true,
          old: match[1] + match[2] + match[4],
          new: match[1] + match[3] + match[4],
          raw: '<no raw data for filename changes>'
        }
      } else {
        await fetchCommand(
          'git show ' + commit.sha + (' -- ' + file.path),
          options
        )
          .then(chunks => {
            const raw = chunks.join('\n')
            const parsed = parseDiff(raw)
            file.diff = {
              ...parsed,
              raw: options.includeRaw ? raw : '<raw data excluded>'
            }
            return file
          })
          .catch(err => console.log(err))
      }
    }
  }

  return data
}

module.exports = logs2diff
