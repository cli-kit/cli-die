var expect = require('chai').expect
  , mock = require('../util/mock')
  , killer = require('../../lib/killer');

describe('cli-die:', function() {

  it('killer should allow no options', function(done) {
    killer(function(err, res, opts) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(opts).to.be.an('object');
      expect(opts.exe).to.be.a('string');
      expect(opts.args).to.be.an('array');
    })
    done();
  });

})
