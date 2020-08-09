const processDiff = require('./processDiff')

function parse (raw) {
  // console.log('RAW LENGTH: ' + raw.split('\n').length)
  const regexp =
    /(?:diff --git a\/(.*) b\/(.*)(?:[\n\r](?!diff --git).*[\n\r]?)+?)?@@ *-(\d+),\d+ *\+(\d+),\d+ *@@[\n\r]?((?:[ +-].*(?:[\n\r]|$)+)+)/g
    //                 1         2                                            3            4                 5
  // const matches = raw.matchAll(regex)

  const diffs = {}
  let match
  let exname
  let newname
  let diff = {}
  while ((match = regexp.exec(raw)) !== null) {
    // match = match.value
    if (match[1] || match[2]) {
      exname = match[1]
      newname = match[2]
      diff = {}
    }
    // console.log('ex:' + exname + ' new:' + newname)
    const exstart = parseInt(match[3]) - 1
    const newstart = parseInt(match[4]) - 1
    const body = match[5]
    diff = processDiff({ exname, newname, exstart, newstart, body }, diff)
    diffs[diff.pathAfter] = diff
  }
  diff.exists = true
  return diffs
}

module.exports = parse
