import { delay, takeEvery, takeLatest, throttle } from 'redux-saga'
import { call, cps, put, take, race, select, fork, cancel, cancelled } from 'redux-saga/effects'

import {
  SET_CURRENT_BLOCK,
  setCurrentBlock,

  BUY,
  buySuccess,
  buyFailure,

  transfer,
} from './actions'

import {
  SET_ETH_CONNECTION,
} from '../actions'

import {
  getCurrentBlock,
} from './selectors'

var store

export default function* rootSaga(config, theStore) {
  store = theStore
  yield take(SET_ETH_CONNECTION)
  var coin = yield web3.eth.contract(config.abi).at(config.address)
  const isRW = yield select(getEthRWStatus)
  yield fork(watchCurrentBlock)
  if(isRW) {
    yield icoRW(coin)
  } else {
    yield icoRO(coin)
  }
}

function* icoRW(coin) {
  yield takeEvery(BUY, buy, coin)
  yield fork(watchFUCEvents, coin)
}

function* icoRO(coin) {
}

function* buy(coin, action) {
  const success = yield cps([coin, coin.create],
    {from: action.from, value: web3.toWei(action.value, 'ether')})
  if(!success) {
    yield put(buyFailure(action.address))
  }
}

function processTransfer(evt) {
  const to = evt.args.to
  const value = yield evt.args.value
  store.dispatch(transfer(to, value))
}

function* watchFUCEvents(coin) {
  yield take(SET_CURRENT_BLOCK)
  const fromBlock = yield select(getCurrentBlock)
  const toBlock = fromBlock + 100000
  coin.Transfer({to: web3.eth.accounts}, {fromBlock, toBlock}, function(error, result) {
    if(!error) {
      processTransfer(result)
    }
  })
}

function* watchCurrentBlock(auction) {
  while(true) {
    var currentBlock = yield cps([web3.eth, web3.eth.getBlock], 'latest')
    currentBlock = currentBlock.number
    const lastBlock = yield select(getCurrentBlock)
    if(lastBlock != currentBlock) {
      yield put(setCurrentBlock(currentBlock))
    }
    yield delay(7000)
  }
}
