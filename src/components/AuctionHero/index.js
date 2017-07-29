import React from 'react'
import { connect } from 'react-redux'
import CSSTransition from 'react-transition-group/CSSTransition'

import { donate } from '../../actions'
import { getAuctionBid, getWinningLoading } from '../../selectors'

import Nav from '../Nav'
import Identicon from '../Identicon'
import DonationModal from '../DonationModal'

class DonationItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      donationOpen: false,
    }
  }
  openDonationModal() {
    this.setState({donationOpen: true})
  }
  closeDonationModal(evt) {
    this.setState({donationOpen: false})
    evt.stopPropagation()
  }
  render() {
    return (
      <div className='level-item is-link'
           onClick={() => this.openDonationModal()}>
        <div className='has-text-centered'>
          <div className='heading'>Donate to</div>
          <div className='title'>
            <Identicon centered address={this.props.donationAddress} />
          </div>
        </div>
        <DonationModal {...this.props}
                       open={this.state.donationOpen}
                       closeModal={(evt) => this.closeDonationModal(evt)} />
      </div>
    )
  }
}

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
            <DonationItem {...props} />: null
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
                      <div className='content'>
                        <div className='title is-spaced'>{props.message}</div>
                        <div className='subtitle'>
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
