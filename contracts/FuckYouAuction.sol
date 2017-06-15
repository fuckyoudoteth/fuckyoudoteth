pragma solidity ^0.4.11;

import './owned.sol';

contract FuckYouAuction is owned {
    struct Bid {
      address bidder;
      uint amount;
      address donationAddress;
      bytes32 msg0;
      bytes32 msg1;
      bytes32 msg2;
      bytes32 msg3;
    }

    // Parameters of the auction. Times are either
    // absolute unix timestamps (seconds since 1970-01-01)
    // or time periods in seconds.
    address public beneficiary;
    uint public beneficiaryTotal;

    uint public auctionNumber;
    uint public auctionStartTime;
    uint public auctionStartBlock;
    uint public biddingTime;
    //uint public biddingTime = 86400; // 1 day

    // Current highest bidder's data
    Bid public highest;

    // Last winner's data
    Bid public winning;

    // Mapping of auction numbers to starting block numbers
    mapping(uint => uint) public history;

    // Allowed withdrawals of previous bids
    mapping(address => uint) public pendingReturns;

    event HighestBidIncreased(
      uint indexed auctionNumber,
      address indexed bidder,
      address indexed donationAddress,
      uint amount,
      bytes32 msg0,
      bytes32 msg1,
      bytes32 msg2,
      bytes32 msg3
    );
    event AuctionEnded(
      uint indexed auctionNumber,
      uint auctionEndTime,
      address indexed bidder,
      address indexed donationAddress,
      uint amount,
      bytes32 msg0,
      bytes32 msg1,
      bytes32 msg2,
      bytes32 msg3
    );
    event Withdrawal(
      address indexed withdrawer,
      uint amount
    );

    /// Create a rolling auction with `_biddingTime`
    /// seconds bidding time on behalf of the
    /// beneficiary address `_beneficiary`.
    /// This contract is designed for fuckyou.eth
    function FuckYouAuction(
        uint _biddingTime,
        address _beneficiary
    ) {
        beneficiary = _beneficiary;
        biddingTime = _biddingTime;
        incrementAuctionState();
    }

    function() payable {
      beneficiaryTotal += msg.value;
    }

    function auctionEndTime() constant returns (uint) {
      return auctionStartTime + biddingTime;
    }

    function auctionOver() constant returns (bool) {
      return now > auctionEndTime();
    }

    // bump all auction metadata for a next auction
    function incrementAuctionState() internal {
        // Send 'auction ended' event
        AuctionEnded(
          auctionNumber,
          now,
          winning.bidder,
          winning.donationAddress,
          winning.amount,
          winning.msg0,
          winning.msg1,
          winning.msg2,
          winning.msg3
        );

        auctionNumber += 1;
        auctionStartTime = now;
        auctionStartBlock = block.number;
        history[auctionNumber] = auctionStartBlock;
    }

    function resetAuction() {
        // Only restart the auction if the bidding period is over
        require(auctionOver());

        // Finalize the winner's data
        // highest bidder is now the winner
        winning = highest;

        // Reset current bidder data
        highest = Bid(0,0,0,0,0,0,0);

        // Increment the beneficiary's stash
        beneficiaryTotal += winning.amount;

        // Increment auction variables
        incrementAuctionState();
    }

    /// Bid on the auction with the value sent
    /// together with this transaction.
    /// The value will only be refunded if the
    /// auction is not won.
    /// You must enter a `donationAddress`, as well
    /// as 128 bytes of data.
    function bid(
      address donationAddress,
      bytes32 _msg0,
      bytes32 _msg1,
      bytes32 _msg2,
      bytes32 _msg3
    ) payable {
        // If the auction should be over,
        // close the current one and start a new one.
        // Sorry for your extra gas.
        if(auctionOver()) {
          resetAuction();
        }

        // If the bid is not higher, send the
        // money back.
        require(msg.value > highest.amount);

        if (highest.bidder != 0) {
            // Sending back the money by simply using
            // highestBidder.send(highestBid) is a security risk
            // because it can be prevented by the caller by e.g.
            // raising the call stack to 1023. It is always safer
            // to let the recipients withdraw their money themselves.
            pendingReturns[highest.bidder] += highest.amount;
        }

        // set current highest bidder's data
        highest = Bid(
          msg.sender,
          msg.value,
          donationAddress,
          _msg0,
          _msg1,
          _msg2,
          _msg3
        );

        HighestBidIncreased(
          auctionNumber,
          msg.sender,
          donationAddress,
          msg.value,
          _msg0,
          _msg1,
          _msg2,
          _msg3
        );
    }

    /// Withdraw a bid that was overbid.
    function normalWithdraw() internal returns (bool) {
        var amount = pendingReturns[msg.sender];
        if (amount > 0) {
            // It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `send` returns.
            pendingReturns[msg.sender] = 0;

            if (!msg.sender.send(amount)) {
                // No need to call throw here, just reset the amount owing
                pendingReturns[msg.sender] = amount;
                return false;
            }
            Withdrawal(msg.sender, amount);
        }
        return true;
    }

    /// Withdraw benecifiary stash
    function beneficiaryWithdraw() internal returns (bool) {
        require(msg.sender == beneficiary);
        var amount = beneficiaryTotal;
        if (amount > 0) {
            beneficiaryTotal = 0;
            if(!msg.sender.send(amount)) {
                beneficiaryTotal = amount;
                return false;
            }
            Withdrawal(msg.sender, amount);
        }
        return true;
    }

    function withdraw() returns (bool) {
      if(msg.sender == beneficiary) {
        return beneficiaryWithdraw();
      } else {
        return normalWithdraw();
      }
    }

    function setBeneficiary(address _beneficiary) onlyOwner {
        beneficiary = _beneficiary;
    }

    function selfDestruct(address recipient) onlyOwner {
      selfdestruct(recipient);
    }
}
