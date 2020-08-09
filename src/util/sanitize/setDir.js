const path = require('path')

function setDir (options) {
  options.dir = path.resolve(options.dir || '.')
  !options.silent && console.log('git2stats reading ', options.dir)
  return options
}

module.exports = setDir
