var expect = require('chai').expect
  , path = require('path')
  , fs = require('fs')
  , spawn = require('child_process').spawn
  , bin = path.normalize(path.join(__dirname, '..', 'bin'))
  , target = path.normalize(path.join(__dirname, '..', '..', 'target', 'pids'))
  , processes = []
  , pids = []
  , exes = fs.readdirSync(bin).map(function(f){return path.join(bin, f)})
  , args = [
    ['--node-version', '--semver'],
    ['-xvf'],
  ]
  , writer;

var mock = {
  name: 'die',
  processes: processes,
  pids: pids,
  // standard columns -axf (BSD)
  columns: [ 'uid', 'pid', 'ppid', 'c', 'stime', 'tty', 'time', 'cmd' ],
  files: [],
}

mock.before = function(done) {
  writer = process.stdout.write;
  process.stdout.write = function(){};
  done();
}

mock.after = function(done) {
  if(writer) process.stdout.write = writer;
  if(done) done();
}

mock.setup = function(done) {
  var opts = {};
  args.forEach(function(argv) {
    exes.forEach(function(cmd) {
      var ps = spawn(cmd, argv, opts), file;
      file = path.join(target, '' + ps.pid + '.pid');
      mock.processes.push(ps);
      var contents = '' + ps.pid + '\n # a comment line\n\n\nnon-match\n';
      fs.writeFileSync(file, contents);
      mock.files.push(file);
    })
  })

  mock.pids = mock.processes.map(function(ps) {
    return '' + ps.pid;
  })

  function cb() {
    return done();
    //require('child_process').exec('ps', function(e, so, se) {
      //console.dir(so.split('\n'));
      //done();
    //})
  }

  // time to spin up
  setTimeout(cb, 250);
}

mock.teardown = function(done) {
  var ps;
  while(ps = processes.shift()) {
    process.kill(ps.pid);
  }
  mock.files = [];
  mock.processes = [];
  mock.pids = [];
  if(done) done();
}

mock.args = function(argv, overwrite) {
  if(overwrite && !Array.isArray(overwrite)) return argv;
  var defs = ['--no-color'];
  if(Array.isArray(overwrite)) {
    return [].concat(argv).concat(defs).concat(['--']).concat(overwrite);
  }
  return [].concat(argv).concat(defs);
}

var assert = {};

/**
 *  Expect to match all mock processes.
 */
function all(req) {
  expect(req.match).to.be.an('object');
  var keys = Object.keys(req.match);
  expect(keys.length).to.eql(mock.processes.length);
  expect(keys).to.eql(mock.pids);
}

assert.all = all;

mock.assert = assert;
module.exports = mock;
