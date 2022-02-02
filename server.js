const { SignalServer } = require('@geut/discovery-swarm-webrtc/server')

const server = require('http').createServer((_, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Signal running OK\n')
})

const signal = new SignalServer({ 
  server,
  requestTimeout: 60 * 1000
})

signal.on('error', (err) => console.error('signal-error', err))
//signal.on('connection-error', (err) => console.error('connection-error', err))
signal.on('rpc-error', (err) => console.error('rpc-error', err))
signal.on('peer-error', err => console.log('peer-error', err))
signal.on('connect-failed', err => console.log('connect-failed', err))

signal.on('test', data => console.log(data))

const port = process.env.PORT || 4000

server.listen(port, () => {
  console.log('discovery-swarm-webrtc running on %s', port)
})