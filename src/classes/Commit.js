const FileCollection = require('./FileCollection')
// const File = require('./File')

class Commit extends Object {
  constructor (rawCommit, gitdata) {
    super()
    this.message = rawCommit.message
    this.sha = rawCommit.sha
    this.date = rawCommit.date
    this.branches = rawCommit.branches
    this.author = rawCommit.author
    this.changes = rawCommit.changes
    this._gitdata = gitdata
    this._raw = rawCommit

    this.files = new FileCollection()
    rawCommit.files.forEach(file => {
      this.files.push(this._gitdata.getFile(file.path))
    })
  }

  getAllFilesContent () {
    return this._gitdata.getAllFiles()
      .map(file => {
        const lines = file.getContentAtIsoDate(this.date.iso)
        return {
          path: file.path,
          lines: lines,
          contentStr: lines.map(line => line.content).join('\n')
        }
      })
  }

  getFileContent (path) {
    const file = this._gitdata.getFile(path)
    const lines = file.getContentAtIsoDate(this.date.iso)
    return {
      path: file.path,
      lines: lines,
      contentStr: lines.map(line => line.content).join('\n')
    }
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
    return '<Commit ' + this.sha + ' date: ' + this.date.iso + '>'
  }
}

module.exports = Commit
