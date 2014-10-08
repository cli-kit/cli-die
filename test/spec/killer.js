var expect = require('chai').expect
  , mock = require('../util/mock')
  , pkg = require('../../package.json')
  , program = require('../../lib/die')
  , killer = require('../../lib/killer');

describe('cli-die:', function() {

  beforeEach(mock.before);

  it('killer should allow no options', function(done) {
    killer(function(err, res, opts) {
      mock.after();
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(opts).to.be.an('object');
      expect(opts.exe).to.be.a('string');
      expect(opts.args).to.be.an('array');
      done();
    })
  });

  it('killer should error on attempt to kill non-existent pid', function(done){
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
      var opts = {pids: [p], signal: 'SIGINT'};
      killer.kill(opts, function onkill(err, result) {
        expect(err).to.be.instanceof(Error);
        expect(err.code).to.eql('ESRCH');
        function fn() {
          throw err;
        }
        expect(fn).throws(err);
        expect(result).to.be.an('object');
        expect(result.ok).to.eql(false);
        done();
      })
    })
    def.parse(args);
  });

  it('killer should error on kill(1) exec non-existent pid', function(done){
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
      var opts = {pids: [p], signal: 'SIGINT', exec: true};
      killer.kill(opts, function onkill(err, result) {
        expect(err).to.be.instanceof(Error);
        function fn() {
          throw err;
        }
        expect(fn).throws(err);
        expect(result).to.be.an('object');
        expect(result.ok).to.eql(false);
        done();
      })
    })
    def.parse(args);
  });

  it('killer should not error (--relax)', function(done){
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
      var opts = {pids: [p], signal: 'SIGINT', relax: true};
      killer.kill(opts, function onkill(err, result) {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        expect(result.ok).to.eql(true);
        done();
      })
    })
    def.parse(args);
  });

  it('killer should not error on kill(1) exec (--relax)', function(done){
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
      var opts = {pids: [p], signal: 'SIGINT', exec: true, relax: true};
      killer.kill(opts, function onkill(err, result) {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        expect(result.ok).to.eql(true);
        done();
      })
    })
    def.parse(args);
  });


})
