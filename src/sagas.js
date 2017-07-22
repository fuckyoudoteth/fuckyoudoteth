import { delay, takeEvery, takeLatest, throttle } from 'redux-saga'
import { call, cps, put, take, race, select, fork, cancel, cancelled } from 'redux-saga/effects'

import { LOCATION_CHANGE } from 'react-router-redux'
import Notifications from 'react-notification-system-redux'
import {
  SET_ETH_CONNECTION,
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
  DONATE,
  donateSuccess,
  donateFailure,
 } from './actions'

 import {
   getEthRWStatus,
   getPendingBid,
   getPendingReset,
   getPendingWithdrawals,
 } from './selectors'

 import {
   hexStringsToString,
   stringToHexStrings,
   auctionTimeRemaining,
   auctionTimeRemainingSeconds,
 } from './utils'

var store

export default function* rootSaga(config, theStore) {
  store = theStore
  yield fork(watchAuction, config.contracts.FuckYouAuction)
  yield startEthConnection(config.network)
  yield fork(watchEthConnection)
}

// Eth sagas

function* startEthConnection(networkConfig) {
  const node = yield initEth(networkConfig)
  const connected = yield checkEthConnection()
  const network = yield checkEthNetwork()
  yield delay(170)
  yield put(setEthConnection(node, connected, network))
}

const infuraUrl = 'https://mainnet.infura.io/9A2BCvScLiNdmOTuDiGg'
const developmentUrl = 'http://localhost:18545'

function* initEth(network) {
  const setFallbackWeb3 = (W3, connected) => {
    if(network === 'development') {
      window.web3 = new Web3(new Web3.providers.HttpProvider(developmentUrl))
      return true
    } else if(!connected) {
      window.web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl))
      return false
    } else {
      return true
    }
  }
  if(typeof window.web3 !== 'undefined') {
    window.web3 = new Web3(window.web3.currentProvider)
    // quick connection check
    // required for injected web3 that thinks its connected
    try {
      const resp = yield cps([web3.eth, web3.eth.getBlock], 0)
    } catch(e) {}
    const connected = yield web3.currentProvider.isConnected()
    return setFallbackWeb3(Web3, connected)
  } else {
    let Web3 = require('web3')
    return setFallbackWeb3(Web3, false)
  }
}

