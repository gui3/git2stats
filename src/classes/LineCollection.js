class LineCollection extends Array {
  constructor (array) {
    super(...array)
  }

  asString (includeRow = false) {
    return this.map(line => (includeRow ? line.row : '') + line.contents)
      .join('\n')
  }
}

module.exports = LineCollection
