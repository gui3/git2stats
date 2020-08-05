function zip (commit, diffs, options) {
  options.verbose && console.log('---this commit has ' + commit.files.length + ' files')
  for (let i = 0; i < commit.files.length; i++) {
    const file = commit.files[i]
    if (diffs.files[file.path]) {
      commit.files[i].diff = diffs.files[file.path]
    } else {
      options.verbose && options.logger('ignored file : ' + file.path)
    }
  }
  return commit
}

module.exports = zip
