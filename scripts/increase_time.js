let utils = require('../test/utils/utils.js')
let Web3 = require('web3')

let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:18545'))
utils.setWeb3(web3)

let numSeconds = Number(process.argv[2])
utils.increaseTime(numSeconds)
