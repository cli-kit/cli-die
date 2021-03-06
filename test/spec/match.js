var expect = require('chai').expect
  , userid = require('userid')
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
      mock.assert.all(req);
      done();
    })
    def.parse(args);
  });

  it('should match process by pids', function(done) {
    var args = mock.args(['m'].concat(mock.pids));
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      mock.assert.all(req);
      done();
    })
    def.parse(args);
  });

  it('should filter column and return empty', function(done) {
    // removed the cmd column so the match fails
    var args = mock.args(['m', '-f', 'pid', '/mock-/']);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      expect(req.match).to.be.an('object').to.eql({})
      done();
    })
    def.parse(args);
  });

  it('should use long listing', function(done) {
    var args = mock.args(['m', '-l', '/mock-/']);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      expect(req.match).to.be.an('array');
      expect(req.match.length).to.be.gt(0);
      var entry = req.match[0];
      expect(entry.match).to.be.a('string');
      expect(entry.index).to.be.a('number');
      expect(entry.ptn).to.be.a('string');
      expect(entry.pid).to.be.a('number');
      expect(entry.row).to.be.an('object');
      expect(entry.key).to.be.a('string');
      var row = entry.row;
      // matched on cmd column
      expect(row.cmd).to.eql(entry.match);
      expect(Object.keys(row)).to.eql(mock.columns);
      done();
    })
    def.parse(args);
  });

  it('should match processes for uid (-U)', function(done) {
    var args = mock.args(['m', '/mock-/', '-U', process.getuid()]);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      var doc = req.psinfo.doc;
      var uids = req.psinfo.doc.uid;

      // remove root processes with this user as euid
      uids = uids.filter(function(u) {
        return parseInt(u);
      })
      uids.forEach(function(u) {
        expect(u).to.eql('' + process.getuid());
      })

      done();
    })
    def.parse(args);
  });

  it('should match processes for username (-u)', function(done) {
    var args = mock.args(
      ['m', '/mock-/', '-u', userid.username(process.getuid())]);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      var doc = req.psinfo.doc;
      var uids = req.psinfo.doc.uid;

      // remove root processes with this user as euid
      uids = uids.filter(function(u) {
        return parseInt(u);
      })
      uids.forEach(function(u) {
        expect(u).to.eql('' + process.getuid());
      })

      done();
    })
    def.parse(args);
  });

  it('should omit command arguments - name only (-c)', function(done) {
    var args = mock.args(['m', 'node', '-c']);
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      for(var pid in req.match) {
        expect(req.match[pid].cmd).to.eql('node');
      }
      done();
    })
    def.parse(args);
  });

  it('should use pid file patterns', function(done) {
    var files = mock.files;
    var flist = [];
    files.forEach(function(f) {
      flist.push('-p', f);
    })
    var args = mock.args(['m'].concat(flist));
    var def = program(pkg, mock.name);
    def.program.on('complete', function(req) {
      mock.after();
      expect(req.patterns).to.be.an('array');

      // one non-match pattern in each pid file
      expect(req.patterns.length).to.eql(mock.pids.length * 2);
      mock.assert.all(req);
      done();
    })
    def.parse(args);
  });
})
