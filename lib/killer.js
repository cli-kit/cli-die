var EOL = require('os').EOL
  , PID = 'pid'
  , async = require('async')
  , fs = require('fs')
  , util = require('util')
  , exec = require('child_process').exec
  , regexp = require('cli-regexp')
  , merge = require('cli-util').merge
  , signals = require('./signals')
  , exe = 'ps'
  , args = ['-axf'];

/**
 *  Modifies the argument list passed to ps(1)
 *  based on supplied options.
 */
function killer(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  var result = {};
  opts = opts || {};
  opts.exe = opts.exe || exe;
  opts.args = opts.args || args;

  if(opts.username && !~opts.args.indexOf('-u')) {
    opts.args.push('-u', opts.username);
  }

  if(opts.uid && !~opts.args.indexOf('-U')) {
    opts.args.push('-U', opts.uid);
  }

  if(opts.cmdonly && !~opts.args.indexOf('-c')) {
    opts.args.push('-c');
  }

  // execute ps
  run(opts, function(err, res) {
    if(err || (res && !res.out)) return cb(err);
    // parse to object graph
    var parsed = parse(res.out, opts, cb);
    result.doc = parsed.doc;
    result.titles = parsed.titles;
    result.signal = signals.translate(opts.signal);
    // return the result, caller may match() or not
    cb(null, result);
  });
}

/**
 *  Run ps(1).
 */
function run(opts, cb) {
  var cmd = [opts.exe].concat(opts.args).join(' ');
  exec(cmd, function(err, stdout, stderr) {
    var code = err && err.code ? err.code : 0;
    cb(err, {code: code, error: err, out: stdout, err: stderr});
  })
}

/**
 *  Load patterns from files.
 */
function load(files, cb) {
  files = files || [];
  async.concat(files, function(file, cb) {
    fs.readFile(file, function(err, buf) {
      if(err) return cb(err);
      var contents = '' + buf;
      var lines = contents.split(EOL);
      lines = lines.filter(function(line) {
        return line;
      })
      cb(null, lines);
    });
  }, function complete(err, result) {
    cb(err, result);
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

  // maintain some internal properties
  define(doc, '_titles', titles);
  define(doc, '_pids', doc.pid);
  define(doc, '_raw', {});
  for(k in doc) {
    doc._raw[k] = merge(doc[k], [], {copy: true});
  }

  return {doc: doc, titles: titles};
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
 *  Match patterns to an object graph document.
 */
function match(doc, ptns, opts, cb) {

  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = opts || {};

  var result = {}, k, list, matches = [], pids = [];

  function add(match, index, ptn, pid, row, key) {
    matches.push(
      {match: match, index: index,
        ptn: ptn, pid: parseInt(pid), row: row, key: key});
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
              add(list[i], i, ptns[j], pid, row, key);
            }
          }
          continue;
        }
        if(ptns[j].test('' + list[i])) {
          add(list[i], i, '' + ptns[j], pid, row, key);
        }
      }
    }
    return matches;
  }

  // find matches
  for(k in doc) {
    list = doc[k];
    matches = matches.concat(find(ptns, list, k));
  }

  // collect array of pids
  matches.forEach(function(m) {
    pids.push(m.pid);
    if(!opts.long) {
      result[m.pid] = m.row;
    }
  })

  // more information when long
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

/**
 *  Utility to convert an array of pattern candidates
 *  to numbers or string patterns.
 */
function convert(ptns) {
  ptns = ptns.map(function(ptn) {
    if(regexp.seems(ptn)) return ptn;
    var num = parseInt(ptn);
    if(!isNaN(num)) return num;
    return '/^' + ptn + '$/';
  })
  return ptns;
}

/**
 *  @private
 *
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
 *  @private
 *
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

killer.parse = parse;
killer.convert = convert;
killer.filter = filter;
killer.match = match;
killer.load = load;
killer.kill = kill;

module.exports = killer;
