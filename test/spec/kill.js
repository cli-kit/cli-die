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
})
