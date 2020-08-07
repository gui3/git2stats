class LineCollection extends Array {
  constructor (array) {
    if (array instanceof Array) {
      super(...array)
    } else {
      super()
    }
  }

  getLineHistory (row, nowToThen = true) {
    return this.filter(line => line.row === row)
      .getSortedHistory(nowToThen)
  }

  getLinesAtEpoch (epoch) {
    return this.filterBeforeEpoch(epoch)
      .filterLastVersion(false)
  }

  filterLastVersion (keepDeleted = false) {
    const lines = {}
    const changes = ['-', '+', ' ']
    this.forEach(line => {
      const existing = lines[line.row]
      if (existing === undefined ||
          existing.epoch < line.epoch ||
          (
            existing.epoch === line.epoch &&
            (
              keepDeleted
                ? line.change !== '-'
                : changes.indexOf(existing.change) <
                  changes.indexOf(line.change)
            )
          )
      ) {
        lines[line.row] = line
      }
    })
    return new LineCollection(Object.values(lines))
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

  filterBeforeEpoch (epoch, includeEqual = true) {
    if (includeEqual) return this.filter(l => l.epoch <= epoch)
    else return this.filter(l => l.epoch < epoch)
  }

  filterAfterEpoch (epoch, includeEqual = true) {
    if (includeEqual) return this.filter(l => l.epoch >= epoch)
    else return this.filter(l => l.epoch > epoch)
  }

  filterBetweenEpochs (from, until, includeEqual = true) {
    if (from > until) [from, until] = [until, from]
    if (includeEqual) return this.filter(l => l.epoch >= from && l.epoch <= until)
    else return this.filter(l => l.epoch > from && l.epoch < until)
  }

  tableOfContents () {
    return this.map(line => line.toString())
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

module.exports = LineCollection
