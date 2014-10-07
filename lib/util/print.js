var circular = require('circular')
  EOL = require('os').EOL;

function print(doc) {
  process.stdout.write(circular.stringify(doc, 2) + EOL);
}

module.exports = print;
