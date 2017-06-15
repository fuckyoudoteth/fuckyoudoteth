import { delay, takeEvery, takeLatest, throttle } from 'redux-saga'
import { call, put, take, race, select, fork, cancel, cancelled } from 'redux-saga/effects'
import promisify from 'es6-promisify'

import { LOCATION_CHANGE } from 'react-router-redux'
import Notifications from 'react-notification-system-redux'
import {
  setEthConnection,
  setBiddingTime,
  setAuctionTimeRemaining,
  setWithdrawals,

  END_AUCTION,
  endAuction,
  HIGHEST_BID_INCREASED,
  highestBidIncreased,
  WITHDRAWAL,
  withdrawal,

  SEND_BID,
  sendBidSuccess,
  sendBidFailure,
  RESET_AUCTION,
  resetAuctionSuccess,
  resetAuctionFailure,
  WITHDRAW,
  withdrawSuccess,
  withdrawFailure,
 } from './actions'
 import {
   hexStringsToString,
   stringToHexStrings,
   auctionTimeRemaining,
   auctionTimeRemainingSeconds,
 } from './utils'

var store

export default function* rootSaga(config, theStore) {
  store = theStore
  yield startEthConnection()
  yield fork(watchEthConnection)
  yield fork(watchAuction, config.contracts.FuckYouAuction)
}

// Eth sagas

function* startEthConnection() {
  const node = yield initEth()
  const connected = yield checkEthConnection()
  const network = yield checkEthNetwork()
  yield delay(170)
  yield put(setEthConnection(node, connected, network))
}

function initEth() {
  if(typeof window.web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider)
    return true
  } else {
    let Web3 = require('web3')
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    //window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8080/rpc/"))
    // web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io"))
    //window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io"))
    return false
  }
}

function* checkEthNetwork() {
  try {
    const resp = yield promisify(web3.eth.getBlock, web3.eth)(0)
    switch(resp.hash) {
      case '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d':
        return 'ropsten'
      case '0x0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303':
        return 'morden'
      case '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3':
        return 'main'
      default:
        return 'private'
    }
  } catch(e) {
    console.log(e)
    return ''
  }
}

function* checkEthConnection() {
  let attempts = 3
  while(attempts > 0) {
    attempts--
    if(window.web3.isConnected()) {
      return true
    }
    yield delay(800)
  }
  return false
}

function* watchEthConnection() {
  while(true) {
    const connected = yield true//checkEthConnection()
    if(!connected) {
      yield fork(startEthConnection)
      break
    }
    yield delay(3000)
  }
}

// Auction sagas

function* watchAuction(config) {
  var auction = yield web3.eth.contract(config.abi).at(config.address)
  // user actions
  yield takeEvery(SEND_BID, sendBid, auction)
  yield takeEvery(RESET_AUCTION, resetAuction, auction)
  yield takeEvery(WITHDRAW, withdraw, auction)
  // other side effects
  yield takeEvery([END_AUCTION, HIGHEST_BID_INCREASED, WITHDRAWAL], updateWithdrawals, auction)
  yield takeEvery(END_AUCTION, updateAuctionEnded, auction)
  // notifications
  yield takeEvery(END_AUCTION, alertEndAuction, auction)
  yield takeEvery(HIGHEST_BID_INCREASED, alertHighestBidIncreased, auction)
  yield takeEvery(WITHDRAWAL, alertWithdrawal, auction)
  // set up / watch auction
  yield setAuctionBiddingTime(auction)
  yield fork(watchAuctionEnded, auction)
  yield fork(watchAuctionEvents, auction)
}

function* sendBid(auction, action) {
  const [msg0, msg1, msg2, msg3] = yield stringToHexStrings(action.message)
  try {
    const amount = yield promisify(auction.bid, auction)(
      action.donationAddress,
      msg0, msg1, msg2, msg3,
      {from: action.bidder, value: web3.toWei(action.amount, 'ether')})
    yield put(sendBidSuccess())
  } catch(e) {
    yield put(sendBidFailure(e))
  }
}

function* resetAuction(auction) {
  try {
    yield promisify(auction.resetAuction, auction)()
    yield put(resetAuctionSuccess())
  } catch(e) {
    yield put(resetAuctionFailure())
  }
}

function* withdraw(auction, action) {
  const success = yield promisify(auction.withdraw, auction)(
    action.address, {from: action.address})
  if(!success) {
    yield put(withdrawFailure(action.address))
  }
}

function* updateWithdrawals(auction) {
  const accounts = yield web3.eth.accounts
  var withdrawals = {}
  for(const account of accounts) {
      var balance = yield promisify(auction.pendingReturns, auction)(account)
      balance = yield web3.fromWei(balance.toNumber(), 'ether')
      if(balance != 0) {
        withdrawals[account] = balance
      }
  }
  var pendingWithdrawals = yield select(state => state.site.pendingWithdrawals)
  for(const address of Object.keys(pendingWithdrawals)) {
    if(!withdrawals[address]) {
      delete pendingWithdrawals[address]
    }
  }
  yield put(setWithdrawals(withdrawals, pendingWithdrawals))
}

