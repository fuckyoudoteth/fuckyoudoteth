let utils = require("./utils/utils.js");
utils.setWeb3(web3)

// contracts
let FuckYouAuction = artifacts.require('FuckYouAuction');

contract('Auction', function(accounts){
  it('properly sets a bid', function(done) {
    let auction,
      bidAmount = web3.toWei(1, 'ether'),
      bidDonationAddress = accounts[1],
      msg = [
        '0x0000000000000000000000000000000000000000000000000000000000000001',
        '0x0000000000000000000000000000000000000000000000000000000000000002',
        '0x0000000000000000000000000000000000000000000000000000000000000003',
        '0x0000000000000000000000000000000000000000000000000000000000000004',
      ]

    FuckYouAuction.new(86400, accounts[0]).then(function(a) {
      auction = a
      return auction.bid(
        bidDonationAddress,
        msg[0], msg[1], msg[2], msg[3],
        {value: bidAmount})
    }).then(function() {
      return auction.highest()
    }).then(function(bid) {
      let bidder = bid[0],
        amount = bid[1],
        donationAddress = bid[2],
        msg0 = bid[3],
        msg1 = bid[4],
        msg2 = bid[5],
        msg3 = bid[6]

      assert(amount.equals(bidAmount))
      assert(donationAddress === bidDonationAddress)
      assert(msg[0] == msg0)
      assert(msg[1] == msg1)
      assert(msg[2] == msg2)
      assert(msg[3] == msg3)
    }).then(done).catch(done)
  })
  it('properly resets auction', function(done) {
    let auction
    FuckYouAuction.new(86400, accounts[0]).then(function(a) {
      auction = a
      return utils.assertThrows(auction.resetAuction())
    }).then(function() {
      utils.increaseTime(86401)
      return auction.resetAuction()
    }).then(function() {
    }).then(done).catch(done)
  })
  it('properly sets winning bid', function(done) {
    let auction,
      bidAmount = web3.toWei(1, 'ether'),
      bidDonationAddress = accounts[1],
      msg = [
        '0x0000000000000000000000000000000000000000000000000000000000000001',
        '0x0000000000000000000000000000000000000000000000000000000000000002',
        '0x0000000000000000000000000000000000000000000000000000000000000003',
        '0x0000000000000000000000000000000000000000000000000000000000000004',
      ]
    FuckYouAuction.new(86400, accounts[0]).then(function(a) {
      auction = a
      return auction.bid(
        bidDonationAddress,
        msg[0], msg[1], msg[2], msg[3],
        {value: bidAmount})
    }).then(function() {
      utils.increaseTime(86401)
      return auction.resetAuction()
    }).then(function() {
      return auction.winning()
    }).then(function(bid) {
      let bidder = bid[0],
        amount = bid[1],
        donationAddress = bid[2],
        msg0 = bid[3],
        msg1 = bid[4],
        msg2 = bid[5],
        msg3 = bid[6]

      assert(amount.equals(bidAmount))
      assert(donationAddress === bidDonationAddress)
      assert(msg[0] == msg0)
      assert(msg[1] == msg1)
      assert(msg[2] == msg2)
      assert(msg[3] == msg3)
    }).then(done).catch(done)
  })

})
