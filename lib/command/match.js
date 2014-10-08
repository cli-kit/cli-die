var patterns = require('../util/patterns')
  , print = require('../util/print')
  , killer = require('../killer');

function match(info, req, next) {
  if(!info.args.length) {
    return next(
      this.errors.ETOO_FEW_ARGUMENTS, [info.cmd.extra()]);
  }

  var list = killer.convert(info.args)
    , filter = this.filter
    , opts = {
      long: this.long,
    };
  patterns.call(this, list, function(err, ptns) {
    if(err) return next(err);
    opts.doc = killer.filter(req.psinfo.doc, filter);
    opts.ptns = ptns;
    killer.match(opts, function(err, result) {
      if(err) return next(err);
      req.match = result;
      print(result, req, next);
    });
  });
}

module.exports = match;
