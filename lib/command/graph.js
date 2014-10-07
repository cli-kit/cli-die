var print = require('../util/print')
  , killer = require('../killer');

function graph(info, req, next) {
  if(req.psinfo) {
    var names = info.args.concat(this.filter);
    var doc = killer.filter(req.psinfo.doc, names);
    req.psinfo.doc = doc;
    return print(doc, req, next);
  }
  next();
}

module.exports = graph;
