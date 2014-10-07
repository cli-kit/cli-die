var path = require('path')
  , fs = require('fs')
  , spawn = require('child_process').spawn
  , bin = path.normalize(path.join(__dirname, '..', 'bin'))
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
      processes.push(spawn(cmd, argv, opts));
    })
  })

  mock.pids = processes.map(function(ps) {
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
  processes.forEach(function(ps) {
    process.kill(ps.pid);
  })
  done();
}

mock.args = function(argv) {
  var defs = ['--no-color'];
  return [].concat(argv).concat(defs);
}

module.exports = mock;
