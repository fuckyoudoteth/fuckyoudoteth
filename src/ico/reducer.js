import {
  SET_CURRENT_BLOCK,
  SET_ICO_STATE,
  SET_BALANCE,
  TRANSFER,

  ICO_PREFUNDING,
  ICO_FUNDING,
  ICO_FUNDED,
  crowdfundMaxEther,
  maxTokensPerEther,
} from './actions'

const initialState = {
  currentBlock: 0,
  icoStartBlock: 0,
  icoEndBlock: 0,
  availableEth: crowdfundMaxEther,
  tokensPerEth: maxTokensPerEther,
  icoState: ICO_PREFUNDING,
  balances: {},
}

export default function reducer(state=initialState, action) {
  switch(action.type) {
    case SET_CURRENT_BLOCK:
      return {
        ...state,
        currentBlock: action.currentBlock,
      }
    case SET_ICO_STATE:
      return {
        ...state,
        icoStartBlock: action.icoStartBlock,
        icoEndBlock: action.icoEndBlock,
        availableEth: action.availableEth,
        tokensPerEth: action.tokensPerEth,
        icoState: action.icoState,
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
