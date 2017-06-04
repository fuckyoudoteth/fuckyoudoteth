var FuckYouAuction = artifacts.require("./FuckYouAuction.sol");

module.exports = function(deployer, network, accounts) {
  console.log(accounts[0]);
  deployer.deploy(FuckYouAuction, 86400, accounts[0]);
};
