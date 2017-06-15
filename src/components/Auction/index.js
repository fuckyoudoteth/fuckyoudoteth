import React from 'react'
import { connect } from 'react-redux'

import { getAuctionBid } from '../../selectors'

import Identicon from '../Identicon'
//  <Identicon address={props.donationAddress} />
const Auction = props => {
  return (
    <div className='card'>
      {
        props.amount && props.amount != '0' ?
          <div className='card-content'>
            <div className='title is-4'>Fuck you</div>
            <div className='title is-spaced'>{props.message}</div>
            <div className='subtitle'>
              -
              <span> {props.bidder}</span>
            </div>
          </div> :
          <div className='card-content'>
            <div className='title is-4'>Fuck you</div>
            <div className='title is-spaced'>No Bids</div>
          </div>
      }
      <footer className='card-footer'>
        <div className='card-footer-item'>
          <div className='has-text-centered'>
            <div className='heading'>Auction #</div>
            <div className='subtitle'>{props.auctionNumber}</div>
          </div>
        </div>
        <div className='card-footer-item'>
          <div className='has-text-centered'>
            <div className='heading'>Winning Bid</div>
            <div className='subtitle'>{props.amount} ETH</div>
          </div>
        </div>
        {
          props.donationAddress != '0x0000000000000000000000000000000000000000' ?
            <div className='card-footer-item'>
              <div className='has-text-centered'>
                <div className='heading'>Donate to</div>
                <div className='title'>
                  <Identicon centered address={props.donationAddress} />
                </div>
              </div>
            </div> : null
        }
      </footer>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return getAuctionBid(state, ownProps)
}

export default connect(mapStateToProps)(Auction)
