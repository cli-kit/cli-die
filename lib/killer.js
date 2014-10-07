var EOL = require('os').EOL
  , exe = 'ps'
  , args = ['-axf']
  , signals = require('./signals')
  , exec = require('child_process').exec;

/**
 * Run ps(1).
 */
function run(opts, cb) {
  var cmd = [opts.exe].concat(opts.args).join(' ');
  exec(cmd, function(err, stdout, stderr) {
    var code = err && err.code ? err.code : 0;
    cb(err, {code: code, error: err, out: stdout, err: stderr});
  })
}

/**
 *  Parse output of ps(1) to object.
 */
function parse(result, opts, cb) {
  var args = opts.args.join(' ')
    , doc = {}
    , lines = result.split(EOL)
    , ptn = /\s+/
    , filter = function filter(t){return t;};

  args = args.replace(/^-+/, '');
  lines = lines.filter(function(line) {
    return line;
  })

  var columns = lines.shift()
    , titles = columns.split(ptn).filter(filter)
      .map(function(t) {
        return t.toLowerCase()
      })

  titles.forEach(function(t) {
    doc[t] = [];
  })

  lines = lines.map(function(l) {
    var parts = l.split(ptn)
      , i
      , key
      , command = 'cmd';
    parts = parts.filter(filter);
    for(i = 0;i < parts.length;i++) {
      key = titles[i];
      if(key === command) {
        break;
      }
    }

    // gobble command parts
    var before = parts.slice(0, i);
    var cmd = parts.slice(i).join(' ');
    parts = before.concat(cmd);
    return parts;
  })

  lines.forEach(function each(val, ind, arr) {
    val.forEach(function eeachval(value, ind, arr) {
      var key = titles[ind];
      if(Array.isArray(doc[key])) {
        doc[key].push(value);
      }
    })
  })

  return {doc: doc, titles: titles};
}

function killer(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  var result = {}, parsed;
  opts = opts || {};
  opts.exe = opts.exe || exe;
  opts.args = opts.args || args;
  run(opts, function(err, res) {
    if(err || (res && !res.out)) return cb(err);
    parsed = parse(res.out, opts, cb);
    result.doc = parsed.doc;
    result.titles = parsed.titles;
    cb(null, result);
  });
}

module.exports = killer;
