var expect = require('chai').expect
  , mock = require('../util/mock')
  , pkg = require('../../package.json')
  , program = require('../../lib/die');

describe('cli-die:', function() {
  this.timeout(5000);

  it('should error on too few arguments (match)', function(done){
    var args = mock.args(['m']);
    var def = program(pkg, mock.name);
    var errors = def.program.errors;
    def.program.on('error', function(err) {
      expect(err.key).to.eql(errors.ETOO_FEW_ARGUMENTS.key);
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      done();
    })
    def.parse(args);
  });

  it('should error on too few arguments (kill)', function(done){
    var args = mock.args(['k']);
    var def = program(pkg, mock.name);
    var errors = def.program.errors;
    def.program.on('error', function(err) {
      expect(err.key).to.eql(errors.ETOO_FEW_ARGUMENTS.key);
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      done();
    })
    def.parse(args);
  });

  it('should error on invalid psargs (-- -abracadabra)', function(done){
    var args = mock.args(['m'], ['abracadabra']);
    var def = program(pkg, mock.name);
    var errors = def.program.errors;
    def.program.on('error', function(err) {
      expect(err.key).to.eql(errors.EGENERIC.key);
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      done();
    })
    def.parse(args);
  });

})
