class Commit extends Object {
  constructor (rawCommit, gitdata) {
    super(rawCommit)
    this._gitdata = gitdata
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

module.exports = Commit
