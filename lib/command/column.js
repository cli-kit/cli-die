var print = require('../util/print');

/**
 *  Print the parsed column names (lowercase).
 */
function column(info, req, next) {
  print(req.psinfo.titles, req, next);
}

module.exports = column;
