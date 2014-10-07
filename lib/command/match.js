var patterns = require('../util/patterns')
  , print = require('../util/print')
  , convert = require('../util/convert')
  , killer = require('../killer');
function match(info, req, next) {
  if(!info.args.length) {
    return next(
      this.errors.ETOO_FEW_ARGUMENTS, [info.cmd.extra()]);
  }

  var list = convert(info.args)
    , filter = this.filter;
  patterns.call(this, list, function(err, ptns) {
    if(err) return next(err);
    var doc = killer.filter(req.psinfo.doc, filter);
    killer.match(doc, ptns, function(err, result) {
      if(err) return next(err);
      req.match = result;
      print(result, req, next);
    });
  });
}

module.exports = match;
