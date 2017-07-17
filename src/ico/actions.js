export const SET_CURRENT_BLOCK = 'SET_CURRENT_BLOCK'
export const SET_ICO_STATE = 'SET_ICO_STATE'
export const SET_BALANCE = 'SET_BALANCE'
export const TRANSFER = 'TRANSFER'

export const BUY = 'BUY'
export const BUY_SUCCESS = 'BUY_SUCCESS'
export const BUY_FAILURE = 'BUY_FAILURE'

/// other constants

// ICO states
export const ICO_PREFUNDING = 'ICO_PREFUNDING'
export const ICO_FUNDING = 'ICO_FUNDING'
export const ICO_FUNDED = 'ICO_FUNDED'

// ICO parameters
export const blocksPerDay = 4800
export const daysOfMaxTokensPerEther = 5
export const dailyLossTokensPerEther = 16
export const numberOfFundingDays = 30
export const maxTokensPerEther = 1200 // max FUC:ETH exchange rate
export const minTokensPerEther = 800
export const crowdfundMaxEther = 10000

export function setIcoState(
  icoStartBlock,
  icoEndBlock,
  availableEth,
  tokensPerEth,
  icoState
) {
  return {
    type: SET_ICO_STATE,
    icoStartBlock,
    icoEndBlock,
    availableEth,
    tokensPerEth,
    icoState,
  }
}

export function setCurrentBlock(currentBlock) {
  return {
    type: SET_CURRENT_BLOCK,
    currentBlock,
  }
}

export function setBalance(to, value) {
  return {
    type: SET_BALANCE,
    to,
    value,
  }
}

export function transfer(to, value) {
  return {
    type: TRANSFER,
    to,
    value,
  }
}

export function buy(from, value) {
  return {
    type: BUY,
    from,
    value,
  }
}

export function buySuccess(from, value) {
  return {
    type: BUY_SUCCESS,
    from,
    value,
  }
}
export function buyFailure(from, value, error) {
  return {
    type: BUY_FAILURE,
    from,
    value,
    error,
  }
}
