function parse (chunk, options = {}) {
  // commit b51f5e30c575c6106422dee60188055bf7829384 (origin/i18n, origin/dev, i18n, dev)
  const commitLn = chunk.match(/commit ([^\s]+) *(?:\((.+)\))?/)
  const sha = (commitLn && commitLn[1]) || '???'
  let branches = (commitLn && commitLn[2]) || ''
  branches = branches.split(', ')
  // Author: gui3 <gui.silvent@gmail.com>
  const authorLn = chunk.match(/Author: *([^\s]+) *(?:<([^\s]+)>)?/)
  const alias = (authorLn && authorLn[1]) || ''
  const email = (authorLn && authorLn[2]) || ''
  const author = {
    alias,
    email
  }
  // Date:   Wed Jun 10 17:40:29 2020 +0200
  const origin = chunk.match(/Date: *(.+)/)[1]
  const d = new Date(origin)
  const iso = d.toISOString() // 2020-08-04T20:57:00.000+0200
  const epoch = d.getTime()
  const date = {
    origin,
    epoch,
    iso
  }
  // src/components/layout/Footer.svelte     | 15 ++++++-----
  // static/images/logos/Node.png            | Bin 0 -> 28922 bytes
  const regexp = // chunk.matchAll(
    /\n(.+)\|(?:(?: *(\d+) *(\+*)(-*))|(?: *(Bin)(?: *(\d+)?.+(\d+)? *bytes)?))?/g
    //   1             2     3     4        5     6       7
  // )
  const files = []
  let match
  while ((match = regexp.exec(chunk)) !== null) {
    // match = match.value
    const bin = match[5] === 'Bin'
    const path = match && match[1].trim()
    // sanitize rename paths {ex => new} ------------------
    // const pathRegex = /(?:\{|^).+ *=> *.+(?:\}|$)/
    const pathRegexp = // path.matchAll(
      /(?:^\{|^|\{)([^{\n]*?) => ([^}\n]*?)(?:\}$|\}|$)/g
      //              1             2
    // )
    let pathBefore = path
    let pathAfter = path
    let renamed = false
    let pathMatch
    while ((pathMatch = pathRegexp.exec(path)) !== null) {
      // pathMatch = pathMatch.value
      renamed = true
      const fullMatch = pathMatch && pathMatch[0]
      const expathPart = pathMatch && pathMatch[1]
      const newpathPart = pathMatch && pathMatch[2]
      pathBefore = expathPart !== undefined
        ? pathBefore.replace(fullMatch, expathPart)
        : pathBefore
      pathAfter = newpathPart !== undefined
        ? pathAfter.replace(fullMatch, newpathPart)
        : pathAfter
    }
    // -----------------------------------------------------
    const file = {
      pathBefore: pathBefore.replace(/\/+/g, '/'), // when path is hello//world
      path: pathAfter.replace(/\/+/g, '/') || path,
      renamed,
      bin, // boolean
      changes: bin ? 0 : parseInt(match[2]) || 0,
      insertionRatio: match[3] !== undefined ? match[3].length : 0,
      deletionRatio: match[4] !== undefined ? match[4].length : 0
    }
    file.name = file.path.split(/[\\/]/).slice(-1)[0]
    files.push(file)
  }
  // \n\n    scroll snapping, page and panel elements and heights calculations\n\n
  const messageLn = chunk.match(/[\n\r][\n\r](.+)[\n\r][\n\r]/)
  const message = (messageLn && messageLn[1].trim()) || ''
  //  22 files changed, 184 insertions(+), 55 deletions(-)
  const sumLn = chunk.match(/(?:(\d+) *insertion)(?:.*(\d+) *deletion)?/)
  const insertions = (sumLn && parseInt(sumLn[1])) || 0
  const deletions = (sumLn && parseInt(sumLn[2])) || 0
  return {
    sha,
    branches,
    author,
    date,
    message,
    files,
    insertions,
    deletions,
    raw: options.includeRaw ? chunk : '<raw data excluded>'
  }
}

module.exports = parse
