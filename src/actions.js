// internal actions

export const SET_ETH_CONNECTION = 'SET_ETH_CONNECTION'
export const SET_BIDDING_TIME = 'SET_BIDDING_TIME'
export const SET_AUCTION_END = 'SET_AUCTION_END'
export const SET_WITHDRAWALS = 'SET_WITHDRAWALS'

// event actions

export const NEW_AUCTION = 'NEW_AUCTION'
export const END_AUCTION = 'END_AUCTION'
export const HIGHEST_BID_INCREASED = 'HIGHEST_BID_INCREASED'
export const WITHDRAWAL = 'WITHDRAWAL'

// user actions

export const SEND_BID = 'SEND_BID'
export const SEND_BID_SUCCESS = 'SEND_BID_SUCCESS'
export const SEND_BID_FAILURE = 'SEND_BID_FAILURE'
export const RESET_AUCTION = 'RESET_AUCTION'
export const RESET_AUCTION_SUCCESS = 'RESET_AUCTION_SUCCESS'
export const RESET_AUCTION_FAILURE = 'RESET_AUCTION_FAILURE'
export const WITHDRAW = 'WITHDRAW'
export const WITHDRAW_SUCCESS = 'WITHDRAW_SUCCESS'
export const WITHDRAW_FAILURE = 'WITHDRAW_FAILURE'


export function setEthConnection(node, connected, network) {
  return {
    type: SET_ETH_CONNECTION,
    node,
    connected,
    network,
  }
}

export function createBid(bidAmount, donationAddress, message) {
  return {
    type: CREATE_BID,
    bidAmount,
    donationAddress,
    message,
  }
}

export function setBiddingTime(biddingTime) {
  return {
    type: SET_BIDDING_TIME,
    biddingTime,
  }
}

export function setAuctionEnd(auctionEnded, auctionEndTime, auctionTimeRemaining, auctionTimeRemainingSeconds) {
  return {
    type: SET_AUCTION_END,
    auctionEnded,
    auctionEndTime,
    auctionTimeRemaining,
    auctionTimeRemainingSeconds,
  }
}

export function setWithdrawals(withdrawals, pendingWithdrawals) {
  return {
    type: SET_WITHDRAWALS,
    withdrawals,
    pendingWithdrawals,
  }
}

export function newAuction(auctionNumber, auctionStartTime) {
  return {
    type: NEW_AUCTION,
    auctionNumber,
    auctionStartTime,
  }
}

export function endAuction(auctionNumber, bidder, bid, donationAddress, message) {
  return {
    type: END_AUCTION,
    auctionNumber,
    bidder,
    bid,
    donationAddress,
    message,
  }
}

export function highestBidIncreased(auctionNumber, bidder, bid, donationAddress, message) {
  return {
    type: HIGHEST_BID_INCREASED,
    auctionNumber,
    bidder,
    bid,
    donationAddress,
    message,
  }
}

export function withdrawal(address, amount) {
  return {
    type: WITHDRAWAL,
    address,
    amount,
  }
}

export function sendBid(bidder, bid, donationAddress, message) {
  return {
    type: SEND_BID,
    bidder,
    bid,
    donationAddress,
    message,
  }
}

export function sendBidSuccess() {
  return {
    type: SEND_BID_SUCCESS,
  }
}

export function sendBidFailure() {
  return {
    type: SEND_BID_FAILURE,
  }
}

export function resetAuction() {
  return {
    type: RESET_AUCTION,
  }
}

export function resetAuctionSuccess() {
  return {
    type: RESET_AUCTION_SUCCESS,
  }
}

export function resetAuctionFailure() {
  return {
    type: RESET_AUCTION_FAILURE,
  }
}

export function withdraw(address) {
  return {
    type: WITHDRAW,
    address,
  }
}

export function withdrawSuccess(address, amount) {
  return {
    type: WITHDRAW_SUCCESS,
    address,
    amount,
  }
}

export function withdrawFailure(address) {
  return {
    type: WITHDRAW_FAILURE,
    address,
  }
}
