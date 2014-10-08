var expect = require('chai').expect
  , mock = require('../util/mock')
  , signals = require('../../lib/signals');

describe('cli-die:', function() {

  it('should recognise lowercase signal', function(done) {
    var sig = 'hup';
    var res = signals.translate(sig);
    expect(res).to.eql('SIGHUP');
    done();
  });

  it('should recognise uppercase signal', function(done) {
    var sig = 'HUP';
    var res = signals.translate(sig);
    expect(res).to.eql('SIGHUP');
    done();
  });

  it('should recognise prefixed signal (lowercase)', function(done) {
    var sig = 'sighup';
    var res = signals.translate(sig);
    expect(res).to.eql('SIGHUP');
    done();
  });

  it('should recognise prefixed signal (uppercase)', function(done) {
    var sig = 'SIGHUP';
    var res = signals.translate(sig);
    expect(res).to.eql('SIGHUP');
    done();
  });

  it('should lookup signal by integer string', function(done) {
    var sig = '2';
    var res = signals.translate(sig);
    expect(res).to.eql('SIGINT');
    done();
  });

  it('should lookup signal by integer', function(done) {
    var sig = 2;
    var res = signals.translate(sig);
    expect(res).to.eql('SIGINT');
    done();
  });

})
