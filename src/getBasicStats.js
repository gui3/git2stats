const fetchCommand = require('./fetchCommand')
const parselogstat = require('./parselogstat')
const sanitizeDir = require('./sanitizeDir')

async function getBasicStats (dir, options = { silent: true }) {
  options.dir = sanitizeDir(dir, options)
  const data = await fetchCommand('git log --stat', options)
    .then(data => {
      return data.map(chunk => parselogstat(chunk))
    })
    .catch(err => { console.log(err) })
  return data
}

module.exports = getBasicStats
