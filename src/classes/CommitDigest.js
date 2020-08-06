class CommitDigest extends Object {
  constructor (rawCommit, gitdata) {
    super({})
    this.sha = rawCommit.sha
    this.isoDate = rawCommit.date.iso
    this.message = rawCommit.message
    this._gitData = gitdata
  }

  getCommit () {
    return this._gitData.getCommit(this.sha)
  }

  toJson (options = { indent: 2 }) {
    return JSON.stringify(this, null, options.indend)
  }
}

module.exports = CommitDigest
