const childProcess = require('child_process')

function fetchCommand (command) {
  return new Promise((resolve, reject) => {
    const sub = childProcess.exec(command)
    // (command[, args][, options])

    let chars = 0
    let lines = 0
    let lastchunk = ''

    sub.stdout.on('data', function (chunk) {
      chars += chunk.length
      lines += chunk.split('\n').length
      lastchunk = chunk
      if (lines % 1 === 0) console.log('chars:' + chars + ' lines:' + lines)
    })
    sub.stdout.on('close', function () {
      console.log(lastchunk)
      // if (lines % 100 === 0) console.log('chars:' + chars + ' lines:' + lines)
      console.log('CLOSED')
    })
    sub.stderr.on('error', function (err) {
      console.log('ERROR: ' + err.message)
    })
  })
}

fetchCommand('git show').catch(err => console.log(err))
