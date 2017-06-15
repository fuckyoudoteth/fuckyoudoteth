// internal actions

export const SET_ETH_CONNECTION = 'SET_ETH_CONNECTION'
export const SET_BIDDING_TIME = 'SET_BIDDING_TIME'
export const SET_AUCTION_TIME_REMAINING = 'SET_AUCTION_TIME_REMAINING'
export const SET_WITHDRAWALS = 'SET_WITHDRAWALS'

// event actions

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
export const DONATE = 'DONATE'
export const DONATE_SUCCESS = 'DONATE_SUCCESS'
export const DONATE_FAILURE = 'DONATE_FAILURE'


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

export function setAuctionTimeRemaining(auctionEnded, auctionEndTime, auctionTimeRemaining, auctionTimeRemainingSeconds) {
  return {
    type: SET_AUCTION_TIME_REMAINING,
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

export function endAuction(auctionNumber, auctionEndTime, bidder, amount, donationAddress, message) {
  return {
    type: END_AUCTION,
    auctionNumber,
    auctionEndTime,
    bidder,
    amount,
    donationAddress,
    message,
  }
}

export function highestBidIncreased(auctionNumber, bidder, amount, donationAddress, message) {
  return {
    type: HIGHEST_BID_INCREASED,
    auctionNumber,
    bidder,
    amount,
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

export function sendBid(bidder, amount, donationAddress, message) {
  return {
    type: SEND_BID,
    bidder,
    amount,
    donationAddress,
    message,
  }
}

export function sendBidSuccess() {
  return {
    type: SEND_BID_SUCCESS,
  }
}

export function sendBidFailure(error) {
  return {
    type: SEND_BID_FAILURE,
    error,
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

export function donate(address) {
  return {
    type: DONATE,
    address,
  }
}

export function donateSuccess(address, amount) {
  return {
    type: DONATE_SUCCESS,
    address,
    amount,
  }
}

export function donateFailure(address) {
  return {
    type: DONATE_FAILURE,
    address,
  }
}