// notifications

function* alertEndAuction(auction, action) {
  const auctionNumber = yield action.auctionNumber
  var auctionEndBlock = yield promisify(auction.history, auction)(auctionNumber)
  var currentBlock = yield promisify(web3.eth.getBlock, web3.eth)('latest')
  if(currentBlock.number - auctionEndBlock.toNumber() <= 1) {
    const endedNotification = {
      message: `Auction #${auctionNumber} Ended`,
      position: 'tr',
    }
    yield put(Notifications.info(endedNotification))
  }
}

function* alertHighestBidIncreased(auction, action) {
  const auctionNumber = yield action.auctionNumber
  var auctionEndBlock = yield promisify(auction.history, auction)(auctionNumber)
  var currentBlock = yield promisify(web3.eth.getBlock, web3.eth)('latest')
  if(currentBlock.number - auctionEndBlock.toNumber() <= 1) {
  //if(!web3.eth.accounts.find(action.bidder)) {
    const bidNotification = {
      message: `New Bid: ${action.amount} ETH`,
      position: 'tr',
    }
    yield put(Notifications.info(bidNotification))
  //}
  }
}

function* alertWithdrawal(auction, action) {
  const withdrawalNotification = {
    message: `Successful Withdrawal: ${action.amount} ETH`,
    position: 'tr',
  }
  yield put(Notifications.info(withdrawalNotification))
}

function* setAuctionBiddingTime(auction) {
  var biddingTime = yield promisify(auction.biddingTime, auction)()
  biddingTime = yield biddingTime.toNumber()
  yield put(setBiddingTime(biddingTime))
}

// process events

function processAuctionEndedEvent(event) {
  const auctionNumber = event.args.auctionNumber.toNumber()
  const auctionEndTime = new Date(event.args.auctionEndTime.toNumber() * 1000)
  const winner = event.args.bidder
  const amount = web3.fromWei(event.args.amount.toNumber(), 'ether')
  const donationAddress = event.args.donationAddress
  const message = hexStringsToString(
    event.args.msg0,
    event.args.msg1,
    event.args.msg2,
    event.args.msg3,
  )
  store.dispatch(endAuction(auctionNumber, auctionEndTime, winner, amount, donationAddress, message))
}

function processHighestBidIncreasedEvent(event) {
  const auctionNumber = event.args.auctionNumber.toNumber()
  const winner = event.args.bidder
  const amount = web3.fromWei(event.args.amount.toNumber(), 'ether')
  const donationAddress = event.args.donationAddress
  const message = hexStringsToString(
    event.args.msg0,
    event.args.msg1,
    event.args.msg2,
    event.args.msg3,
  )
  store.dispatch(highestBidIncreased(auctionNumber, winner, amount, donationAddress, message))
}

function processWithdrawal(event) {
  const address = event.args.withdrawer
  const amount = web3.fromWei(event.args.amount.toNumber(), 'ether')
  store.dispatch(withdrawal(address, amount))
}

function* watchAuctionEvents(auction) {
  var toBlock = yield promisify(web3.eth.getBlock, web3.eth)('latest')
  toBlock = yield toBlock.number
  toBlock += 100000
  var fromBlock = yield promisify(auction.auctionStartBlock, auction)()
  fromBlock = yield fromBlock.toNumber()
  auction.AuctionEnded({}, {fromBlock, toBlock}, function(error, result) {
    if(!error) {
      processAuctionEndedEvent(result)
    }
  })
  auction.HighestBidIncreased({}, {fromBlock, toBlock}, function(error, result) {
    if(!error) {
      processHighestBidIncreasedEvent(result)
    }
  })
  auction.Withdrawal({}, {fromBlock, toBlock, topics: web3.eth.accounts}, function(error, result) {
    if(!error) {
      processWithdrawal(result)
    }
  })
}

function* updateAuctionEnded(auction) {
  const auctionEnded = yield promisify(auction.auctionOver, auction)()
  const auctionEndTime = yield promisify(auction.auctionEndTime, auction)()
  const auctionEndDate = yield new Date(auctionEndTime.toNumber() * 1000)
  const timeRemaining = yield auctionTimeRemaining(auctionEndDate)
  const timeRemainingSeconds = yield auctionTimeRemainingSeconds(auctionEndDate)
  yield put(setAuctionTimeRemaining(auctionEnded, auctionEndDate, timeRemaining, timeRemainingSeconds))
}

function* watchAuctionEnded(auction) {
  while(true) {
    yield updateAuctionEnded(auction)
    yield delay(1500)
  }
}
