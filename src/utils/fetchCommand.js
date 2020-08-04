// const childProcess = require('child_process')
import childProcess from 'child_process'

export default function fetchCommand (command, dir, setProgress) {
  if (!(typeof setProgress === 'function')) {
    setProgress = chunkCount => chunkCount % 100 === 0 &&
      console.log('fetched: ', chunkCount, ' chunks')
  }
  return new Promise((resolve, reject) => {
    const sub = childProcess.exec(command, {cwd: dir})
    // (command[, args][, options])

    const data = []

    sub.stdout.on('data', function (chunk) {
      data.push(chunk)
    })
    sub.stdout.on('close', function () {
      resolve(data)
    })
    sub.stderr.on('error', function (err) {
      reject(err)
    })
  })
}
