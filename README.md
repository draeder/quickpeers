# Quickpeers
> Easily connect a partial mesh of WebRTC peers around a topic and send messages between them using a gossip protocol

Quickpeers adds broadcast and direct messaging capabilities to [@geut/discovery-swarm-webrtc](https://github.com/geut/discovery-swarm-webrtc) using a gossip protocol.

## Status (WIP)
This is currently a work in progress with a handful of objectives:

- - Both browser and node.js compatibility
- - Gossip protocol for messaging indirectly connected peers
- - Secure messages based on sender and receipient using Gun's SEA security suite
- - Minimize WebRTC signaling server communication when possible