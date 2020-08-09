function setLogger (options) {
  if (!(typeof options.logger === 'function')) {
    if (options.silent) {
      options.logger = chunkCount => {}
    } else {
      options.logger = message =>
        console.log(message)
    }
  }
  return options
}

module.exports = setLogger
