import {
  SET_ETH_CONNECTION,
  SET_BIDDING_TIME,
  SET_AUCTION_END,
  SET_WITHDRAWALS,
  NEW_AUCTION,
  END_AUCTION,
  HIGHEST_BID_INCREASED,
  SEND_BID,
  SEND_BID_SUCCESS,
  SEND_BID_FAILURE,
  RESET_AUCTION,
  RESET_AUCTION_SUCCESS,
  RESET_AUCTION_FAILURE,
  WITHDRAW,
  WITHDRAW_SUCCESS,
  WITHDRAW_FAILURE,
} from './actions'

export const newAuction = () => {
  return {
    bidder: '0x0000000000000000000000000000000000000000',
    bid: 0,
    donationAddress: '0x0000000000000000000000000000000000000000',
    message: '',
  }
}

const initialState = {
  // eth state
  eth: {
    connected: false,
    node: false,
    network: '',
  },
  // auction metadata
  auctionNumber: 0,
  auctionStartTime: new Date(),
  auctionEndTime: new Date(),
  auctionTimeRemaining: '',
  auctionTimeRemainingSeconds: 0,
  auctionEnded: false,
  biddingTime: 0,
  withdrawals: {},
  // auction data
  currentAuction: newAuction(),
  pastAuctions: {},
  pendingBid: null,
  pendingReset: null,
  pendingWithdrawals: {},
}

export default function reducer(state=initialState, action) {
  if(action.type !== SET_AUCTION_END) console.log(action)
  switch(action.type) {
  case SET_ETH_CONNECTION:
    let eth = {
      ...state.eth,
      connected: action.connected,
      node: action.node,
      network: action.network,
    }
    return { ...state, eth }
  case SET_BIDDING_TIME:
    return { ...state, biddingTime: action.biddingTime }
  case SET_AUCTION_END:
    return {
      ...state,
      auctionEndTime: action.auctionEndTime,
      auctionEnded: action.auctionEnded,
      auctionTimeRemaining: action.auctionTimeRemaining,
      auctionTimeRemainingSeconds: action.auctionTimeRemainingSeconds,
    }
  case SET_WITHDRAWALS:
    return {
      ...state,
      withdrawals: action.withdrawals,
      pendingWithdrawals: action.pendingWithdrawals,
    }
  case NEW_AUCTION:
    if(action.auctionNumber > state.auctionNumber) {
      return {
        ...state,
        auctionNumber: action.auctionNumber,
        auctionStartTime: action.auctionStartTime,
        currentAuction: newAuction(),
      }
    }
  case END_AUCTION:
    return {
      ...state,
      pendingReset: null,
      pastAuctions: {
        ...state.pastAuctions,
        [action.auctionNumber]: {
          bidder: action.bidder,
          bid: action.bid,
          donationAddress: action.donationAddress,
          message: action.message,
        },
      },
    }
  case HIGHEST_BID_INCREASED:
    if(action.auctionNumber == state.auctionNumber) {
      return {
        ...state,
        pendingBid: null,
        currentAuction: {
          bidder: action.bidder,
          bid: action.bid,
          donationAddress: action.donationAddress,
          message: action.message,
        },
      }
    }
  case SEND_BID:
    return {
      ...state,
      pendingBid: {
        bidder: action.bidder,
        bid: action.bid,
        donationAddress: action.donationAddress,
        message: action.message,
      },
    }
  case SEND_BID_FAILURE:
    return {
      ...state,
      pendingBid: null,
    }
  case RESET_AUCTION:
    return {
      ...state,
      pendingReset: true,
    }
  case RESET_AUCTION_FAILURE:
    return {
      ...state,
      pendingReset: null,
    }
  case WITHDRAW:
    return {
      ...state,
      pendingWithdrawals: {
        ...state.pendingWithdrawals,
        [action.address]: true,
      },
    }
  case WITHDRAW_FAILURE:
    let newPendingWithdrawals = { ...state.pendingWithdrawals }
    delete newPendingWithdrawals[action.address]
    return {
      ...state,
      pendingWithdrawals: newPendingWithdrawals,
    }
  }
  return state
}
