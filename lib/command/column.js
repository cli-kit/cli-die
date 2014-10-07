var print = require('../util/print');

function column(info, req, next) {
  if(req.psinfo) {
    return print(req.psinfo.titles, req, next);
  }
  next();
}

module.exports = column;
