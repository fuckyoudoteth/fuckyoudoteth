import {
  SET_ICO_BLOCKS,
  SET_CURRENT_BLOCK,
  SET_BALANCE,
  TRANSFER,
} from './actions'

const initialState = {
  icoStartBlock: 0,
  icoEndBlock: 0,
  currentBlock: 0,
  balances: {},
}

export default function reducer(state=initialState, action) {
  switch(action.type) {
    case SET_ICO_BLOCKS:
      return {
        ...state,
        icoStartBlock: action.icoStartBlock,
        icoEndBlock: action.icoEndBlock,
      }
    case SET_CURRENT_BLOCK:
      return {
        ...state,
        currentBlock: action.currentBlock,
      }
    case SET_BALANCE:
    case TRANSFER:
      return {
        ...state,
        balances: {
          ...state.balances,
          [action.to]: action.value + (state.balances[action.to] || 0),
        }
      }
  }
  return state
}
