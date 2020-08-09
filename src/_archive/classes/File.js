// const CommitCollection = require('./CommitCollection')
const Line = require('./Line')
const LineCollection = require('./LineCollection')
const FileCollection = require('./FileCollection')

class File extends Object {
  constructor (rawFile, gitdata) {
    super()
    this._gitdata = gitdata
    this.name = rawFile.name
    this.path = rawFile.path
    this.pathBefore = rawFile.pathBefore
    this.bin = rawFile.bin
    this.lastUpdateDate = {
      epoch: 0
    }
    this._commitShas = []
    this.lines = new LineCollection()
    this._raw = rawFile
  }

  _addCommitDiff (rawCommit, rawFile) {
    if (rawCommit.date.epoch > this.lastUpdateDate.epoch) {
      this.lastUpdateDate = rawCommit.date
      this.name = rawFile.name
      this.path = rawFile.path
      this.bin = rawFile.bin
    }
    if (rawFile.pathBefore !== rawFile.path &&
      rawFile.pathBefore !== this.path
    ) {
      this.pathBefore = rawFile.pathBefore
    }
    this._commitShas.push(rawCommit.sha)

    if (rawFile.diff !== undefined) {
      rawFile.diff.lines.forEach(rawLine => {
        // if (rawLine.change !== '%') { // exclude unchanged lines
        const lineDig = new Line(rawLine, this, rawCommit, this._gitdata)
        this.lines.push(lineDig)
        // }
      })
    }
  }

  getRelatedCommits () {
    return this._gitdata.getAllCommits()
      .filter(commit => this._commitShas.includes(commit.sha))
  }

  getAllRelatedLines () {
    return this.getRelatedFiles()
      .map(file => file.lines)
      .reduce((a, b) => a.concat(b))
  }

  getLineHistory (row, nowToThen = true) {
    return this.lines.getLineHistory(row, nowToThen)
  }

  getContentAtEpoch (epoch) {
    /*
    const lines = {}
    this.lines
      .forEach(lineD => {
        const existing = lines[lineD.row]
        if (lineD.change !== '-' &&
            lineD.epoch < epoch &&
            (
              existing === undefined ||
              existing.epoch < lineD.epoch
            )
        ) lines[lineD.row] = lineD
        // keep only last modified
      })
    return new LineCollection(Object.values(lines))
    */
    return this.lines.getLinesAtEpoch(epoch)
  }

  getContentAtCommitSha (sha) {
    const commit = this._gitdata.getCommit(sha)
    if (!commit) {
      const err = new Error('commit ' + sha + ' not found')
      err.code = 'COMMITNOTFOUND'
      throw err
    }
    const epoch = commit.date.epoch
    return this.getContentAtEpoch(epoch)
  }

  getRelatedFiles () {
    if (this._aliases === undefined) {
      const aliases = new Set([this.path])
      aliases.add(this.pathBefore)
      let matches
      const found = new Set()
      do {
        aliases.delete(undefined)
        matches = new Set(this._gitdata.getAllFiles()
          .filter(file => !found.has(file) &&
                  (aliases.has(file.path) ||
                  aliases.has(file.pathBefore)
                  )
          )
        )
        matches.forEach(file => {
          found.add(file)
          if (!aliases.has(file.path)) aliases.add(file.path)
        })
      } while (matches.size > 0)
      this._aliases = new FileCollection(
        [...aliases].map(alias => this._gitdata.getFile(alias))
      )
    }
    return this._aliases
  }

  getRaw () {
    return this._raw
  }

  toJson (options = { indent: 2 }) {
    return JSON.stringify(
      this,
      (key, value) => key.startsWith('_') ? undefined : value,
      options.indent)
  }

  toString () {
    return '<File ' + this.path + '>'
  }
}

module.exports = File
