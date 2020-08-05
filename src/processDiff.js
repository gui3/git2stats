function process (info, exfile) {
  const file = {
    lines: [],
    contentBefore: '',
    contentAfter: '',
    pathBefore: info.exname,
    pathAfter: info.newname,
    ...exfile
  }

  file.contentBefore += '\n@@ from line ' + info.exstart + ' @@\n'
  file.contentAfter += '\n@@ from line ' + info.newstart + ' @@\n'

  const lines = info.body.split('\n').filter(l => l.length > 0)
  lines.forEach(linestr => {
    const change = linestr[0]
    const content = linestr.slice(1)
    let lineBefore = -1
    let lineAfter = -1
    switch (change) {
      case ' ':
        info.exstart++
        info.newstart++
        lineBefore = info.exstart
        lineAfter = info.newstart
        file.contentBefore += content + '\n'
        file.contentAfter += content + '\n'
        break
      case '+':
        info.newstart++
        lineAfter = info.newstart
        file.contentAfter += content + '\n'
        break
      case '-':
        info.exstart++
        lineBefore = info.exstart
        file.contentBefore += content + '\n'
        break
    }
    file.lines.push({
      change,
      lineBefore,
      lineAfter,
      content
    })
  })

  return file
}

module.exports = process
