// const childProcess = require('child_process')
const childProcess = require('child_process')

function fetchCommand (command, options) {
  return new Promise((resolve, reject) => {
    const sub = childProcess.exec(command, { cwd: options.dir })
    // (command[, args][, options])

    const data = []

    sub.stdout.on('data', function (chunk) {
      data.push(chunk)
      options.setProgress(data.length)
    })
    sub.stdout.on('close', function () {
      options.verbose && options.logger(command)
      resolve(data)
    })
    sub.stderr.on('error', function (err) {
      reject(err)
    })
  })
}

module.exports = fetchCommand
