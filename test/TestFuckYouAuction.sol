pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/FuckYouAuction.sol";

contract TestFuckYouAuction {

  function testInitialBalanceUsingDeployedContract() {
    //FuckYouAuction fu = FuckYouAuction(DeployedAddresses.FuckYouAuction());

    uint expected = 10000;

    //Assert.equal(fu.getBalance(tx.origin), expected, "Owner should have 10000 MetaCoin initially");
  }

  function testInitialStateWithNewFuckYouAuction() {
    address expectedBeneficiary = 0x1;
    FuckYouAuction fu = new FuckYouAuction(1000, expectedBeneficiary);

    address expectedHighestBidder = 0;
    uint expectedHighestBid = 0;
    address expectedDonationAddress = 0;
    bytes32 expectedMsg0 = 0;
    bytes32 expectedMsg1 = 0;
    bytes32 expectedMsg2 = 0;
    bytes32 expectedMsg3 = 0;

    Assert.equal(fu.beneficiary(), expectedBeneficiary, "Beneficiary should be 0x1");
    Assert.equal(fu.highestBidder(), expectedHighestBidder, "Initial highest bidder should be 0x0");
    Assert.equal(fu.highestBid(), expectedHighestBid, "Initial highest bid should be 0");
    Assert.equal(fu.pendingDonationAddress(), expectedDonationAddress, "Initial pending donation address should be 0x0");
    Assert.equal(fu.pendingMsg0(), expectedMsg0, "Initial pending msg0 should be 0");
    Assert.equal(fu.pendingMsg1(), expectedMsg1, "Initial pending msg1 should be 0");
    Assert.equal(fu.pendingMsg2(), expectedMsg2, "Initial pending msg2 should be 0");
    Assert.equal(fu.pendingMsg3(), expectedMsg3, "Initial pending msg3 should be 0");
  }

}
