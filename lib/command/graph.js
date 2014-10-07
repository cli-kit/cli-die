var print = require('../util/print')
  , merge = require('cli-util').merge;

function graph(info, req, next) {
  if(req.psinfo) {
    var doc = req.psinfo.doc
      , out = {};
    if(info.args.length) {
      info.args.forEach(function(a, ind, arr) {
        if(doc[a]) {
          out[a] = merge(doc[a], [], {copy: true});
        }
      })
    }else{
      out = doc;
    }
    return print(out, req, next);
  }
  next();
}

module.exports = graph;
