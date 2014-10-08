var expect = require('chai').expect
  , mock = require('../util/mock')
  , pkg = require('../../package.json')
  , program = require('../../lib/die');

describe('cli-die:', function() {

  beforeEach(mock.before);

  it('should print cmd help on no args', function(done) {
    var args = mock.args([], true);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      done();
    })
    def.parse(args);
  });

  it('should print help on --help', function(done) {
    var args = mock.args(['--help']);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      done();
    })
    def.parse(args);
  });

  it('should print columns', function(done) {
    var args = mock.args('c');
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      expect(req).to.be.an('object');
      var psinfo = req.psinfo;
      expect(psinfo).to.be.an('object');
      expect(psinfo.doc).to.be.an('object');
      expect(psinfo.titles).to.be.an('array');
      expect(psinfo.signal).to.be.a('string');

      expect(psinfo.titles)
        .to.eql([ 'uid', 'pid', 'ppid', 'c', 'stime', 'tty', 'time', 'cmd' ]);
      expect(psinfo.signal).to.eql('SIGTERM');

      // internal non-enumerable properties
      expect(psinfo.doc._raw).to.be.an('object');
      expect(psinfo.doc._pids).to.be.an('array');
      expect(psinfo.doc._titles).to.be.an('array');
      done();
    })
    def.parse(args);
  });

  it('should print object graph', function(done) {
    var args = mock.args('g');
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      done();
    })
    def.parse(args);
  });

  it('should print object graph with column filter', function(done) {
    var args = mock.args(['g', 'pid', 'cmd']);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      var psinfo = req.psinfo;
      expect(Object.keys(psinfo.doc)).to.eql(['pid', 'cmd']);
      done();
    })
    def.parse(args);
  });
})
