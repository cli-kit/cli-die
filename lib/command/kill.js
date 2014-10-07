var patterns = require('../util/patterns')
  , print = require('../util/print')
  , convert = require('../util/convert')
  , killer = require('../killer');

function kill(info, req, next) {
  if(!info.args.length) {
    return next(
      this.errors.ETOO_FEW_ARGUMENTS, [info.cmd.extra()]);
  }

  var list = convert(info.args)
    , filter = this.filter
    , opts = {
      long: this.long,
    };
  patterns.call(this, list, function(err, ptns) {
    if(err) return next(err);
    var doc = killer.filter(req.psinfo.doc, filter);
    killer.match(doc, ptns, opts, function(err, result) {
      if(err) return next(err);
      print(result, req, next);
      //console.log('signal %s', req.psinfo.signal);
      //next();
    });
  });
}

module.exports = kill;
