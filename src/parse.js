function parse (chunk) {
  // commit b51f5e30c575c6106422dee60188055bf7829384 (origin/i18n, origin/dev, i18n, dev)
  const commitLn = chunk.match(/commit ([^\s]+) *(?:\((.+)\))?/)
  const sha = commitLn[1] || '???'
  let branches = commitLn[2] || ''
  branches = branches.split(', ')
  // Author: gui3 <gui.silvent@gmail.com>
  const authorLn = chunk.match(/Author: *([^\s]+) *(?:<([^\s]+)>)?/)
  const alias = authorLn[1] || ''
  const email = authorLn[2] || ''
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
  const filesIt = chunk.matchAll(
    /\n(.+)\|(?:(?: *(\d+) *(\+*)(-*))|(?: *(Bin)(?: *(\d+)?.+(\d+)? *bytes)?))?/g
    //   1             2     3     4        5     6       7
  )
  const files = []
  let match
  while (!(match = filesIt.next()).done) {
    match = match.value
    const bin = match[5] === 'Bin'
    const file = {
      path: match[1].trim(),
      bin: bin, // boolean
      changes: bin ? 0 : parseInt(match[2]) || 0,
      insertionRatio: match[3] !== undefined ? match[3].length : 0,
      deletionRatio: match[4] !== undefined ? match[4].length : 0
    }
    file['name'] = file.path.split(/[\\/]/).slice(-1)[0]
    files.push(file)
  }
  // \n\n    scroll snapping, page and panel elements and heights calculations\n\n
  const message = chunk.match(/[\n\r][\n\r](.+)[\n\r][\n\r]/)[1].trim()
  //  22 files changed, 184 insertions(+), 55 deletions(-)
  const sumLn = chunk.match(/(?:(\d+) *insertion)(?:.*(\d+) *deletion)?/)
  const insertions = parseInt(sumLn[1]) || 0
  const deletions = parseInt(sumLn[2]) || 0
  return {
    sha,
    branches,
    author,
    date,
    message,
    files,
    insertions,
    deletions,
    _raw: chunk
  }
}

module.exports = parse
