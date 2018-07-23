var assert = require('assert')
var util = require('./util.js')

describe('Derive server', function () {
  describe('Protocol and port', function () {
    it('should not add anything', function () {
      assert.equal('https://public-node.rsk.co:4444', util.deriveServer('https://public-node.rsk.co:4444'))
      assert.equal('http://public-node.rsk.co:443', util.deriveServer('http://public-node.rsk.co:443'))
    })
  })
  describe('Protocol but no port', function () {
    it('should add port 4444', function () {
      assert.equal('http://public-node.rsk.co:4444', util.deriveServer('http://public-node.rsk.co'))
      assert.equal('https://public-node.rsk.co:4444', util.deriveServer('https://public-node.rsk.co'))
    })
  })
  describe('No protocol but port', function () {
    it('should add http protocol', function () {
      assert.equal('http://public-node.rsk.co:4444', util.deriveServer('public-node.rsk.co:4444'))
      assert.equal('http://public-node.rsk.co:443', util.deriveServer('public-node.rsk.co:443'))
    })
  })
  describe('Neither protocol nor port', function () {
    it('should add http protocol', function () {
      assert.equal('http://public-node.rsk.co:4444', util.deriveServer('public-node.rsk.co'))
    })
  })
})
