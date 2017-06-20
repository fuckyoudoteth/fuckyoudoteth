import React from 'react'

import BidForm from '../BidForm'
import CurrentAuctionStatus from '../CurrentAuctionStatus'
import WithdrawalStatus from '../WithdrawalStatus'

const BidPage = props => {
  return (
    <div>
      <div className='columns'>
        <div className='column'>
          <div className='title'>Auction Status</div>
          <CurrentAuctionStatus />
        </div>
        <div className='column is-7'>
          <div className='title'>New Bid</div>
          <BidForm />
        </div>
      </div>
      <div className='title'>Pending Withdrawals</div>
      <WithdrawalStatus />
    </div>
  )
}

export default BidPage
