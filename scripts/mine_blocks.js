let utils = require('../test/utils/utils.js')
let Web3 = require('web3')

let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:18545'))
utils.setWeb3(web3)

let numBlocks = Number(process.argv[2])
for(let i = 0; i < numBlocks; i++) {
  utils.mineOneBlock()
}
