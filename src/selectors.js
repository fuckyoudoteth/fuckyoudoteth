import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'

import { newAuction } from './reducer'

export const getEth = state => state.site.eth
export const getEthRWStatus = state => state.site.eth.node

// get auction number supplied by props or current auction number
export const getAuctionNumber = (state, props) =>
  (props && props.auctionNumber) || state.site.currentAuctionStatus.number

export const getAuctions = state => state.site.auctions

export const getAuction = createCachedSelector(
  [getAuctions, getAuctionNumber],
  (auctions, number) => auctions[number] || newAuction()
)(getAuctionNumber)
export const getAuctionBid = createCachedSelector(
  [getAuction],
  auction => auction.highestBid
)(getAuctionNumber)

export const getCurrentAuction = createSelector(
  [getAuctions, getAuctionNumber],
  (auctions, number) => auctions[number] || newAuction()
)
export const getCurrentAuctionBid = createSelector(
  [getCurrentAuction],
  auction => auction.highestBid
)

export const getCurrentAuctionStatus = state => state.site.currentAuctionStatus
export const getCurrentAuctionEnded = createSelector(
  [getCurrentAuctionStatus],
  status => status.ended
)
export const getCurrentAuctionTimeRemaining = createSelector(
  [getCurrentAuctionStatus],
  status => status.timeRemaining
)

export const getWithdrawals = state => state.site.withdrawals

export const getPendingBid = state => state.site.pendingBid
export const getPendingReset = state => state.site.pendingReset
export const getPendingWithdrawals = state => state.site.pendingWithdrawals
