import React from 'react'

import BidForm from '../BidForm'
import CurrentAuctionStatus from '../CurrentAuctionStatus'
import WithdrawalStatus from '../WithdrawalStatus'

const BidPage = props => {
  return (
    <div>
      <WithdrawalStatus />
      <CurrentAuctionStatus />
      <div className='title'>New Bid</div>
      <BidForm />
    </div>
  )
}

export default BidPage
