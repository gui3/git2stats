const processDiff = require('./processDiff')

function parse (raw) {
  const regex =
    /(?:diff --git a\/(.+) *b\/(.+)(?:.|[\r\n])*?)?@@ *-(\d+),\d+ *\+(\d+),\d+ *@@[\n\r]?((?:[ +-].*(?:[\n\r]|$)+)+)/g
    //                 1         2                       3            4                 5
  const matches = raw.matchAll(regex)

  const files = {}
  let match
  let exname
  let newname
  let file = {}
  while (!(match = matches.next()).done) {
    match = match.value
    if (match[1]) {
      exname = match[1]
      newname = match[2]
      file = {}
    }
    const exstart = parseInt(match[3]) - 1
    const newstart = parseInt(match[4]) - 1
    const body = match[5]
    file = processDiff({ exname, newname, exstart, newstart, body }, file)
    files[file.pathAfter] = file
  }
  return files
}

module.exports = parse
