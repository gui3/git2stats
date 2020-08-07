class Line extends Object {
  constructor (rawLine, file, rawCommit, gitdata) {
    super()
    this.row = rawLine.change === '-' ? rawLine.rowBefore : rawLine.rowAfter
    this.change = rawLine.change
    this.epoch = rawCommit.date.epoch
    this.sha = rawCommit.sha
    this.content = rawLine.content
    this._file = file
    this._gitData = gitdata
    this._raw = rawLine
  }

  getCommit () {
    return this._gitData.getCommit(this.sha)
  }

  getFile () {
    return this._file
  }

  getRaw () {
    return this._raw
  }

  toJson (options = { indent: 2 }) {
    return JSON.stringify(
      this,
      (key, value) => key.startsWith('_') ? undefined : value,
      options.indent
    )
  }

  toString () {
    return '<Line ' + this.row + ' of ' + this._file.path + ' at commit ' + this.sha.slice(-5) + '>'
  }
}

module.exports = Line
