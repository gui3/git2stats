const git2stats = require('../src/index.js')

class LazyLoader {
  constructor (path = '.') {
    this.data = '<not resolved>'
    LazyLoader.load(path)
  }

  static async load (path = '.') {
    return git2stats.getAdvancedStats(path)// getAdvancedStats(path)
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
node --require ./examples/playingWithData

let { git2stats, lazyLoader } = require('./examples/playingWithAdvancedData')
let data
lazyLoader.load('.').then(d => data= d).catch(err => console.log(err))
*/
