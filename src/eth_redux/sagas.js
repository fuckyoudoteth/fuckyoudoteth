import { delay, throttle } from 'redux-saga'
import { call, put, select, fork } from 'redux-saga/effects'
import promisify from 'es6-promisify'

import {
  setEthConnection,
 } from './actions'

export default function* rootSaga() {
  yield startEthConnection()
  yield fork(watchEthConnection)
}

function* startEthConnection() {
  const node = yield initEth()
  const connected = yield checkEthConnection()
  const network = yield checkEthNetwork()
  yield put(setEthConnection(node, connected, network))
}

function initEth() {
  if(typeof window.web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider)
    return true
  } else {
    let Web3 = require('web3')
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
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
    const connected = yield checkEthConnection()
    if(!connected) {
      yield fork(startEthConnection)
      break
    }
    yield delay(3000)
  }
}
