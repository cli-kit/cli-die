var killer = require('./killer');

function ready(req, next) {

  // split filter arguments so comma-delimited and
  // whitespace-delimited are allowed
  var i, nm, delimiter = /(\s*,\s*|\s+)/, out = [];
  for(i = 0; i < this.filter.length;i++) {
    nm = this.filter[i];
    out = out.concat(nm.split(delimiter));
  }
  this.filter = out;

  var args = null;
  if(Array.isArray(req.result.skip) && req.result.skip.length) {
    args = req.result.skip;
  }

  // got -- with no subsequent args, clear ps(1) args

  var scope = this
    , log = this.log
    , pids = this.pids
    , clear = req.result.stop && !req.result.skip.length
    , opts = {
      args: args,
      username: this.username,
      uid: this.uid,
      signal: this.signal,
      cmdonly: this.cmdonly,
      noop: this.noop,
      include: this.include,
      exclude: this.exclude,
      clear: clear,
    };

  req.patterns = [];
  req.psopts = opts;

  // run ps(1) and parse output
  killer(opts, function(err, res) {
    if(err) return next(err);
    req.psinfo = res;

    // load pid pattern files
    killer.load(pids, function(err, ptns) {
      if(err) return next(err);
      req.patterns = ptns;
      next();
    });
  });
}

module.exports = ready;
