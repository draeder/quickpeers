const Quickpeers = require('./')

let quickpeers = new Quickpeers('some unique identifier', 5) // new Quickpeers(identifier, maxPeers)
console.log(quickpeers.address)

// Directly connected peers
// Indirectly connected peers will be supported soon
quickpeers.on('connected', peer => {
  console.log('Connected!', peer)
})

// Send messages from Node.js console
// enter free text to broadcast to all
// Or to a specific peer address: addressHash: message
process.stdout.on('data', data => {
  data = data.toString().split(': ')
  if(data[0] && data[1]) quickpeers.send(data[0], data[1].toString().trim())
  else quickpeers.send(data.toString().trim())
})

let last
quickpeers.on('message', data => {
  if(data === last) return
  console.log(data)
  data = last
})

quickpeers.on('disconnect', peer => {
  console.log('Disconnected:', peer)
})