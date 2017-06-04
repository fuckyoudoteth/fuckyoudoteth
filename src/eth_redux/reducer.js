import {
  SET_ETH_CONNECTION,
} from './actions'

export default function reducer(state=initialState, action) {
  switch(action.type) {
  case SET_ETH_CONNECTION:
    let eth = {
      ...state.eth,
      connected: action.connected,
      node: action.node,
      network: action.network,
    }
    return { ...state, eth }
  }
  return state
}
