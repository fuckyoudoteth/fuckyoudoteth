import React from 'react'
import { connect } from 'react-redux'

import { getAuctionNumber } from '../../selectors'

import Auction from '../Auction'

const HomePage = props => {
  return (
    <div>
      <div className='title'></div>
      <Auction {...props} />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    auctionNumber: getAuctionNumber(state) - 1,
  }
}
export default connect(mapStateToProps)(HomePage)
