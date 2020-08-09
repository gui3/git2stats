const assert = require('assert')
const fetchCommand = require('../../src/util/fetchCommand')

describe('fetchCommand', function () {
  it('shoud return a string', function (done) {
    fetchCommand('echo hello world')
      .then(data => {
        assert.strictEqual(
          typeof data,
          'string'
        )
        done()
      })
      .catch(err => done(err))
  })

  it('should return the result of command', function (done) {
    fetchCommand('echo hello world')
      .then(data => {
        assert.strictEqual(
          /^hello world[\r\n]+$/.test(data),
          true
        )
        done()
      })
      .catch(err => done(err))
  })
})
