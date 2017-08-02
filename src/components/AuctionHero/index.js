import React from 'react'
import { connect } from 'react-redux'
import CSSTransition from 'react-transition-group/CSSTransition'

import { donate } from '../../actions'
import { getAuctionBid, getWinningLoading } from '../../selectors'

import Nav from '../Nav'
import Identicon from '../Identicon'
import AddressModal from '../AddressModal'

class AddressItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false,
    }
  }
  openModal() {
    this.setState({modalOpen: true})
  }
  closeModal(evt) {
    this.setState({modalOpen: false})
    evt.stopPropagation()
  }
  render() {
    return (
      <div className='level-item is-link'
           onClick={() => this.openModal()}>
        <div className='has-text-centered'>
          <div className='heading'>{this.props.heading}</div>
          <div className='title'>
            <Identicon centered address={this.props.address} />
          </div>
        </div>
        <AddressModal {...this.props}
                      open={this.state.modalOpen}
                      closeModal={(evt) => this.closeModal(evt)} />
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
        <AddressItem
          heading='Author'
          address={props.bidder} />
        {
          props.donationAddress != '0x0000000000000000000000000000000000000000' ?
            <AddressItem
              heading='Donate to'
              address={props.donationAddress} />: null
        }
      </nav>
      <nav className='level' />
    </div>
  )
}

const Auction = props => {
  const defaultMessage = (
    <div className='title is-2'>
      Front Page Fuck You of the Internet
    </div>
  )
  return (
    <div className='auction-hero hero is-fullheight is-dark is-bold'>
      <div className='hero-head'>
        <div className='container'>
          <Nav />
        </div>
      </div>
      <div className='hero-body'>
        <div className='container'>
          <div className='level'>
            <div className='center'>
              <CSSTransition in={!props.loading}
                             timeout={200}
                             classNames='fade-in'>
                <div>
                  {
                    props.loading ?
                    defaultMessage :
                    props.amount && props.amount != '0' ?
                      <div>
                        <div className='title is-spaced is-xl'>{props.message}</div>
                      </div> :
                      defaultMessage
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
