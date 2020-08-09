const CommitCollection = require('./CommitCollection')
const Commit = require('./Commit')
const FileCollection = require('./FileCollection')
const File = require('./File')

class GitData extends CommitCollection {
  getCommit (sha) {
    return this.getAllCommits().find(c => c.sha === sha)
  }

  searchCommitMessage (regex) {
    if (!(regex instanceof RegExp)) regex = new RegExp(regex)
    return this.getAllCommits().filter(c => c.message.match(regex))
  }

  searchFilePath (regex) {
    if (!(regex instanceof RegExp)) regex = new RegExp(regex)
    return this.getAllFiles().filter(f => f.path.match(regex) || f.pathBefore.match(regex))
  }

  getAllCommits () {
    return new CommitCollection(Object.values(this.getCommitsDict()))
  }

  getCommitsDict (save = true) {
    if (this._commitsDict === undefined) {
      const commits = {}
      for (let ci = 0; ci < this.length; ci++) {
        const rawCommit = this[ci]
        commits[rawCommit.sha] = new Commit(rawCommit, this)
      }
      if (save) this._commitsDict = commits
      return commits
    }
    return this._commitsDict
  }

  getFile (path) {
    return this.getFilesDict()[path]
  }

  getAllFiles () {
    return new FileCollection(Object.values(this.getFilesDict()))
  }

  getFilesDict (save = true) {
    if (this._filesDict === undefined) {
      const files = {}
      // const commits = this.getAllCommits()
      for (let ci = 0; ci < this.length; ci++) {
        const rawCommit = this[ci]
        if (rawCommit.files === undefined) continue
        for (let fi = 0; fi < rawCommit.files.length; fi++) {
          const rawFile = rawCommit.files[fi]
          if (files[rawFile.path] === undefined) {
            const file = new File(rawFile, this)
            file._addCommitDiff(rawCommit, rawFile)
            files[rawFile.path] = file
          } else {
            files[rawFile.path]._addCommitDiff(rawCommit, rawFile)
          }
        }
      }
      if (save) this._filesDict = files
      return files
    }
    return this._filesDict
  }

  toJson (options = { indent: 2 }) {
    return JSON.stringify(
      this,
      (key, value) => key.startsWith('_') ? undefined : value,
      options.indent)
  }

  toString () {
    return this.toJson()
  }
}

module.exports = GitData
