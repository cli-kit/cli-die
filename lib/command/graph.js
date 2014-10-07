var print = require('../util/print')
  , killer = require('../killer');

function graph(info, req, next) {
  if(req.psinfo) {
    var names = info.args.concat(this.filter);
    var out = killer.filter(req.psinfo.doc, names);
    return print(out, req, next);
  }
  next();
}

module.exports = graph;
