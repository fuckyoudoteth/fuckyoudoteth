import React from 'react'
import { connect } from 'react-redux'

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
    auctionNumber: state.site.auctionNumber - 1,
  }
}
export default connect(mapStateToProps)(HomePage)
