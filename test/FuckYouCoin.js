// Tests for FuckYouCoin.sol
// One contract for each state in our state machine
// At least one "it" for each function call
// States: Before Crowdsale, During Crowdsale, Successful Crowdsale, Failed Crowdsale, Update
// Functions: transfer, create, refund, allowance, finalizeCrowdfunding, totalSupply,balanceOf, allowance, fundingNow

let utils = require("./utils/utils.js");
utils.setWeb3(web3)

// contracts
let FuckYouCoin = artifacts.require('FuckYouCoin');
let MultiSigWallet = artifacts.require('MultiSigWallet');

contract('Crowdsale', function(accounts){
  let prefix = 'Before Crowdsale -- ';
  // ---------------------------------------------
  // ------------- BEFORE CROWDSALE --------------
  // ---------------------------------------------
  it(prefix + 'getState returns PreFunding', function(done) {
    let upgradeMaster, startBlock, endBlock, token;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 10;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(instance){
      token = instance;
      return utils.assertThrows(FuckYouCoin.new(accounts[0], startBlock), 'cannot create token with fake wallet');
    }).then(function(){
      return token.getState();
    }).then(function(state){
      assert.equal(state, utils.crowdsaleState.PREFUNDING);
    }).then(done).catch(done);
  });
  it(prefix + 'disallows transfer', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const startBlock = web3.eth.blockNumber + 10;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.assertThrows(token.transfer(accounts[0], 1), "expected transfer to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows transferFrom', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const startBlock = web3.eth.blockNumber + 10;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.assertThrows(token.transferFrom(accounts[0], accounts[1], 1), "expected transferFrom to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows create', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const startBlock = web3.eth.blockNumber + 10;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      return utils.assertThrows(token.create(), "expected create to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows finalizeCrowdfunding', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const startBlock = web3.eth.blockNumber + 10;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      return utils.assertThrows(token.finalizeCrowdfunding(), "expected finalizeCrowdfunding to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'allows totalSupply, which is 0', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const startBlock = web3.eth.blockNumber + 10;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      return token.totalSupply();
    }).then(function(supply){
      assert(supply.equals(0));
    }).then(done).catch(done);
  });
  it(prefix + 'allows balanceOf, which is 0', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const startBlock = web3.eth.blockNumber + 10;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      for (let i = 0; i < accounts.length; i++){
        token.balanceOf(accounts[i]).then(function(balance){
          assert(balance.equals(0));
        });
      }
    }).then(done).catch(done);
  });
  it(prefix + 'disallows approve', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const startBlock = web3.eth.blockNumber + 10;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      return utils.assertThrows(token.approve(accounts[0],1), "expected approve to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'allows allowance, which is 0', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const startBlock = web3.eth.blockNumber + 10;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      for (let i = 0; i < accounts.length; i++){
        for (let j = 0; j < accounts.length; j++){
          token.allowance(accounts[i], accounts[j]).then(function(allowed){
            assert(allowed.equals(0));
          });
        }
      }
    }).then(done).catch(done);
  });
  // // // // ---------------------------------------------
  // // // // ------------- DURING CROWDSALE --------------
  // // // // ---------------------------------------------
  prefix = 'During Crowdsale -- ';
  it(prefix + 'getState returns Funding', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.getState();
    }).then(function(state){
      return assert.equal(state, utils.crowdsaleState.FUNDING);
    }).then(done).catch(done);
  });
  it(prefix + 'disallows transfer', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineOneBlock();
      utils.mineOneBlock();
      return utils.assertThrows(token.transfer(accounts[0], 1), "expected transfer to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows transferFrom', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineOneBlock();
      utils.mineOneBlock();
      return utils.assertThrows(token.transferFrom(accounts[0], accounts[1], 1), "expected transferFrom to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows approve', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineOneBlock();
      utils.mineOneBlock();
      return utils.assertThrows(token.approve(accounts[0], 1), "expected approve to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'allows create', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineOneBlock();
      utils.mineOneBlock();
      token.create({ value: 1 });
    }).then(done).catch(done);
  });
  it(prefix + 'disallows creation of too many tokens', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.crowdfundMaxEther().then(function(ethMax){
        return ethMax;
      }).then(function(maxWeiForSuccess){
        // TODO: should assert that we have this much wei too

        return utils.assertThrows(token.create({ from: accounts[0], value: maxWeiForSuccess.add(1) }), "expected create to fail");
      });
    }).then(done).catch(done);
  });
  it(prefix + 'disallows finalizeCrowdfunding', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      utils.assertThrows(token.finalizeCrowdfunding(), "expected finalizeCrowdfunding to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'allows totalSupply', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      // create some tokens
      return token.create({ value: web3.toWei(1, 'ether') }).then(function(){
        return token.totalSupply().then(function(supply){
          return token.tokensPerEther().then(function(exchangeRate){
            assert(web3.fromWei(supply, 'ether').equals(exchangeRate));
          });
        });
      });
    }).then(done).catch(done);
  });
  it(prefix + 'allows balanceOf', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      // create some tokens
      return token.create({ value: web3.toWei(1, 'ether') }).then(function(){
        return token.balanceOf(accounts[0]).then(function(balance){
          return token.tokensPerEther().then(function(exchangeRate){
            assert(web3.fromWei(balance, 'ether').equals(exchangeRate));
          });
        });
      });
    }).then(done).catch(done);
  });
  it(prefix + 'disallows approve', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      utils.assertThrows(token.approve(accounts[0],1), "expected approve to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'allows allowance, which is 0', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      for (let i = 0; i < accounts.length; i++){
        for (let j = 0; j < accounts.length; j++){
          token.allowance(accounts[i], accounts[j]).then(function(allowed){
            assert(allowed.equals(0));
          });
        }
      }
    }).then(done).catch(done);
  });
  // // // // ---------------------------------------------
  // // // // ------------- SUCCESSFUL CROWDSALE ----------
  // // // // ---------------------------------------------
  prefix = 'Successful Crowdsale -- ';
  it(prefix + 'getState returns Success after tokenCreationMax', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.crowdfundMaxEther().then(function(ethMax){
        return ethMax;
      }).then(function(maxWeiForSuccess){
        return token.create({ value: maxWeiForSuccess })
      }).then(function(){
        // success
        return token.finalizeCrowdfunding();
      }).then(function(){
        return token.getState();
      }).then(function(state){
        assert.equal(state, utils.crowdsaleState.FUNDED);
      });
    }).then(done).catch(done);
  });
  it(prefix + 'getState returns Success after fundingEndBlock', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.crowdfundMaxEther().then(function(ethMax){
        return ethMax;
      }).then(function(minWeiForSuccess){
        return token.create({ from: accounts[0], value: minWeiForSuccess.toNumber() });
      }).then(function(){
        utils.mineToBlockHeight(endBlock);
        // success
        return token.finalizeCrowdfunding();
      }).then(function(){
        return token.getState();
      }).then(function(state){
        assert.equal(state, utils.crowdsaleState.FUNDED);
      });
    }).then(done).catch(done);
  });
  it(prefix + 'allows transfer and balanceOf', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    let maxWeiForSuccess;
    let tokensPerEther;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.crowdfundMaxEther().then(function(ethMax){
        maxWeiForSuccess = ethMax;
        return token.create({ from: accounts[0], value: maxWeiForSuccess });
      }).then(function(){
        return token.tokensPerEther()
      }).then(function(tpe){
        tokensPerEther = tpe;
        // success
        return token.finalizeCrowdfunding();
      }).then(function(){
        return token.transfer(accounts[1], 1);
      }).then(function(){
        return token.balanceOf(accounts[1]);
      }).then(function(balance){
        assert(balance.equals(1));
      }).then(function(){
        return token.balanceOf(accounts[0]);
      }).then(function(balance){
        assert(balance.sub(tokensPerEther.mul(maxWeiForSuccess).sub(1)));
      });
    }).then(done).catch(done);
  });
  it(prefix + 'disallows create', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.crowdfundMaxEther().then(function(ethMax){
        return ethMax;
      }).then(function(minWeiForSuccess){
        return token.create({ from: accounts[0], value: minWeiForSuccess });
      }).then(function(){
        utils.mineToBlockHeight(endBlock);
        // success
        return token.finalizeCrowdfunding();
      }).then(function(){
        utils.assertThrows(token.create({from: accounts[0], value: 1 }), 'expected create to fail');
      });
    }).then(done).catch(done);
  });
  it(prefix + 'allows finalizeCrowdfunding', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.crowdfundMaxEther().then(function(ethMax){
        return ethMax;
      }).then(function(minWeiForSuccess){
        return token.create({ from: accounts[0], value: minWeiForSuccess });
      }).then(function(){
        utils.mineToBlockHeight(endBlock);
        // success
        return token.finalizeCrowdfunding();
      }).then(function(){
        utils.assertThrows(token.finalizeCrowdfunding(), 'expected finalizeCrowdfunding to fail');
      });
    }).then(done).catch(done);
  });
  it(prefix + 'allows totalSupply', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    let maxWeiForSuccess;
    let tokensPerEth;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.crowdfundMaxEther().then(function(ethMax){
        maxWeiForSuccess = ethMax;
        return ethMax;
      }).then(function(){
        return token.create({ from: accounts[0], value: maxWeiForSuccess });
      }).then(function(){
        return token.tokensPerEther()
      }).then(function(tpe){
        tokensPerEth = tpe;
        // success, this creates a 20% endowment
        return token.finalizeCrowdfunding();
      }).then(function(){
        // totalSupply is in LUN-wei == 11 * wei
        return token.totalSupply();
      }).then(function(actualSupply){
        const tokenMax = maxWeiForSuccess.mul(tokensPerEth)
        assert(actualSupply.mul(0.80).sub(tokenMax).lt(utils.diffEpsilon));
        assert(actualSupply.mul(0.80).sub(tokenMax).gt(-1 * utils.diffEpsilon));
      });
    }).then(done).catch(done);
  });
  it(prefix + 'approve, allowance and transferFrom enabled', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      startBlock = web3.eth.blockNumber + 2;
      return FuckYouCoin.new(wallet.address, startBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.crowdfundMaxEther().then(function(ethMax){
        let minWeiForSuccess = ethMax;
        return token.create({ from: accounts[0], value: minWeiForSuccess });
      }).then(function(){
        // success
        utils.mineToBlockHeight(endBlock);
        // let 1 spend 0's money
        return token.approve(accounts[1], 2, {from:accounts[0]});
      }).then(function(receipt){
        assert.equal(receipt.logs.length, 1);
        assert.equal(receipt.logs[0].event, 'Approval');
        return token.allowance(accounts[0], accounts[1]);
      }).then(function(allowance){
        assert(allowance.equals(2));
        return token.allowance(accounts[1], accounts[0]);
      }).then(function(allowance){
        assert(allowance.equals(0));
        // 1 will send 2 tokens from 0 to 2
        return token.transferFrom(accounts[0], accounts[2], 2, {from:accounts[1]});
      }).then(function(receipt){
        assert.equal(receipt.logs.length, 1);
        assert.equal(receipt.logs[0].event, 'Transfer');
        return token.transferFrom(accounts[0], accounts[2], 2, {from:accounts[1]});
      }).then(function(receipt){
        // this fails because we already depleted our allowance
        assert.equal(receipt.logs.length, 0);
        token.approve(accounts[1], 2, {from:accounts[0]});
      }).then(function(){
        return token.transferFrom(accounts[0], accounts[2], 3, {from:accounts[1]});
      }).then(function(receipt){
        assert.equal(receipt.logs.length, 0);
        token.balanceOf(accounts[2]).then(function(balance){
          assert(balance.equals(2));
        });
        token.balanceOf(accounts[0]).then(function(balance){
          assert(balance.sub(tokenMin.sub(2)).equals(0));
        });
      });
    }).then(done).catch(done);
  });
});
