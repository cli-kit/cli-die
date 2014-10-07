var expect = require('chai').expect
  , mock = require('../util/mock')
  , pkg = require('../../package.json')
  , program = require('../../lib/die');

describe('cli-die:', function() {

  before(mock.setup);
  after(mock.teardown);

  beforeEach(mock.before);

  it('should match process by pattern', function(done) {
    var args = mock.args(['m', '/mock-/']);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      expect(req.match).to.be.an('object');
      var keys = Object.keys(req.match);
      expect(keys.length).to.eql(mock.processes.length);
      expect(keys).to.eql(mock.pids);
      done();
    })
    def.parse(args);
  });

  it('should match process by pids', function(done) {
    var args = mock.args(['m'].concat(mock.pids));
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      expect(req.match).to.be.an('object');
      var keys = Object.keys(req.match);
      expect(keys.length).to.eql(mock.processes.length);
      expect(keys).to.eql(mock.pids);
      done();
    })
    def.parse(args);
  });
})
