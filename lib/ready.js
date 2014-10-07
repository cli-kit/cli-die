var killer = require('./killer');

function ready(req, next) {
  var args = null;
  if(Array.isArray(req.result.skip) && req.result.skip.length) {
    args = req.result.skip;
  }
  var scope = this
    , log = this.log
    , opts = {
      args: args,
      username: this.username,
      uid: this.uid,
      signal: this.signal,
      cmdonly: this.cmdonly,
      noop: this.noop,
      include: this.include,
      exclude: this.exclude,
    };

  // parse output
  killer(opts, function(err, res) {
    if(err) return next(err);
    req.psinfo = res;
    next();
  });
}

module.exports = ready;
