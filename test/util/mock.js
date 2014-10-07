var path = require('path')
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
      processes.push(ps);
      var contents = '' + ps.pid + '\n # a comment line\n\n\nnon-match\n';
      fs.writeFileSync(file, contents);
      mock.files.push(file);
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
