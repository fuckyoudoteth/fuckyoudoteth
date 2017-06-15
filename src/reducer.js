import {
  SET_ETH_CONNECTION,
  SET_BIDDING_TIME,
  SET_AUCTION_TIME_REMAINING,
  SET_WITHDRAWALS,
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

export const newBid = (
  bidder='0x0000000000000000000000000000000000000000',
  amount=0,
  donationAddress='0x0000000000000000000000000000000000000000',
  message='',
) => {
  return {
    bidder,
    amount,
    donationAddress,
    message,
  }
}

export const newAuction = (
  number=0,
  endTime=new Date(),
  highestBid=newBid(),
) => {
  return {
    number,
    endTime,
    highestBid,
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
  biddingTime: 0,
  // auction data
  currentAuctionStatus: {
    number: 0,
    timeRemaining: '',
    timeRemainingSeconds: 0,
    ended: true,
  },
  auctions: {},
  withdrawals: {},
  pendingBid: null,
  pendingReset: null,
  pendingWithdrawals: {},
}

export default function reducer(state=initialState, action) {
  if(action.type !== SET_AUCTION_TIME_REMAINING) console.log(action)
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
  case SET_AUCTION_TIME_REMAINING:
    return {
      ...state,
      currentAuctionStatus: {
        ...state.currentAuctionStatus,
        timeRemaining: action.auctionTimeRemaining,
        timeRemainingSeconds: action.auctionTimeRemainingSeconds,
        ended: action.auctionEnded,
      },
    }
  case SET_WITHDRAWALS:
    return {
      ...state,
      withdrawals: action.withdrawals,
      pendingWithdrawals: action.pendingWithdrawals,
    }
  case END_AUCTION:
    return {
      ...state,
      pendingReset: null,
      currentAuctionStatus: {
        ...state.currentAuctionStatus,
        number: action.auctionNumber,
        ended: false,
      },
      auctions: {
        ...state.auctions,
        [action.actionNumber + 1]: newAuction(
          action.auctionNumber + 1,
          new Date(Number(action.auctionEndTime) + (state.biddingTime * 1000)),
          newBid()),
        [action.auctionNumber]: newAuction(
          action.auctionNumber,
          action.auctionEndTime,
          newBid(
            action.bidder,
            action.amount,
            action.donationAddress,
            action.message))
      },
    }
  case HIGHEST_BID_INCREASED:
    return {
      ...state,
      pendingBid: null,
      auctions: {
        ...state.auctions,
        [action.auctionNumber] : {
          ...state.auctions[auctionNumber],
          highestBid: newBid(
            action.bidder,
            action.amount,
            action.donationAddress,
            action.message)
        }
      },
    }
  case SEND_BID:
    return {
      ...state,
      pendingBid: newBid(
        action.bidder,
        action.amount,
        action.donationAddress,
        action.message),
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
