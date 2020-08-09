const setDir = require('./setDir')
const setProgress = require('./setProgress')
const setLogger = require('./setLogger')

function sanitizeOptions (options, dir = false) {
  if (dir) {
    options = setLogger(setProgress(setDir(options)))
  } else {
    options = setLogger(setProgress(options))
  }
  return options
}

module.exports = sanitizeOptions
