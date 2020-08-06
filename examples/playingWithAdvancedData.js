const git2stats = require('../src/index.js')

class LazyLoader {
  constructor (path = '.') {
    this.data = '<not resolved>'
    LazyLoader.load(path)
  }

  static async load (path = '.') {
    return git2stats.getAdvancedStats(path)
      .then(d => {
        this.data = d
        console.log('git data resolved !')
        return d
      })
      .catch(err => console.log(err))
  }
}

module.exports = {
  git2stats,
  LazyLoader
}

/* # use :
node --require ./examples/playingWithAdvancedData

let { git2stats, lazyLoader } = require('./examples/playingWithAdvancedData')
let g = lazyLoader('.')
// wait for console.log
g.data // => object GitData you can play with
*/

const l = LazyLoader

l.load()
  .then(data => {
    console.log(data.getFile('src/index.js'))
  })
  .catch(err => console.log(err))
