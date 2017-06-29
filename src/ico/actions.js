export const SET_ICO_BLOCKS = 'SET_ICO_BLOCKS'
export const SET_CURRENT_BLOCK = 'SET_CURRENT_BLOCK'
export const SET_BALANCE = 'SET_BALANCE'
export const TRANSFER = 'TRANSFER'

export const BUY = 'BUY'
export const BUY_SUCCESS = 'BUY_SUCCESS'
export const BUY_FAILURE = 'BUY_FAILURE'

export function setIcoBlocks(icoStartBlock, icoEndBlock) {
  return {
    type: SET_ICO_BLOCKS,
    icoStartBlock,
    icoEndBlock,
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

export function buy(to, value) {
  return {
    type: BUY,
    from,
    value,
  }
}

export function buySuccess(to, value) {
  return {
    type: BUY_SUCCESS,
    from,
    value,
  }
}
export function buy(to, value) {
  return {
    type: BUY_FAILURE,
    from,
    value,
  }
}
