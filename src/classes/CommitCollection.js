class CommitCollection extends Array {
  constructor (array) {
    if (array instanceof Array) {
      super(...array)
    } else {
      super()
    }
  }

  getSortedHistory (nowToThen) {
    let sorting
    if (nowToThen) {
      sorting = (la, lb) => lb.date.epoch - la.date.epoch
    } else {
      sorting = (la, lb) => la.date.epoch - lb.date.epoch
    }
    return this.sort(sorting)
  }

  filterBeforeEpoch (epoch, includeEqual = true) {
    if (includeEqual) return this.filter(c => c.date.epoch <= epoch)
    else return this.filter(c => c.date.epoch < epoch)
  }

  filterAfterEpoch (epoch, includeEqual = true) {
    if (includeEqual) return this.filter(c => c.date.epoch >= epoch)
    else return this.filter(c => c.date.epoch > epoch)
  }

  filterBetweenEpochs (from, until, includeEqual = true) {
    if (from > until) [from, until] = [until, from]
    if (includeEqual) return this.filter(c => c.date.epoch >= from && c.date.epoch <= until)
    else return this.filter(c => c.date.epoch > from && c.date.epoch < until)
  }

  tableOfContents () {
    return this.map(commit => commit.toString())
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

module.exports = CommitCollection
