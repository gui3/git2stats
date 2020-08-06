class LineDigest extends Object {
  constructor (rawLine, file, rawCommit, gitdata) {
    super({})
    this.line = rawLine.lineAfter
    this.isoDate = rawCommit.date.iso
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
    return JSON.stringify(this, null, options.indend)
  }
}

module.exports = LineDigest
