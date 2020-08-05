const path = require('path')

function sanitize (dir, options) {
  dir = path.resolve(dir)
  !options.silent && console.log('git2stats reading ', dir)
  options.dir = dir
}

module.exports = sanitize
