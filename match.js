var match = /[.]/
  // /('[^']+')|("[^"]+")|([A-z_$][A-z0-9]+)|([.])/
  // /[.]|(?:\[\s*['"]?)|(?:['"]?\s*\])/
  // /[.]/

function test(b) {
  var x = b.split(match)//match.exec(b)
  return x
}

exports.test    = test
exports.top     = top
exports.suggest = suggest
exports.common  = common

function top(obj, path) {
  path = path.slice()
  var last = path.pop()

  while(path.length) {
    obj = obj[path.shift()]
    if(!obj) return
  }
  return obj
}

function suggest(obj, last) {
  var s = []
  for(var k in obj) {
    if(k.indexOf(last) === 0)
      s.push(k)
   }

  return s
}
//take an array of strings and find
//the longest common prefix
function common (a) {
  console.log('Common', a)
  return a.reduce(function (m, c) {
    if(!m) return m
    if(m === c) return c
    if('number' === typeof m)
      return m

    var best = ''
    for(var i = 0; i < c.length; i++) {
      if(m[i] !== c[i])
        return best
      best += m[i]
    }
  }, a[0])
}

if(!module.parent) {

  function t(obj, cmd) {
    var path = test(cmd)
    var _obj = top(obj, path)
    var last = path.slice().pop()
    var paths = suggest(_obj, last)

    var rest = common(paths)

    console.log(path, '->', paths, rest)
  }

  var obj = {foo: {bar: ['A', 'B', 'C'], baz: 'BAZ'}}

  t(obj, 'foo.bar')
  t(obj, 'foo.ba')
  t(obj, 'foo.bar.')

  t(obj, 'foo.b')

}
