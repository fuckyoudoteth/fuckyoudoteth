import { delay, takeEvery, takeLatest, throttle } from 'redux-saga'
import { call, cps, put, take, race, select, fork, cancel, cancelled } from 'redux-saga/effects'

import {
  ICO_PREFUNDING,
  ICO_FUNDING,
  ICO_FUNDED,

  SET_CURRENT_BLOCK,
  setCurrentBlock,
  setIcoState,

  BUY,
  buySuccess,
  buyFailure,

  transfer,

  crowdfundMaxEther,
} from './actions'

import {
  getEthRWStatus,
} from '../selectors'

import {
  SET_ETH_CONNECTION,
} from '../actions'

import {
  getCurrentBlock,
} from './selectors'

var store

export default function* rootSaga(config, theStore) {
  store = theStore
  const coinConfig = config.contracts.FuckYouCoin
  yield take(SET_ETH_CONNECTION)
  var coin = yield web3.eth.contract(coinConfig.abi).at(coinConfig.address)
  console.log('coin',coin)
  const isRW = yield select(getEthRWStatus)
  yield fork(watchCurrentBlock)
  yield fork(watchIcoState, coin)
  if(isRW) {
    yield icoRW(coin)
  }
}

function* icoRW(coin) {
  yield takeEvery(BUY, buy, coin)
  yield fork(watchFUCEvents, coin)
}

function* buy(coin, action) {
  try {
    const success = yield cps([coin, coin.create],
      {from: action.from, value: web3.toWei(action.value, 'ether')})
    if(!success) {
      yield put(buyFailure(action.from, action.value))
    }
  } catch(error) {
    yield put(buyFailure(action.from, action.value, error))
  }
}

function processTransfer(evt) {
  const to = evt.args.to
  const value = evt.args.value
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

function* watchCurrentBlock() {
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

function parseIcoState(numState) {
  if(numState == 0) {
    return ICO_PREFUNDING
  } else if(numState == 1) {
    return ICO_FUNDING
  } else {
    return ICO_FUNDED
  }
}

function* watchIcoState(coin) {
  while(true) {
    yield take(SET_CURRENT_BLOCK)
    const startBlock = yield cps([coin, coin.fundingStartBlock])
    const endBlock = yield cps([coin, coin.fundingEndBlock])
    const fundedWei = yield cps([web3.eth, web3.eth.getBalance], coin.address)
    const tokensPerEth = yield cps([coin, coin.tokensPerEther])
    const icoNumState = yield cps([coin, coin.getState])
    const availableEth = crowdfundMaxEther - web3.fromWei(fundedWei, 'ether')
    const icoState = yield call(parseIcoState, icoNumState)
    yield put(setIcoState(
      startBlock.toNumber(),
      endBlock.toNumber(),
      availableEth,
      tokensPerEth.toNumber(),
      icoState
    ))
  }
}
