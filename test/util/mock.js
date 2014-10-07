var writer;

var mock = {
  name: 'die',
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

mock.args = function(argv) {
  var defs = ['--no-color'];
  return [].concat(argv).concat(defs);
}

module.exports = mock;
