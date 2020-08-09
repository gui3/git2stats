class FileCollection extends Array {
  constructor (array) {
    if (array instanceof Array) {
      super(...array)
    } else {
      super()
    }
  }

  getLineHistory (row, nowToThen) {
    return this.filter(line => line.row === row)
      .getSortedHistory(nowToThen)
  }

  getSortedHistory (nowToThen = true) {
    let sorting
    if (nowToThen) {
      sorting = (la, lb) => la.row === lb.row
        ? la.epoch === lb.epoch
          ? la.change === '+'
            ? -1
            : 1
          : lb.epoch - la.epoch
        : la.row - lb.row
    } else {
      sorting = (la, lb) => la.row === lb.row
        ? la.epoch === lb.epoch
          ? la.change === '+'
            ? 1
            : -1
          : la.epoch - lb.epoch
        : la.row - lb.row
    }
    return this.sort(sorting)
  }

  contentAsString (options) {
    options = {
      includeRow: options instanceof Boolean ? options : true,
      separator: ':',
      nowToThen: true,
      ...options
    }
    return this.getSortedHistory(options.nowToThen)
      .map(line =>
        (options.includeRow ? line.row + line.change + options.separator : '') +
        line.content)
      .join('\n')
  }

  tableOfContents () {
    return this.map(file => file.toString())
  }

  toJson (options = { indent: 2 }) {
    return JSON.stringify(
      this,
      (key, value) => key.startsWith('_') ? undefined : value,
      options.indent
    )
  }

  toString (options = { indent: 2 }) {
    return JSON.stringify(
      this.tableOfContents(),
      null,
      options.indent
    )
  }
}

module.exports = FileCollection
