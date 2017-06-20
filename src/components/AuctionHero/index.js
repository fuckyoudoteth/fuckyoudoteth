import React from 'react'
import { connect } from 'react-redux'

import { getAuctionBid } from '../../selectors'

import Nav from '../Nav'
import Identicon from '../Identicon'

const Auction = props => {
  return (
    <div className='hero is-fullheight is-dark is-bold'>
      <div className='hero-head'>
        <div className='container'>
          <Nav />
        </div>
      </div>
      <div className='hero-body'>
        <div className='container'>
          <div className='columns'>
            <div className='column is-5'>
            </div>
            <div className='column is-6 is-offset-1'>
              <div className='title is-4'>Front Page Fuck You of the Internet</div>
              {
                props.amount && props.amount != '0' ?
                  <div className='content'>
                    <div className='title is-spaced'>{props.message}</div>
                    <div className='subtitle'>
                      -<span> {props.bidder}</span>
                    </div>
                  </div> :
                  <div className='title is-spaced'>No Bids</div>
              }
            </div>
          </div>
        </div>
      </div>
      <div className='hero-foot'>
        <nav className='level'>
          <div className='level-item'>
            <div className='has-text-centered'>
              <div className='heading'>Auction #</div>
              <div className='subtitle'>{props.auctionNumber}</div>
            </div>
          </div>
          <div className='level-item'>
            <div className='has-text-centered'>
              <div className='heading'>Winning Bid</div>
              <div className='subtitle'>{props.amount} ETH</div>
            </div>
          </div>
          {
            props.donationAddress != '0x0000000000000000000000000000000000000000' ?
              <div className='level-item'>
                <div className='has-text-centered'>
                  <div className='heading'>Donate to</div>
                  <div className='title'>
                    <Identicon centered address={props.donationAddress} />
                  </div>
                </div>
              </div> : null
          }
        </nav>
        <nav className='level' />
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return getAuctionBid(state, ownProps)
}

export default connect(mapStateToProps)(Auction)
