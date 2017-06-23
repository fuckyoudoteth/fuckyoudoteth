import React from 'react'
import { connect } from 'react-redux'

import {
  resetAuction
} from '../../actions'

import {
  getCurrentAuctionBid,
  getCurrentAuctionEnded,
  getCurrentAuctionTimeRemaining,
  getEthRWStatus,
  getPendingReset
} from '../../selectors'

const CurrentAuctionStatus = props => {
  const heading = props.auctionEnded ?
    'Auction ended' : 'Auction will end'
  return (
    <nav className='level is-vertical'>
      <div className='level-item has-text-centered'>
        <div>
          <div className='heading'>Message</div>
          <div className='content'>{props.currentAuction.message}</div>
        </div>
      </div>
      <div className='level-item has-text-centered'>
        <div>
          <div className='heading'>Highest Bid</div>
          <div className='subtitle'>{props.currentAuction.amount} ETH</div>
        </div>
      </div>
      <div className='level-item has-text-centered'>
        <div>
          <div className='heading'>{heading}</div>
          <div className='subtitle'>{props.auctionTimeRemaining}</div>
        </div>
      </div>
      {
        props.auctionEnded && props.eth ?
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
    eth: getEthRWStatus(state),
    auctionTimeRemaining: getCurrentAuctionTimeRemaining(state),
    auctionEnded: getCurrentAuctionEnded(state),
    currentAuction: getCurrentAuctionBid(state),
    pendingReset: getPendingReset(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetAuction: () => dispatch(resetAuction())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CurrentAuctionStatus)
