class LineDigest extends Object {
  constructor (rawLine, file, rawCommit, gitdata) {
    super({})
    this.row = rawLine.rowAfter
    this.epoch = rawCommit.date.epoch
    this.sha = rawCommit.sha
    this.content = rawLine.content
    this._file = file
    this._gitData = gitdata
  }

  getCommit () {
    return this._gitData.getCommit(this.sha)
  }

  getFile () {
    return this._file
  }

  toJson (options = { indent: 2 }) {
    return JSON.stringify(
      this,
      (key, value) => key.startsWith('_') ? undefined : value,
      options.indent
    )
  }

  toString () {
    return this.toJson()
  }
}

module.exports = LineDigest
