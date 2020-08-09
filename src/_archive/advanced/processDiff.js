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
    let rowBefore = -1
    let rowAfter = -1
    switch (change) {
      case ' ':
        info.exstart++
        info.newstart++
        rowBefore = info.exstart
        rowAfter = info.newstart
        file.contentBefore += content + '\n'
        file.contentAfter += content + '\n'
        break
      case '+':
        info.newstart++
        rowAfter = info.newstart
        file.contentAfter += content + '\n'
        break
      case '-':
        info.exstart++
        rowBefore = info.exstart
        file.contentBefore += content + '\n'
        break
    }
    file.lines.push({
      change,
      rowBefore,
      rowAfter,
      content
    })
  })

  return file
}

module.exports = process
