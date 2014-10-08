var print = require('../util/print')
  , killer = require('../killer');

/**
 *  Print the parsed object graph.
 */
function graph(info, req, next) {
  var names = info.args.concat(this.filter)
    , doc = killer.filter(req.psinfo.doc, names);
  req.psinfo.doc = doc;
  print(doc, req, next);
}

module.exports = graph;
