var patterns = require('../util/patterns')
  , print = require('../util/print')
  , killer = require('../killer');

function kill(info, req, next) {
  if(!info.args.length) {
    return next(
      this.errors.ETOO_FEW_ARGUMENTS, [info.cmd.extra()]);
  }

  var list = killer.convert(info.args)
    , wrap = this.wrap
    , errors = this.errors
    , filter = this.filter
    , noop = this.noop
    , exec = this.exec
    , opts = {
      long: this.long,
    };
  patterns.call(this, list, function(err, ptns) {
    if(err) return next(err);
    var doc = killer.filter(req.psinfo.doc, filter);
    killer.match(doc, ptns, opts, function(err, result) {
      if(err) return next(err);
      if(noop) return print(result, req, next);

      if(!result._pids.length) {
        return next(wrap(errors.EMATCH));
      }

      var pids = result._pids;
      var kopts = {
        pids: result._pids,
        signal: req.psinfo.signal,
        exec: exec
      }
      killer.kill(kopts, function(err, result) {
        if(err) return next(err);
        req.kill = result;
        if(result) return print(result, req, next);
        next();
      })
    });
  });
}

module.exports = kill;
