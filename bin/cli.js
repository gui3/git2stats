#!/usr/bin/env node

// require = require('esm')(module /*, options*/);

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

require('../src/index')(process.argv[2] || '.')
  .then(data => {
    console.log('loaded ' + data.length + ' commits')
    console.log('>>>> press "ENTER" to preview, "q" to quit')

    let cur = 0
    rl.on('line', function (line) {
      if (line === 'q' || cur >= data.length) {
        console.log('END no more commits')
        process.exit()
      } else {
        console.log(data[cur]) // JSON.stringify(data[cur], null, 2))
        console.log('>>>> press "ENTER" to continue, "q" to quit')
        cur++
      }
    })
  })
  .catch(err => { console.log(err) })
