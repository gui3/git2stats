const path = require('path')
const git2stats = require('../src/index.js')

git2stats(path.resolve(__dirname, '../'))
  .then(data => console.log( JSON.stringify(data, null, 2)))
  .catch(err => console.error(err))
