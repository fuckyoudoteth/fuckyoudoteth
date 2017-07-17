import { createSelector } from 'reselect'
import {
  ICO_PREFUNDING,
  ICO_FUNDING,
  ICO_FUNDED,

  blocksPerDay,
  daysOfMaxTokensPerEther,
  minTokensPerEther,
} from './actions'

export const getIcoStartBlock = state => state.ico.icoStartBlock
export const getIcoEndBlock = state => state.ico.icoEndBlock
export const getCurrentBlock = state => state.ico.currentBlock
export const getBalances = state => state.ico.balances
export const getAvailableCoins = state => state.ico.availableCoins
export const getTokensPerEth = state => state.ico.tokensPerEth
export const getIcoState = state => state.ico.icoState

export const getIcoStarted = createSelector(
  [getIcoState],
  icoState => icoState != ICO_PREFUNDING
)

export const getIcoEnded = createSelector(
  [getIcoState],
  icoState => icoState == ICO_FUNDED
)

export const getBlocksUntilIco = createSelector(
  [getIcoStartBlock, getCurrentBlock],
  (startBlock, currentBlock) => startBlock - currentBlock
)

export const getBlocksIntoIco = createSelector(
  [getBlocksUntilIco],
  blocksUntilIco => blocksUntilIco * -1
)

export const isNextChangeIcoEnd = createSelector(
  [getTokensPerEth],
  tokensPerEth => tokensPerEth == minTokensPerEth
)

export const getBlocksUntilNextChange = createSelector(
  [getIcoState, getCurrentBlock, getIcoStartBlock],
  (icoState, currentBlock, startBlock) => {
    switch(icoState) {
    case ICO_PREFUNDING:
      return startBlock - currentBlock
    case ICO_FUNDING:
      const cutoffBlock = (blocksPerDay * daysOfMaxTokensPerEther) + startBlock
      if(currentBlock < cutoffBlock) {
        return cutoffBlock - currentBlock
      } else {
        return (currentBlock - cutoffBlock) % blocksPerDay
      }
    case ICO_FUNDED:
      return 0
    }
  }
)
