var h         = require('hyperscript')
var reconnect = require('reconnect')
var repler    = require('./repl')

function flatten (o) {
  return JSON.stringify(o, null, 2)
}

var repl = repler()

reconnect(function (stream) {
  //how to handle incoming connections?
  //incoming connection provides metadata
  //(useragent) and then user can config who it's
  //running commands on (whitelist or blacklist)
  //UI could mix all outputs together,
  //or seprate them into windows...
  stream.pipe(repl.createStream(/*name*/)).pipe(stream)
  //probably pass in the name,
  //or, a header describes the dest.
}).connect('/repl')

repl.on('result', function (data) {
  output.innerHTML = ''
  output.appendChild(h('pre', data.error ? data.output : flatten(data.output)))
})

repl.on('match', function (data) {
  var s = data.match || [], v = data.suggest

  input.value = data.suggest || input.value
  output.innerHTML = ''
  if(s.length > 1)
    s.forEach(function (e) {
      output.appendChild(h('span', {style: {
        'font-family': 'monospace',
        'display': 'inline-block'
      }}, e))

      output.appendChild(h('span', ' '))
    })
})

var input = h('input', {size: 80, onkeydown: function (e) {
  var v = input.value
  if(e.keyCode === 9) {//tab
    //complete if possible.

    repl.suggest(v)
    e.preventDefault()

  } else if (e.keyCode === 13) {
    //eval!    
    repl.eval(input.value)
    input.select()
    e.preventDefault()
  } else if(e.keyCode === 38) { //up arrow
    repl.back()
    e.preventDefault()
  } else if(e.keyCode === 40) { //down arrow
    repl.forward()
    e.preventDefault()
   }
}})

repl.on('update', function (v) {
  input.value = v
})

var output = h('div')

var div = h('div', input, output)

document.body.appendChild(div)

