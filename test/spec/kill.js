var expect = require('chai').expect
  , mock = require('../util/mock')
  , pkg = require('../../package.json')
  , program = require('../../lib/die');

describe('cli-die:', function() {

  beforeEach(function(done) {
    mock.before(function() {
      mock.setup(done);
    })
  });

  it('should print matches with --noop', function(done) {
    var args = mock.args(['k', '/mock-/', '--noop']);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      mock.assert.all(req);
      mock.teardown();
      done();
    })
    def.parse(args);
  });

  it('should kill all mock processes by pattern', function(done) {
    var args = mock.args(['k', '/mock-/']);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      mock.teardown();
      done();
    })
    def.parse(args);
  });

  it('should kill all mock processes with kill(1)', function(done) {
    var args = mock.args(['k', '/mock-/', '-e']);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      mock.teardown();
      done();
    })
    def.parse(args);
  });

  it('should error on attempt to kill non-existent pid', function(done){
    var args = mock.args(['m', '-f', 'pid', '/.*/']);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      var pids = req.psinfo.doc._pids;
      var p = mock.generate();
      // ensure pid does not exist
      while(~pids.indexOf(p)) {
        p = mock.generate();
      }

      // attempt a kill with non-existent pid
      args = mock.args(['k', p]);
      def = program(pkg, mock.name);
      var errors = def.program.errors;
      def.program.on('error', function(err) {
        expect(err.key).to.eql(errors.EMATCH.key);
        function fn() {
          throw err;
        }
        expect(fn).throws(Error);
        done();
      })
      def.parse(args);
    })
    def.parse(args);
  });

})
