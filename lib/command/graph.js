var print = require('../util/print')
  , killer = require('../killer');

function graph(info, req, next) {
  if(req.psinfo) {
    var out = killer.filter(req.psinfo.doc, info.args);
    return print(out, req, next);
  }
  next();
}

module.exports = graph;
