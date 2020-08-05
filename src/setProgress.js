function setProgress (options) {
  if (!(typeof options.setProgress === 'function')) {
    if (options.silent) {
      options.setProgress = chunkCount => {}
    } else {
      options.setProgress = nb => nb % 10 === 0 &&
        console.log('  progress: +', nb)
    }
  }
  return options
}

module.exports = setProgress
