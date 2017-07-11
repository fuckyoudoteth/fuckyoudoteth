var fs = require('fs')
var path = require('path')

var jsonfile = require('jsonfile')

var contracts = [
  'FuckYouAuction',
  'FuckYouCoin',
  'MultiSigWallet',
]

contractDir = 'build/contracts'
constantsDir = 'constants'

contracts.forEach(function(contractName) {
  var contractFile = path.join(contractDir, contractName + '.json')
  var contractData = jsonfile.readFileSync(contractFile)

  var contractConstantsDir = path.join(constantsDir, contractName)
  if (!fs.existsSync(contractConstantsDir)){
    fs.mkdirSync(contractConstantsDir);
  }
  var abiFile = path.join(contractConstantsDir, 'abi.json')
  jsonfile.writeFileSync(abiFile, contractData.abi)
  var binFile = path.join(contractConstantsDir, 'bin.json')
  jsonfile.writeFileSync(binFile, contractData.unlinked_binary)
  var addressFile = path.join(contractConstantsDir, 'address.json')
  if (!fs.existsSync(addressFile)){
    jsonfile.writeFileSync(addressFile, '')
  }
})

var constants = {
  contracts: {}
}
contracts.forEach(function(contractName) {
  var contractConstantsDir = path.join(constantsDir, contractName)
  var addressFile = path.join(contractConstantsDir, 'address.json')
  var abiFile = path.join(contractConstantsDir, 'abi.json')
  constants.contracts[contractName] = {
    address: jsonfile.readFileSync(addressFile),
    abi: jsonfile.readFileSync(abiFile)
  }
})

jsonfile.writeFileSync('constants.json', constants)
