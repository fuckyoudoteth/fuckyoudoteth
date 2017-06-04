import React from 'react'
import { connect } from 'react-redux'

import { newAuction } from '../../reducer'

import Identicon from '../Identicon'
//  <Identicon address={props.donationAddress} />
const Auction = props => {
  return (
    <div className='card'>
      {
        props.bid && props.bid != '0' ?
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
            <div className='subtitle'>{props.bid} ETH</div>
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
  return state.site.pastAuctions[ownProps.auctionNumber] || newAuction()
}

export default connect(mapStateToProps)(Auction)
