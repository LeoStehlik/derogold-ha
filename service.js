// Copyright (c) 2018, Brandon Lehmann, The TurtleCoin Developers
// Copyright (c) 2019, Leos Stehlik, adapted for use with DeroGold
//
// Please see the included LICENSE file for more information.

'use strict'

const DeroGoldd = require('./')
const util = require('util')

var daemon = new DeroGoldd({
  loadCheckpoints: './checkpoints.csv',
  // Load additional daemon parameters here
  enableCors: false, // Enable CORS support for the domain in this value
  enableBlockExplorer: false, // Enable the block explorer
  loadCheckpoints: false, // If set to a path to a file, will supply that file to the daemon if it exists.
  dataDirectory: '/root/.DeroGold',
  rpcBindIp: '0.0.0.0', // What IP to bind the RPC server to
  rpcBindPort: 6969, // What Port to bind the RPC server to
  p2pBindIp: '127.0.0.0', // What IP to bind the P2P network to
  p2pBindPort: 42069, // What Port to bind the P2P network to
  p2pExternalPort: 0, // What External Port to bind the P2P network to for those behind NAT
  feeAddress: '"dg47xN74St6btXZUDo96NW7G62djERbst3eFuiQCaMo1AADep62Siqu3vmnDcc3tFXf1wgnVKvGwD1eyYZqYBhrB2ChcBtGJL', // allows to specify the fee address for the node
  feeAmount: 99000 // allows to specify the fee amount for the node

})

function log (message) {
  console.log(util.format('%s: %s', (new Date()).toUTCString(), message))
}

daemon.on('start', (args) => {
  log(util.format('DeroGoldd has started... %s', args))
})

daemon.on('started', () => {
  log('DeroGoldd is attempting to synchronize with the network...')
})

daemon.on('syncing', (info) => {
  log(util.format('DeroGoldd has synchronized %s out of %s blocks [%s%]', info.height, info.network_height, info.percent))
})

daemon.on('synced', () => {
  log('DeroGoldd is synchronized with the network...')
})

daemon.on('ready', (info) => {
  log(util.format('DeroGoldd is waiting for connections at %s @ %s - %s H/s', info.height, info.difficulty, info.globalHashRate))
})

daemon.on('desync', (daemon, network, deviance) => {
  log(util.format('DeroGoldd is currently off the blockchain by %s blocks. Network: %s  Daemon: %s', deviance, network, daemon))
})

daemon.on('down', () => {
  log('DeroGoldd is not responding... stopping process...')
  daemon.stop()
})

daemon.on('stopped', (exitcode) => {
  log(util.format('DeroGoldd has closed (exitcode: %s)... restarting process...', exitcode))
  daemon.start()
})

daemon.on('info', (info) => {
  log(info)
})

daemon.on('error', (err) => {
  log(err)
})

daemon.start()
