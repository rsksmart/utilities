var assert = require('assert');
var wallet = require('../utils/wallet')

describe('Wallet', function() {
  describe('#generateWifPrivateKey()', function() {
    it('Private key length should be 52', function() {
      assert.equal(wallet.generateWifPrivateKey().toString('hex').length, 52);
    });
    it('Private key should not be empty', function() {
        assert.notEqual(wallet.generateWifPrivateKey().toString('hex'), "");
      });
  });
  describe('#generatePublicKey()', function() {
    it('Public key for this private key should be this', function() {
        var buffer = new Buffer("d75b418e82f2fa72314472010ba67da8b4d79bfec9437ed88181e77a23ca906f", "hex")
        assert.equal(wallet.generatePublicKey(buffer).toString('hex'), '0302c9ea3ecf6e9eef953697d1bc456b513889de734ddc5340ad0f2f2b2fcf95f4');
    });
  });
  describe('#generateBitcoinAddress()', function() {
    it('Bitcoin Address for this public key should be this', function() {
        var buffer = new Buffer("0302c9ea3ecf6e9eef953697d1bc456b513889de734ddc5340ad0f2f2b2fcf95f4", "hex")
        assert.equal(wallet.generateBitcoinAddress(buffer,true), 'moexhof4EiSCWkbXUyuqXnSfFE3w1QSzHc');
    });
  });
  describe('#generateRSKAddress()', function() {
    it('RSK Address for this public key should be this', function() {
        var buffer = new Buffer("0302c9ea3ecf6e9eef953697d1bc456b513889de734ddc5340ad0f2f2b2fcf95f4", "hex")
        assert.equal(wallet.generateRSKAddress(buffer).toString('hex'), '98959e6f72cf82d81187be087638433f93a30958');
    });
  });
  describe('#generateRSKAddressFromBitcoinPrivateKey()', function() {
    it('RSK Address for this BTC private key should be this', function() {
        assert.equal(wallet.generateRSKAddressFromBitcoinPrivateKey("cT1Cjsajo6dMUju3H2AWiczXKA3TKpBEeUfR3qDYKsd9ZP4DkxdR").toString('hex'), '749d83ee1038364d5c48aef31458f559794ee6c5');
    });
  });
});

