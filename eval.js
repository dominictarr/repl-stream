var match = require('./match')
var through = require('through')
var serialize = require('stream-serializer')()
var decycle = require('cycle').decycle

module.exports = function (context) {
  return serialize(through (function (query) {
    if(query.eval) {
      var out, err = 0
      try {
        out = evaluate(query.eval, context)
      } catch (_err) {
        out = _err.stack
        err = _err
      }
      this.queue({error: decycle(err), output: decycle(out)})
    } else if(query.suggest) {
      var v = query.suggest
      var path = match.test(v)
      var obj = match.top(context, path)
      var last = path.slice().pop()
      var s = match.suggest(obj, last)
      var common = match.common(s)

      if(common)
        v += common.substring(last.length)

      this.queue({suggest: v, match: s})
    }
  }))
}


function evaluate (e, context) {
  if(context)
    with(context) {
      return eval(e)
    }
  return eval(e)
}

function toValue (o) {
  if('undefined' === typeof o)
    return undefined
  if(o == null)
    return o
  if('object' !== typeof o)
    return o
  return Array.isArray(o) ? [] : {}
}

function flat (o) {
  if('undefined' === typeof o)
    return undefined
  if('function' === typeof o)
    return o.toString()
  if(o && 'object' !== typeof o)
    return o
  var a = Array.isArray(o) ? [] : {}
  for(var i in o)
    a[i] = toValue(o[i])
  return a
}


