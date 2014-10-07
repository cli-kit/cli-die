var EOL = require('os').EOL
  , PID = 'pid'
  , async = require('async')
  , util = require('util')
  , exec = require('child_process').exec
  , regexp = require('cli-regexp')
  , merge = require('cli-util').merge
  , signals = require('./signals')
  , exe = 'ps'
  , args = ['-axf'];

/**
 *  Utility for defining non-enumerable properties.
 */
function define(target, name, value) {
  Object.defineProperty(target, name, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  });
}

/**
 *  Utility to convert an array of pattern candidates
 *  to numbers or regular expressions.
 */
function convert(ptns) {
  ptns = ptns.map(function(ptn) {
    var num;
    if(regexp.seems(ptn)) return ptn;
    num = parseInt(ptn);
    if(!isNaN(num)) return num;
    return '/^' + ptn + '$/';
  })
  return ptns;
}

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
 *  Parse output of ps(1) to object graph.
 */
function parse(result, opts, cb) {
  var args = opts.args.join(' ')
    , doc = {}
    , lines = result.split(EOL)
    , ptn = /\s+/
    , k
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

  define(doc, '_titles', titles);
  define(doc, '_pids', doc.pid);
  define(doc, '_raw', {});

  for(k in doc) {
    doc._raw[k] = merge(doc[k], [], {copy: true});
  }

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

  if(opts.username && !~opts.args.indexOf('-u')) {
    opts.args.push('-u', opts.username);
  }

  if(opts.uid && !~opts.args.indexOf('-U')) {
    opts.args.push('-U', opts.uid);
  }

  if(opts.cmdonly&& !~opts.args.indexOf('-c')) {
    opts.args.push('-c');
  }

  // execute ps
  run(opts, function(err, res) {
    if(err || (res && !res.out)) return cb(err);

    // parse to object graph
    parsed = parse(res.out, opts, cb);
    result.doc = parsed.doc;
    result.titles = parsed.titles;
    result.signal = signals.translate(opts.signal);

    // return the result, caller may match or not
    cb(null, result);
  });
}

/**
 *  Filter object graph by array of column names.
 */
function filter(doc, names) {
  if(!names || !Array.isArray(names) || !names.length) {
    return doc;
  }
  var out = {};
  if(names.length) {
    names.forEach(function(a, ind, arr) {
      if(doc[a]) {
        out[a] = merge(doc[a], [], {copy: true});
      }
    })
  }else{
    out = doc;
  }

  // pass through internal properties
  define(out, '_titles', doc._titles);
  define(out, '_pids', doc._pids);
  define(out, '_raw', doc._raw);

  return out;
}

/**
 *  Collect an object representing an entry.
 */
function collect(doc, index) {
  var raw = doc._raw, k, o = {};
  for(k in raw) {
    o[k] = raw[k][index];
  }
  return o;
}

/**
 *  Match patterns to an object graph document.
 */
function match(doc, ptns, opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  opts = opts || {};
  var result = {}, k, list, matches = [], pids = []

  function add(match, index, ptn, pid, row) {
    matches.push(
      {
        match: match,
        index: index,
        ptn: ptn,
        pid: pid,
        row: row
      }
    );
  }

  function find(ptns, list, key) {
    var i, j, matches = [], pid;
    for(i = 0;i < list.length;i++) {
      pid = doc._pids[i];
      row = collect(doc, i);
      for(j = 0;j < ptns.length;j++) {
        if(!(ptns[j] instanceof RegExp)) {
          // numeric integer patterns only ever match the pid column
          if(typeof ptns[j] === 'number' && key === PID) {
            if(ptns[j] === parseInt(pid)) {
              add(list[i], i, ptns[j], pid, row);
            }
          }
          continue;
        }
        if(ptns[j].test('' + list[i])) {
          add(list[i], i, '' + ptns[j], pid, row);
        }
      }
    }
    return matches;
  }

  for(k in doc) {
    list = doc[k];
    matches = matches.concat(find(ptns, list, k));
  }

  matches.forEach(function(m) {
    pids.push(m.pid);
    if(!opts.long) {
      result[m.pid] = m.row;
    }
  })

  if(opts.long) {
    result = matches;
  }

  define(result, '_pids', pids);

  cb(null, result);
}

/**
 *  Send signal to pid list.
 */
function kill(opts, cb) {
  opts = opts || {};
  var pids = opts.pids || []
    , signal = opts.signal
    , executes = opts.exec
    , result = {ok: true};
  if(!executes) {
    pids.forEach(function(pid) {
      process.kill(pid, signal);
    })
    result.pids = pids;
    cb(null, result);
  }else{
    signal = signal.replace(/^sig/i, '').toUpperCase();
    var cmd = util.format('%s -s %s', 'kill', signal);
    async.eachSeries(pids, function iterator(pid, cb) {
      cmd = util.format('%s %s', cmd, pid);
      exec(cmd, function(err, stdout, stderr) {
        if(err) return cb(err);
        result.pids = result.pids || [];
        result.pids.push(pid);
        cb();
      });
    }, function complete(err) {
      if(err) {
        result.ok = false;
        return cb(err, result);
      }
      cb(null, result);
    });
  }
}

killer.convert = convert;
killer.filter = filter;
killer.match = match;
killer.kill = kill;

module.exports = killer;
