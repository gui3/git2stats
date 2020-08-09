const path = require('path')

function sanitize (dir, options) {
  dir = path.resolve(dir)
  !options.silent && console.log('git2stats reading ', dir)
  return dir
}

module.exports = sanitize
