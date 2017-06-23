import React from 'react'
import { connect } from 'react-redux'

import { stringLengthRemaining } from '../../utils'
import { sendBid } from '../../actions'
import {
  getCurrentAuctionBid,
  getCurrentAuctionEnded,
  getEth,
  getPendingBid
} from '../../selectors'

import Identicon from '../Identicon'

const initialBid = {
  bidder: web3.eth.defaultAccount,
  amount: 0,
  donationAddress: web3.eth.defaultAccount,
  message: '',
}

class BidForm extends React.Component {
  constructor(props) {
    super(props)
    if(props.pendingBid) {
      this.state = {
        bidder: props.pendingBid.bidder,
        amount: props.pendingBid.amount,
        donationAddress: props.pendingBid.donationAddress,
        message: props.pendingBid.message,
      }
    } else {
      this.state = initialBid
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.pendingBid) {
      this.setState({
        bidder: nextProps.pendingBid.bidder,
        amount: nextProps.pendingBid.amount,
        donationAddress: nextProps.pendingBid.donationAddress,
        message: nextProps.pendingBid.message,
      })
    } else if(!nextProps.pendingBid && this.props.pendingBid) {
      this.setState(initialBid)
    }
  }

  setBidder(evt) {
    this.setState({bidder: evt.target.value})
  }

  setBid(evt) {
    this.setState({amount: evt.target.value})
  }

  validBid() {
    return !Number.isNaN(parseFloat(this.state.amount))
  }

  higherBid(amount) {
    if(this.props.auctionEnded && amount > 0 || amount > this.props.currentAuction.amount) {
      return true
    } else {
      return false
    }
  }

  bidHelp() {
    if(!this.validBid()) {
      return <p className='help is-danger'>Bid must be a number</p>
    } else if(!this.higherBid(this.state.amount)) {
      return <p className='help is-danger'>Bid higher than the current highest amount required</p>
    } else {
      return <p className='help'>Bid in ETH</p>
    }
  }

  setDonationAddress(evt) {
    this.setState({donationAddress: evt.target.value})
  }

  validDonationAddress() {
    return web3.isAddress(this.state.donationAddress)
  }

  setMessage(evt) {
    const message = evt.target.value
    if(this.validMessage(message)) {
      this.setState({ message })
    }
  }

  validMessage(msg) {
    msg = msg ? msg : this.state.message
    return this.messageLengthRemaining(msg) >= 0
  }

  messageLengthRemaining(msg) {
    msg = msg ? msg : this.state.message
    return stringLengthRemaining(msg)
  }

  validBidForm() {
    return !this.props.pendingBid &&
      this.validBid() &&
      this.higherBid(this.state.amount) &&
      (this.validDonationAddress() || this.state.donationAddress === '') &&
      this.validMessage()
  }

  render() {
    const bidStateClass = this.validBid() && this.higherBid(this.state.amount) ?
        '' : 'is-danger'
    const donationAddressIcon = this.validDonationAddress() ?
      <div className='control'>
        <Identicon address={this.state.donationAddress} />
      </div> : null
    const donationAddressStateClass =
      this.validDonationAddress() || this.state.donationAddress === '' ?
        '' : 'is-danger'
    const bidButtonText = !this.props.pendingBid ?
      this.props.auctionEnded ?
        'Start New Auction & Bid!' : 'Bid Now!' : 'Bidding...'
    const pending = !!this.props.pendingBid
    return (
      <div className='field'>

        <div className='field'>
          <label className='label'>Bidder</label>
          <div className='field-body'>
            <div className='field is-grouped'>
              <div className='control'>
                <Identicon address={this.state.bidder} />
              </div>
              <p className='control is-expanded'>
                <span className='select'>
                  <select disabled={pending}
                          value={this.state.bidder}
                          onChange={this.setBidder.bind(this)}>
                    { web3.eth.accounts.map(a => <option key={a}>{a}</option>) }
                  </select>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className='field'>
          <label className='label'>Bid Amount</label>
          <p className='control'>
            <input className={`input ${bidStateClass}`}
                   disabled={pending}
                   type='text'
                   placeholder='Bid in ETH'
                   value={this.state.amount}
                   onChange={this.setBid.bind(this)} />
          </p>
          {this.bidHelp()}
        </div>

        <div className='field'>
          <label className='label'>
            Message
            <span className="tag is-light is-pulled-right">
              ~{this.messageLengthRemaining()} letters remaining
            </span>
          </label>
          <p className='control'>
            <textarea className='textarea'
                      disabled={pending}
                      placeholder='Type your message here'
                      value={ this.state.message }
                      onChange={this.setMessage.bind(this)} />
          </p>
        </div>

        <div className='field'>
          <label className='label'>Donation Address</label>
          <div className='field is-grouped'>
            { donationAddressIcon }
            <p className='control is-expanded'>
              <input className={`input ${donationAddressStateClass}`}
                     disabled={pending}
                     type='text'
                     placeholder='Optional Donation Address'
                     value={this.state.donationAddress}
                     onChange={this.setDonationAddress.bind(this)} />
            </p>
          </div>
          <p className='help'>Optional ethereum address to show along with message</p>
        </div>

        <div className='button is-primary'
             disabled={!this.validBidForm()}
             onClick={this.props.sendBid.bind(
               this,
               this.state.bidder,
               this.state.amount,
               this.state.donationAddress,
               this.state.message)}>
          { bidButtonText }
        </div>
      </div>
    )
  }
}

const BidFormWrapper = props => {
  if(props.eth.connected) {
    return <BidForm {...props} />
  } else {
    return <div />
  }
}

const mapStateToProps = state => {
  return {
    eth: getEth(state),
    auctionEnded: getCurrentAuctionEnded(state),
    currentAuction: getCurrentAuctionBid(state),
    pendingBid: getPendingBid(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendBid: (bidder, amount, donationAddress, message) => dispatch(sendBid(bidder, amount, donationAddress, message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BidFormWrapper)
