// taken/borrowed from ROSCA/WeTrust https://github.com/WeTrustPlatform/rosca-contracts/blob/b72ee795d2a73b5fda76b7015720b6ea5f8c8804/test/utils/utils.js
// thanks!
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

let assert = require('chai').assert;
const MAX_GAS_COST_PER_TX = 1e5 /* gas used per tx */ * 2e10; /* gas price */

// we need this becaues test env is different than script env
let myWeb3 = (typeof web3 === undefined ? undefined : web3);


module.exports = {

  crowdsaleState: {
    PREFUNDING: 0,
    FUNDING: 1,
    FUNDED: 2
  },
  deploymentPhase: '',
  diffEpsilon: 100,
  mainnet: {
    // TODO set before mainnet launch
    crowdsaleStartBlock: 0,
    crowdsaleEndBlock: 0,
    multisigWalletAddress: '0x0',
  },
  afterFee: function(amount, serviceFeeInThousandths) {
    return amount / 1000 * (1000 - serviceFeeInThousandths);
  },
  assertEqualUpToGasCosts: function(actual, expected) {
      assert.closeTo(actual, expected, MAX_GAS_COST_PER_TX);
  },
  assertThrows: function(promise, err) {
    return promise.then(function() {
      assert.isNotOk(true, err);
    }).catch(function(e) {
      //assert.include(e.message, 'invalid JUMP', "Invalid Jump error didn't occur");
      assert.include(e.message, 'invalid opcode', "Invalid opcode error didn't occur");
    });
  },
  getFunctionSelector: function(functionSignature) {
    // no spaces
    functionSignature = functionSignature.replace(/ /g, '');
    // no uints, only uint256s
    functionSignature = functionSignature.replace(/uint,/g, 'uint256,');
    functionSignature = functionSignature.replace(/uint\)/g, 'uint256)');
    return myWeb3.sha3(functionSignature).slice(0,10);
  },
  // TODO: make this more robust, can args be a single entity, not an array, replace spaces in signature,...
  getFunctionEncoding: function(functionSignature, args) {
    selector = this.getFunctionSelector(functionSignature);
    argString = '';
    for (let i = 0; i < args.length; i++) {
      paddedArg = myWeb3.toHex(args[i]).slice(2);
      while (paddedArg.length % 64 != 0) {
        paddedArg = '0' + paddedArg;
      }
      argString = argString + paddedArg;
    }
    return selector + argString;
  },
  getGasUsage: function(transactionPromise, extraData) {
    return new Promise(function(resolve, reject) {
      transactionPromise.then(function(txId) {
        resolve({
          gasUsed: myWeb3.eth.getTransactionReceipt(txId).gasUsed,
          extraData: extraData,
        });
      }).catch(function(reason) {
        reject(reason);
      });
    });
  },

  increaseTime: function(bySeconds) {
    myWeb3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [bySeconds],
      id: new Date().getTime(),
    });
  },

  mineOneBlock: function() {
    myWeb3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_mine",
      id: new Date().getTime(),
    });
  },

  mineToBlockHeight: function(targetBlockHeight) {
    while (myWeb3.eth.blockNumber < targetBlockHeight) {
      this.mineOneBlock();
    }
  },
  setWeb3: function(web3) {
    myWeb3 = web3;
  },

};
