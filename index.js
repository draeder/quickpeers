const crypto = require('crypto')
const EventEmitter = require('events').EventEmitter
const wrtc = require('wrtc')
const Swarm = require('@geut/discovery-swarm-webrtc')

const Quickpeers = function(id, maxPeers){
  let quickpeers = this
  
  const events = new EventEmitter()
  quickpeers.on = events.on.bind(events)
  quickpeers.once = events.once.bind(events)
  quickpeers.emit = events.emit.bind(events)
  quickpeers.send = () => {}
  quickpeers.off = events.off.bind(events)

  const swarm = Swarm({
    id: crypto.randomBytes(32),
    bootstrap: ['wss://quickpeers.herokuapp.com', 'wss://geut-webrtc-signal-v3.herokuapp.com', 'wss://geut-webrtc-signal-v3.glitch.me'],
    simplePeer: {wrtc},
    timeout: 15 * 1000,
    maxPeers: maxPeers
  })
  
  this.address = swarm.id.toString('hex')
  
  const topic = crypto.createHash('sha256')
  .update(id)
  .digest()
  
  swarm.join(topic)

  let peers = {}
  swarm.on('connection', (peer, details) => {
    peers[details.id.toString('hex')] = peer
    quickpeers.count = Object.keys(peers).length

    quickpeers.emit('connected', details.id.toString('hex'))

    peer.on('data', data => { 
      try{
        data = JSON.parse(data.toString())
        if(data.to === this.address) {
          quickpeers.emit('message', {from: data.from, message: data.message})
        }
        if(Object.keys(peers).includes(data.to)){
          peers[data.to].send(JSON.stringify(data))
        } else
        if(data.type === 'broadcast'){
          Object.keys(peers).forEach(p => {
            data.type = 'direct'
            data.to = p
            if(data.from !== data.to)
            peers[p].send(JSON.stringify(data))
          })
        }
      }
      catch (err){
        console.log(err)
      }
    })

    quickpeers.send = (to, message) => {
      if(!message) { 
        message = {
          type: "broadcast",
          from: this.address,
          message: to
        }
        Object.keys(peers).forEach(peer => {
          message.to = peer
          peers[peer].send(JSON.stringify(message))
        })
      }
      
      message = {
        type: "direct",
        to: to,
        from: this.address,
        message: message
      }
      if(Object.keys(peers).includes(to)){
        peers[to].send(JSON.stringify(message))
      } else {
        Object.keys(peers).forEach(p => {
          peers[p].send(JSON.stringify(message))
        })
      }
    }

    peer.on('close', ()=>{
      quickpeers.count--
      let oldPeers = Object.keys(peers)
      let newPeers = swarm.getPeers().map(peer => peer.id.toString('hex'))
      let r = oldPeers.filter(e => !newPeers.find(a => e === a))[0]
      delete peers[r]
      quickpeers.emit('disconnect', r)
    })
  })
}

module.exports = Quickpeers