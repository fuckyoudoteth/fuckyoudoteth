const path = require('path')
const jsonfile = require('jsonfile')

let FuckYouAuction = artifacts.require('FuckYouAuction')
let FuckYouCoin = artifacts.require('FuckYouCoin')
let MultiSigWallet = artifacts.require('MultiSigWallet')

module.exports = function(deployer, network) {
  if(network == 'development') {
    let multisig, auction, coin
    Promise.resolve({
    }).then(function() {
      return deployer.deploy(MultiSigWallet, web3.eth.accounts, 2)
    }).then(function() {
      return MultiSigWallet.deployed()
    }).then(function(contract) {
      multisig = contract
      return deployer.deploy(FuckYouAuction, 86400)
    }).then(function() {
      return FuckYouAuction.deployed()
    }).then(function(contract) {
      auction = contract
      return deployer.deploy(FuckYouCoin, multisig.address, web3.eth.blockNumber + 2)
    }).then(function() {
      return FuckYouCoin.deployed()
    }).then(function(contract) {
      coin = contract
    }).then(function() {
      const constantsDir = 'constants'
      jsonfile.writeFileSync(
        path.join(constantsDir, 'MultiSigWallet', 'address.json'),
        multisig.address)
      jsonfile.writeFileSync(
        path.join(constantsDir, 'FuckYouCoin', 'address.json'),
        coin.address)
      jsonfile.writeFileSync(
        path.join(constantsDir, 'FuckYouAuction', 'address.json'),
        auction.address)
    }).catch(function(error) {
      console.log('error:', error)
    })

  }
}
