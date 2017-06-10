import React from 'react'

import BidForm from '../BidForm'
import CurrentAuctionStatus from '../CurrentAuctionStatus'
import WithdrawalStatus from '../WithdrawalStatus'

const BidPage = props => {
  return (
    <div>
      <div className='title'>Current Auction Status</div>
      <CurrentAuctionStatus />
      <div className='title'>New Bid</div>
      <BidForm />
      <div className='title'>Pending Withdrawals</div>
      <WithdrawalStatus />
    </div>
  )
}

export default BidPage
