function before(info, req, next) {
  info.args = info.args.concat(req.patterns);
  next();
}

module.exports = before;
