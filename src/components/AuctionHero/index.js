import React from 'react'
import { connect } from 'react-redux'
import CSSTransition from 'react-transition-group/CSSTransition'

import { donate } from '../../actions'
import { getAuctionBid, getWinningLoading } from '../../selectors'

import Nav from '../Nav'
import Identicon from '../Identicon'

const AuctionFooter = props => {
  return (
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
            <div className='level-item is-link'
                 onClick={() => props.donate(props.donationAddress)}>
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
  )
}

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
              <CSSTransition in={!props.loading}
                             timeout={200}
                             classNames='fade-in'>
                <div>
                  <div className='title is-4'>Front Page Fuck You of the Internet</div>
                  {
                    props.loading ?
                    <div /> :
                    props.amount && props.amount != '0' ?
                      <div classname='content'>
                        <div classname='title is-spaced'>{props.message}</div>
                        <div classname='subtitle'>
                          -<span> {props.bidder}</span>
                        </div>
                      </div> :
                      <div className='title is-spaced'>No Bids</div>
                  }
                </div>
              </CSSTransition>
            </div>
          </div>
        </div>
      </div>
      <CSSTransition in={!props.loading}
                     timeout={200}
                     classNames='fade-in'>
        {props.loading ?
          <div /> :
          <AuctionFooter {...props} />}
      </CSSTransition>
  </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...getAuctionBid(state, ownProps),
    loading: getWinningLoading(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    donate: address => dispatch(donate(address))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auction)
