import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  resetAuction
} from '../../actions'

moment().format()

const AuctionTimeRemaining = props => {
  const heading = props.auctionEnded ?
    'Auction ended' : 'Auction will end'
  return (
    <nav className='level'>
      <div className='level-item has-text-centered'>
        <div>
          <div className='heading'>Highest Bid</div>
          <div className='subtitle'>{props.currentAuction.bid} ETH</div>
        </div>
      </div>
      <div className='level-item has-text-centered'>
        <div>
          <div className='heading'>{heading}</div>
          <div className='subtitle'>{props.auctionTimeRemaining}</div>
        </div>
      </div>
      {
        props.auctionEnded ?
          <div className='level-item has-text-centered'>
            <a className='button'
               disabled={props.pendingReset}
               onClick={props.resetAuction.bind(this)}>
              {
                props.pendingReset ?
                  'Resetting...': 'Reset Auction'
              }
            </a>
          </div> : null
      }
    </nav>
  )
}

const mapStateToProps = state => {
  return {
    auctionTimeRemaining: state.site.auctionTimeRemaining,
    auctionEnded: state.site.auctionEnded,
    currentAuction: state.site.currentAuction,
    pendingReset: state.site.pendingReset,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetAuction: () => dispatch(resetAuction())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AuctionTimeRemaining)