function* checkEthNetwork() {
  try {
    const resp = yield cps([web3.eth, web3.eth.getBlock], 0)
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
  yield take(SET_ETH_CONNECTION)
  var auction = yield web3.eth.contract(config.abi).at(config.address)
  const isRW = yield select(getEthRWStatus)
  if(isRW) {
    yield watchAuctionRW(auction)
  } else {
    yield watchAuctionRO(auction)
  }
}

function* watchAuctionRO(auction) {
  yield setAuctionBiddingTime(auction)
  yield fork(watchAuctionTimeRemaining, auction)

  var lastBlock = 0
  while(true) {
    var currentBlock = yield cps([web3.eth, web3.eth.getBlock], 'latest')
    currentBlock = currentBlock.number
    if(lastBlock != currentBlock) {
      yield updateAuctionState(auction, currentBlock)
    }
    yield delay(7000)
    lastBlock = currentBlock
  }
}

function parseBid(bidArr) {
  return [
    bidArr[0],
    web3.fromWei(bidArr[1].toNumber(), 'ether'),
    bidArr[2],
    hexStringsToString(
      bidArr[3],
      bidArr[4],
      bidArr[5],
      bidArr[6],
    ),
  ]
}

function* updateAuctionState(auction, currentBlock) {
  try {
    var parsedBid
    const number = yield cps([auction, auction.auctionNumber])
    const auctionNumber = number.toNumber()
    const endTime = yield cps([auction, auction.auctionEndTime])
    const auctionEndTime = new Date(endTime.toNumber() * 1000)

    const highest = yield cps([auction, auction.highest])
    const winning = yield cps([auction, auction.winning])
    parsedBid = yield parseBid(winning)
    yield put(endAuction(auctionNumber - 1, auctionEndTime, currentBlock, parsedBid[0], parsedBid[1], parsedBid[2], parsedBid[3]))
    parsedBid = yield parseBid(highest)
    yield put(highestBidIncreased(auctionNumber, currentBlock, parsedBid[0], parsedBid[1], parsedBid[2], parsedBid[3]))
  } catch(e) {
    console.log(e)
  }
}

function* watchAuctionRW(auction) {
  // user actions
  yield takeEvery(SEND_BID, sendBid, auction)
  yield takeEvery(RESET_AUCTION, resetAuction, auction)
  yield takeEvery(WITHDRAW, withdraw, auction)
  yield takeEvery(DONATE, donate)
  // other side effects
  yield takeEvery(HIGHEST_BID_INCREASED, updatePendingBid, auction)
  yield takeEvery(END_AUCTION, updateEndAuction, auction)
  yield takeEvery([END_AUCTION, HIGHEST_BID_INCREASED, WITHDRAWAL], updateWithdrawals, auction)
  yield takeEvery(END_AUCTION, updateAuctionTimeRemaining, auction)
  // notifications
  yield takeEvery(END_AUCTION, alertEndAuction, auction)
  yield takeEvery(HIGHEST_BID_INCREASED, alertHighestBidIncreased, auction)
  yield takeEvery(WITHDRAWAL, alertWithdrawal, auction)
  // set up / watch auction
  yield setAuctionBiddingTime(auction)
  yield fork(watchAuctionTimeRemaining, auction)
  yield fork(watchAuctionEvents, auction)
}

function* sendBid(auction, action) {
  const [msg0, msg1, msg2, msg3] = yield stringToHexStrings(action.message)
  try {
    const amount = yield cps([auction, auction.bid],
      action.donationAddress,
      msg0, msg1, msg2, msg3,
      {from: action.bidder, value: web3.toWei(action.amount, 'ether'), gas:1000000})
  } catch(e) {
    yield put(sendBidFailure(e))
  }
}

function* updatePendingBid(auction, action) {
  const pendingBid = yield select(getPendingBid)
  if(pendingBid) {
    if(web3.eth.accounts.find(a => a === action.bidder)) {
      yield put(sendBidSuccess())
    } else if(pendingBid.amount < action.amount) {
      yield put(sendBidFailure(new Error('outbid before network confirmation')))
    }
  }
}

function* resetAuction(auction) {
  try {
    yield cps([auction, auction.resetAuction],
    {from: web3.eth.accounts[0], gas: 1000000})
  } catch(e) {
    yield put(resetAuctionFailure(e))
  }
}

function* updateEndAuction(auction) {
  const pendingReset = yield select(getPendingReset)
  if(pendingReset) {
    yield put(resetAuctionSuccess())
  }
}

function* withdraw(auction, action) {
  const success = yield cps([auction, auction.withdraw],
    action.address, {from: action.address})
  if(!success) {
    yield put(withdrawFailure(action.address))
  }
}

function* updateWithdrawals(auction) {
  const accounts = yield web3.eth.accounts
  var withdrawals = {}
  for(const account of accounts) {
      var balance = yield cps([ auction, auction.pendingReturns], account)
      balance = yield web3.fromWei(balance.toNumber(), 'ether')
      if(balance != 0) {
        withdrawals[account] = balance
      }
  }
  var pendingWithdrawals = yield select(getPendingWithdrawals)
  for(const address of Object.keys(pendingWithdrawals)) {
    if(!withdrawals[address]) {
      delete pendingWithdrawals[address]
    }
  }
  yield put(setWithdrawals(withdrawals, pendingWithdrawals))
}

function* donate(action) {
  try {
    const success = yield cps([web3.eth, web3.eth.sendTransaction],
      {to: action.address})
    yield put(donateSuccess(action.address))
  } catch(e) {
    yield put(donateFailure(action.address))
  }
}

// notifications

function* recentBlock(block) {
  const currentBlock = yield cps([web3.eth, web3.eth.getBlock], 'latest')
  return currentBlock.number - block <= 6
}

function* alertEndAuction(auction, action) {
  const recent = yield recentBlock(action.currentBlock)
  if(recent) {
    const auctionNumber = action.auctionNumber
    const endedNotification = {
      message: `Auction #${auctionNumber} Ended`,
      position: 'tr',
    }
    yield put(Notifications.info(endedNotification))
  }
}

function* alertHighestBidIncreased(auction, action) {
  const recent = yield recentBlock(action.currentBlock)
  if(recent) {
    var message, notify
    if(web3.eth.accounts.find(a => a === action.bidder)) {
      message = `Bid Successful: ${action.amount} ETH`
      notify = Notifications.success
    } else {
      message = `New Bid: ${action.amount} ETH`
      notify = Notifications.info
    }
    yield put(notify({
      message,
      position: 'tr',
    }))
  }
}

function* alertWithdrawal(auction, action) {
  const recent = yield recentBlock(action.currentBlock)
  if(recent) {
    const withdrawalNotification = {
      message: `Successful Withdrawal: ${action.amount} ETH`,
      position: 'tr',
    }
    yield put(Notifications.info(withdrawalNotification))
  }
}

function* setAuctionBiddingTime(auction) {
  var biddingTime = yield cps([auction, auction.biddingTime])
  biddingTime = yield biddingTime.toNumber()
  yield put(setBiddingTime(biddingTime))
}

// process events

function processAuctionEndedEvent(event) {
  const auctionNumber = event.args.auctionNumber.toNumber()
  const auctionEndTime = new Date(event.args.auctionEndTime.toNumber() * 1000)
  const currentBlock = event.blockNumber
  const winner = event.args.bidder
  const amount = web3.fromWei(event.args.amount.toNumber(), 'ether')
  const donationAddress = event.args.donationAddress
  const message = hexStringsToString(
    event.args.msg0,
    event.args.msg1,
    event.args.msg2,
    event.args.msg3,
  )
  store.dispatch(endAuction(auctionNumber, auctionEndTime, currentBlock, winner, amount, donationAddress, message))
}

function processHighestBidIncreasedEvent(event) {
  const auctionNumber = event.args.auctionNumber.toNumber()
  const currentBlock = event.blockNumber
  const winner = event.args.bidder
  const amount = web3.fromWei(event.args.amount.toNumber(), 'ether')
  const donationAddress = event.args.donationAddress
  const message = hexStringsToString(
    event.args.msg0,
    event.args.msg1,
    event.args.msg2,
    event.args.msg3,
  )
  store.dispatch(highestBidIncreased(auctionNumber, currentBlock, winner, amount, donationAddress, message))
}

function processWithdrawal(event) {
  const address = event.args.withdrawer
  const amount = web3.fromWei(event.args.amount.toNumber(), 'ether')
  store.dispatch(withdrawal(address, amount))
}

function* watchAuctionEvents(auction) {
  var toBlock = yield cps([web3.eth, web3.eth.getBlock], 'latest')
  toBlock = yield toBlock.number
  toBlock += 100000
  var fromBlock = yield cps([auction, auction.auctionStartBlock])
  fromBlock = yield fromBlock.toNumber()
  auction.AuctionEnded({}, {fromBlock, toBlock}, function(error, result) {
    if(!error) {
      processAuctionEndedEvent(result)
    }
  })
  yield take(END_AUCTION)
  auction.HighestBidIncreased({}, {fromBlock, toBlock}, function(error, result) {
    if(!error) {
      processHighestBidIncreasedEvent(result)
    }
  })
  auction.Withdrawal({withdrawer: web3.eth.accounts}, {fromBlock, toBlock}, function(error, result) {
    if(!error) {
      processWithdrawal(result)
    }
  })
}

function* updateAuctionTimeRemaining(auction) {
  const auctionEnded = yield cps([auction, auction.auctionOver])
  const auctionEndTime = yield cps([auction, auction.auctionEndTime])
  const auctionEndDate = yield new Date(auctionEndTime.toNumber() * 1000)
  const timeRemaining = yield auctionTimeRemaining(auctionEndDate)
  const timeRemainingSeconds = yield auctionTimeRemainingSeconds(auctionEndDate)
  yield put(setAuctionTimeRemaining(auctionEnded, auctionEndDate, timeRemaining, timeRemainingSeconds))
}

function* watchAuctionTimeRemaining(auction) {
  while(true) {
    yield updateAuctionTimeRemaining(auction)
    yield delay(1500)
  }
}
