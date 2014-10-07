var regexp = require('cli-regexp');

function patterns(ptns, cb) {
  ptns = ptns || [];
  var out = [], i, re;

  for(i = 0;i < ptns.length;i++) {
    if(!regexp.seems(ptns[i])) {
      return cb(this.wrap(this.errors.EREGEXP, [ptns[i]]));
    }
    try {
      re = regexp.parse(ptns[i]);
    }catch(e) {
      return cb(this.wrap(this.errors.EREGEXP_COMPILE, [ptns[i]]));
    }
    out.push(re);
  }
  return cb(null, out);
}

module.exports = patterns;