var regexp = require('cli-regexp');

function convert(ptns) {
  ptns = ptns.map(function(ptn) {
    if(regexp.seems(ptn)) return ptn;
    return '/^' + ptn + '$/';
  })
  return ptns;
}

module.exports = convert;
