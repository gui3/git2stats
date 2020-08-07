function zip (commit, diffs, options) {
  options.verbose && console.log('---this commit has ' + commit.files.length + ' files')
  for (let i = 0; i < commit.files.length; i++) {
    const file = commit.files[i]
    if (diffs.files[file.path]) {
      commit.files[i].diff = diffs.files[file.path]
      // options.verbose && options.logger(file.path)
    } else {
      options.verbose && options.logger('NO DIFF in file : ' + file.path)
    }
  }
  return commit
}

module.exports = zip
