var http = require('http')
var fs = require('fs')
var shoe = require('shoe')

var repl = require('./eval')

shoe(function (stream) {
  stream.pipe(repl(global)).pipe(stream)
}).install(
  http.createServer(function (req, res) {
    fs.createReadStream('./index.html').pipe(res)
  }).listen(3000), '/repl'
)

