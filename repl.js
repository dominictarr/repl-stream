var through   = require('through')
var match     = require('./match')
var serialize = require('stream-serializer')()
var recycle   = require('cycle').retrocycle
var EventEmitter = require('events').EventEmitter

function repler (dest) {

  var emitter = new EventEmitter()
  var history = emitter.history = []
  var position = emitter.position = 0

  emitter.createStream = function () {
    var s = serialize(through(function (data) {
      console.log(data)
      if('undefined' !== typeof data.output) {
        emitter.emit('result', data)
      } else {
        emitter.emit('match', data)
      }
    }))

    function queue (data) { s.queue(data) }
    emitter.on('query', queue)
    s.once('close', function () {
      emitter.removeListener('query', queue)
    })

    return s
  }

  emitter.suggest = function (v) {
    emitter.emit('query', {suggest: v})
    return this
  }

  emitter.eval = function (v) {
    if(history[0] !== v) history.unshift(v)
    emitter.position = 0

    emitter.emit('query', {eval: v})

    return this
  }

  emitter.forward = function () {
   if(emitter.position > 0)
     emitter.emit('update', history[--emitter.position])
    return this
  }

  emitter.back = function () {
    if(history.length > emitter.position + 1)
      emitter.emit('update', history[++emitter.position])
  }

  return emitter
}

module.exports = repler

