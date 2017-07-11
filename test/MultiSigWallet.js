let utils = require("./utils/utils.js");
utils.setWeb3(web3);

let MultiSigWallet = artifacts.require("MultiSigWallet");


contract('MultiSigWallet', function(accounts){
  it('allows ownership changes', function(done){
    let wallet;
    originalOwners = accounts.slice(0,4);
    MultiSigWallet.new(originalOwners, 1).then(function(instance){
      wallet = instance;
      return wallet.getOwners();
    }).then(function(owners){
      assert.deepEqual(owners, originalOwners);
      functionData = utils.getFunctionEncoding('addOwner(address)',[web3.eth.accounts[4]]);
      return wallet.submitTransaction(wallet.address, 0, functionData);
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 4);
      assert.equal(receipt.logs[0].event,'Submission');
      assert.equal(receipt.logs[1].event,'Confirmation');
      assert.equal(receipt.logs[2].event,'OwnerAddition');
      assert.equal(receipt.logs[3].event,'Execution');
      return wallet.getOwners();
    }).then(function(owners){
      assert.deepEqual(owners, accounts.slice(0,5));
      functionData = utils.getFunctionEncoding('removeOwner(address)',[web3.eth.accounts[4]]);
      return wallet.submitTransaction(wallet.address, 0, functionData);
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 4);
      assert.equal(receipt.logs[0].event,'Submission');
      assert.equal(receipt.logs[1].event,'Confirmation');
      assert.equal(receipt.logs[2].event,'OwnerRemoval');
      assert.equal(receipt.logs[3].event,'Execution');
      return wallet.getOwners();
    }).then(function(owners){
      assert.deepEqual(owners, accounts.slice(0,4));
    //   functionData = utils.getFunctionEncoding('replaceOwner(address,address)',[
    //     web3.eth.accounts[3],
    //     web3.eth.accounts[4]
    //   ]);
    //   return wallet.submitTransaction(wallet.address, 0, functionData);
    // }).then(function(receipt){
    //   assert.equal(receipt.logs.length, 5);
    //   assert.equal(receipt.logs[0].event,'Submission');
    //   assert.equal(receipt.logs[1].event,'Confirmation');
    //   assert.equal(receipt.logs[2].event,'OwnerRemoval');
    //   assert.equal(receipt.logs[3].event,'OwnerAddition');
    //   assert.equal(receipt.logs[4].event,'Execution');
    //   return wallet.getOwners();
    // }).then(function(owners){
    //   expected = accounts.slice(0,4);
    //   expected[3] = accounts[4];
    //   assert.deepEqual(owners, expected);
      functionData = utils.getFunctionEncoding('replaceOwnerIndexed(address,address,uint)',[
        web3.eth.accounts[3],
        web3.eth.accounts[4],
        3
      ]);
      return wallet.submitTransaction(wallet.address, 0, functionData);
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 5);
      assert.equal(receipt.logs[0].event,'Submission');
      assert.equal(receipt.logs[1].event,'Confirmation');
      assert.equal(receipt.logs[2].event,'OwnerRemoval');
      assert.equal(receipt.logs[3].event,'OwnerAddition');
      assert.equal(receipt.logs[4].event,'Execution');
      return wallet.getOwners();
    }).then(function(owners){
      expected = accounts.slice(0,4);
      expected[3] = accounts[4];
      assert.deepEqual(owners, expected);

    }).then(done).catch(done);
  });
  it('requires multiple confirmations', function(done){
    let wallet;
    let txid;
    originalOwners = accounts.slice(0,4);
    MultiSigWallet.new(originalOwners, 2).then(function(instance){
      wallet = instance;
      functionData = utils.getFunctionEncoding('addOwner(address)', [web3.eth.accounts[4]]);
      return wallet.submitTransaction(wallet.address, 0, functionData, { from: accounts[0]});
    }).then(function(receipt){
      txid = receipt.logs[0].args.transactionId.toNumber();
      assert.equal(receipt.logs.length, 2);
      assert.equal(receipt.logs[0].event,'Submission');
      assert.equal(receipt.logs[1].event,'Confirmation');
      return wallet.getConfirmations(txid);
    }).then(function(confs){
      assert.equal(confs.length, 1);
      return wallet.getConfirmationCount(txid);
    }).then(function(numConfs){
      assert.equal(numConfs, 1);
      return wallet.revokeConfirmation(txid);
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event,'Revocation');
      return wallet.getConfirmations(txid);
    }).then(function(confs){
      assert.equal(confs.length, 0);
      return wallet.getTransactionCount(true, false);
    }).then(function(transactionCount){
      assert.equal(transactionCount, 1);
      return wallet.getTransactionIds(0,1,true, false);
    }).then(function(transactionIds){
      assert.equal(transactionIds.length, 1);
      assert.equal(transactionIds[0], txid);
      return wallet.confirmTransaction(txid, {from: accounts[1]});
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event,'Confirmation');
      return wallet.getConfirmations(txid);
    }).then(function(confs){
      assert.equal(confs.length, 1);
      return wallet.isConfirmed(txid);
    }).then(function(confirmed){
      assert.equal(confirmed, false);
      return wallet.getConfirmationCount(txid);
    }).then(function(numConfs){
      assert.equal(numConfs, 1);
      return wallet.confirmTransaction(txid, {from: accounts[2]});
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event,'Confirmation');
      assert.equal(receipt.logs[1].event,'OwnerAddition');
      assert.equal(receipt.logs[2].event,'Execution');
      return wallet.getConfirmationCount(txid);
    }).then(function(numConfs){
      assert.equal(numConfs, 2);
      return wallet.getOwners();
    }).then(function(owners){
      assert.deepEqual(owners, accounts.slice(0,5));
      return wallet.getTransactionCount(false, true);
    }).then(function(transactionCount){
      assert.equal(transactionCount, 1);
      return wallet.isConfirmed(txid);
    }).then(function(confirmed){
      assert.equal(confirmed, true);
      utils.assertThrows(wallet.revokeConfirmation(txid), 'expected revokeConfirmation to fail')
    }).then(done).catch(done);
  });
  it('allows change of requirements', function(done){
    let wallet;
    let txid;
    originalOwners = accounts.slice(0,4);
    MultiSigWallet.new(originalOwners, 2).then(function(instance){
      wallet = instance;
      // NOTE: datatype must be uint256, not uint
      functionData = utils.getFunctionEncoding('changeRequirement(uint256)', [3]);
      return wallet.submitTransaction(wallet.address, 0, functionData, { from: accounts[0] });
    }).then(function(receipt){
      txid = receipt.logs[0].args.transactionId.toNumber();
      assert.equal(receipt.logs.length, 2);
      assert.equal(receipt.logs[0].event,'Submission');
      assert.equal(receipt.logs[1].event,'Confirmation');
      return wallet.confirmTransaction(txid, { from: accounts[1] });
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event,'Confirmation');
      assert.equal(receipt.logs[1].event,'RequirementChange');
      assert.equal(receipt.logs[2].event,'Execution');
      functionData = utils.getFunctionEncoding('addOwner(address)', [web3.eth.accounts[4]]);
      return wallet.submitTransaction(wallet.address, 0, functionData, { from: accounts[0]});
    }).then(function(receipt){
      txid = receipt.logs[0].args.transactionId.toNumber();
      assert.equal(receipt.logs.length, 2);
      assert.equal(receipt.logs[0].event,'Submission');
      assert.equal(receipt.logs[1].event,'Confirmation');
      return wallet.confirmTransaction(txid, { from: accounts[1] });
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event,'Confirmation');
      return wallet.confirmTransaction(txid, { from: accounts[2] });
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event,'Confirmation');
      assert.equal(receipt.logs[1].event,'OwnerAddition');
      assert.equal(receipt.logs[2].event,'Execution');
      return wallet.getConfirmationCount(txid);
    }).then(function(numConfs){
      assert.equal(numConfs, 3);
      return wallet.getOwners();
    }).then(function(owners){
      assert.deepEqual(owners, accounts.slice(0,5));
    }).then(done).catch(done);
  });
});
