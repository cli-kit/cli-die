var EOL = require('os').EOL
  , exe = 'ps'
  , args = ['-axf']
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
      console.dir(key);
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
    console.dir(val);
    val.forEach(function eeachval(value, ind, arr) {
      var key = titles[ind];
      if(Array.isArray(doc[key])) {
        doc[key].push(value);
      }
      //console.dir(key);
      //console.dir(doc[key]);
      //doc[key].push(value);
      //console.dir(value);
    })
  })

  //console.dir(lines[0]);

  console.dir(titles);


  return doc;
}

function killer(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = opts || {};
  opts.exe = opts.exe || exe;
  opts.args = opts.args || args;
  run(opts, function(err, res) {
    if(err || (res && !res.out)) return cb(err);
    //console.log(res.out);
    var doc = parse(res.out, opts, cb);
    console.dir(doc);
    cb();
  });
}

module.exports = killer;
