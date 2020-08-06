class CommitDigest extends Object {
  constructor (rawCommit, gitdata) {
    super({})
    this.sha = rawCommit.sha
    this.epoch = rawCommit.date.epoch
    this.message = rawCommit.message
    this._gitData = gitdata
  }

  getCommit () {
    return this._gitData.getCommit(this.sha)
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

module.exports = CommitDigest
