var prefix = 'SIG';
var names = [
  "HUP",
  "INT",
  "QUIT",
  "ILL",
  "TRAP",
  "ABRT",
  "EMT",
  "FPE",
  "KILL",
  "BUS",
  "SEGV",
  "SYS",
  "PIPE",
  "ALRM",
  "TERM",
  "URG",
  "STOP",
  "TSTP",
  "CONT",
  "CHLD",
  "TTIN",
  "TTOU",
  "IO",
  "XCPU",
  "XFSZ",
  "VTALRM",
  "PROF",
  "WINCH",
  "INFO",
  "USR1",
  "USR2"
];

var map = {};
names.forEach(function each(name) {
  map[name.toLowerCase()] = name;
})

// map some common signal numbers to names
// man 2 kill (Darwin 10.8)
var numbers = {};
numbers[1] = map.hup;
numbers[2] = map.int;
numbers[3] = map.quit;
numbers[6] = map.abrt;
numbers[9] = map.kill;
numbers[14] = map.alrm;
numbers[15] = map.term;

function translate(sig) {
  sig = ('' + sig).toLowerCase();
  var str = null;
  var num = parseInt(sig);
  if(!isNaN(num) && numbers[num]) {
    str = numbers[num];
  }else{
    sig = sig.replace(/^sig/, '');
    str = map[sig];
  }
  str = !str ? map.term : str;
  return str = prefix + str;
}

module.exports = {
  map: map,
  prefix: prefix,
  names: names,
  default: prefix + map.term,
  numbers: numbers,
  translate: translate,
}
