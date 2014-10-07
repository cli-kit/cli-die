var expect = require('chai').expect
  , mock = require('../util/mock')
  , pkg = require('../../package.json')
  , program = require('../../lib/die');

/**
 *  Expect to match all mock processes.
 */
function all(req) {
  //expect(req.match).to.be.an('object');
  //var keys = Object.keys(req.match);
  //expect(keys.length).to.eql(mock.processes.length);
  //expect(keys).to.eql(mock.pids);
}

describe('cli-die:', function() {

  before(mock.setup);
  beforeEach(mock.before);

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
})
