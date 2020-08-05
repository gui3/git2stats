function parse (raw) {
  const parsed = {
    lines: [],
    before: '',
    after: '',
    deleted: false
  }
  const diff = raw.match(/@@ *-(\d+),\d+ *\+(\d+),\d+ *@@[\n\r]?((?:[ +-].*(?:[\n\r]|$)+)+)/)
  //                             1            2           3
  if (!diff) {
    parsed.deleted = true
    return parsed
  }
  let exstart = parseInt(diff[1])
  let newstart = parseInt(diff[2])
  const body = diff[3]
  const lines = body.split('\n').filter(l => l.length > 0)
  lines.forEach(linestr => {
    const change = linestr[0]
    const content = linestr.slice(1)
    let lineBefore = -1
    let lineAfter = -1
    switch (change) {
      case ' ':
        exstart++
        newstart++
        lineBefore = exstart
        lineAfter = newstart
        parsed.before += content + '\n'
        parsed.after += content + '\n'
        break
      case '+':
        newstart++
        lineAfter = newstart
        parsed.after += content + '\n'
        break
      case '-':
        exstart++
        lineBefore = exstart
        parsed.before += content + '\n'
        break
    }
    parsed.lines.push({
      change,
      lineBefore,
      lineAfter,
      content
    })
  })

  return parsed
}

module.exports = parse
