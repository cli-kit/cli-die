var expect = require('chai').expect
  , mock = require('../util/mock')
  , pkg = require('../../package.json')
  , program = require('../../lib/die');

describe('cli-die:', function() {

  beforeEach(mock.before);

  it('should print columns using custom ps args (-ax)', function(done) {
    var args = mock.args(['c'], ['-ax']);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      expect(req).to.be.an('object');
      var psinfo = req.psinfo;
      expect(psinfo).to.be.an('object');
      expect(psinfo.titles).to.be.an('array');
      expect(psinfo.titles)
        .to.eql([ 'pid', 'tty', 'time', 'cmd' ]);
      done();
    })
    def.parse(args);
  });
})

