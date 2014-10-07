var patterns = require('../util/patterns')
  , convert = require('../util/convert');
function match(info, req, next) {
  var list = convert(info.args);
  patterns.call(this, list, function(err, list) {
    if(err) return next(err);
    //console.dir(list);
    next();
  });
}

module.exports = match;
