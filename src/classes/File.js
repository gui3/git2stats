const CommitDigest = require('./CommitDigest')
const LineDigest = require('./LineDigest')

class File extends Object {
  constructor (rawFile, gitdata) {
    super({})
    this._gitdata = gitdata
    this.name = rawFile.name
    this.path = rawFile.path
    this.bin = rawFile.bin
    this.lastUpdateDate = {
      epoch: 0
    }
    this.commitsDigests = []
    this.linesDigests = []
  }

  _addCommitDiff (rawCommit, rawFile) {
    if (rawCommit.date.epoch > this.lastUpdateDate.epoch) {
      this.lastUpdateDate = rawCommit.date
      this.name = rawFile.name
      this.path = rawFile.path
      this.bin = rawFile.bin
    }
    const commitDig = new CommitDigest(rawCommit, this._gitdata)
    this.commitsDigests.push(commitDig)

    if (rawFile.diff !== undefined) {
      rawFile.diff.lines.forEach(line => {
        if (line.change === '+') {
          const lineDig = new LineDigest(line, this, rawCommit, this._gitdata)
          this.linesDigests.push(lineDig)
        }
      })
    }
  }

  getContentAtIsoDate (isoDate) {
    const lines = {}
    this.linesDigest
      .forEach(lineD => {
        const existing = lines[lineD.line]
        if (lineD.isoDate < isoDate &&
            (!existing ||
              existing.isoDate < lineD.isoDate)) lines[lineD.line] = lineD
        // keep only last modified
      })
    return Object.values(lines)
  }

  getContentAtCommitSha (sha) {
    const commit = this.commitsDigests.find(c => c.sha === sha)
    if (!commit) {
      throw new Error('commit ' + sha + 'not found in file ' + this.path)
    }
    const isoDate = commit.isoDate
    return this.getContentAtIsoDate(isoDate)
  }

  toJson (options = { indent: 2 }) {
    return JSON.stringify(this, null, options.indend)
  }
}

module.exports = File
