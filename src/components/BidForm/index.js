import React from 'react'
import { connect } from 'react-redux'

import { stringLengthRemaining } from '../../utils'
import { sendBid } from '../../actions'

import Identicon from '../Identicon'

class BidForm extends React.Component {
  constructor(props) {
    super(props)
    if(props.pendingBid) {
      this.state = {
        bidder: props.pendingBid.bidder,
        bid: props.pendingBid.bid,
        donationAddress: props.pendingBid.donationAddress,
        message: props.pendingBid.message,
      }
    } else {
      this.state = {
        bidder: web3.eth.defaultAccount,
        bid: 0,
        donationAddress: web3.eth.defaultAccount,
        message: '',
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.pendingBid) {
      this.setState({
        bidder: nextProps.pendingBid.bidder,
        bid: nextProps.pendingBid.bid,
        donationAddress: nextProps.pendingBid.donationAddress,
        message: nextProps.pendingBid.message,
      })
    }
  }

  setBidder(evt) {
    this.setState({bidder: evt.target.value})
  }

  setBid(evt) {
    this.setState({bid: evt.target.value})
  }

  validBid() {
    return !Number.isNaN(parseFloat(this.state.bid))
  }

  bidHelp() {
    if(!this.validBid()) {
      return <p className='help is-danger'>Bid must be a number</p>
    } else if(!(this.state.bid > this.props.currentAuction.bid)) {
      return <p className='help is-danger'>Bid higher than the current highest bid required</p>
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
      (this.state.bid > this.props.currentAuction.bid) &&
      (this.validDonationAddress() || this.state.donationAddress === '') &&
      this.validMessage()
  }

  render() {
    const bidStateClass = this.validBid() && this.state.bid > this.props.currentAuction.bid ?
        '' : 'is-danger'
    const donationAddressIcon = this.validDonationAddress() ?
      <div className='control'>
        <Identicon address={this.state.donationAddress} />
      </div> : null
    const donationAddressStateClass =
      this.validDonationAddress() || this.state.donationAddress === '' ?
        '' : 'is-danger'
    return (
      <div>
        <div className='field'>
          <label className='label'>Bidder</label>
          <div className='field-body'>
            <div className='field is-grouped'>
              <div className='control'>
                <Identicon address={this.state.bidder} />
              </div>
              <p className='control is-expanded'>
                <span className='select'>
                  <select value={this.state.bidder} onChange={this.setBidder.bind(this)}>
                    { web3.eth.accounts.map(a => <option key={a}>{a}</option>) }
                  </select>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className='field'>
          <label className='label'>Bid</label>
          <p className='control'>
            <input className={`input ${bidStateClass}`}
                   type='text'
                   placeholder='Bid in ETH'
                   value={this.state.bid}
                   onChange={this.setBid.bind(this)} />
          </p>
          {this.bidHelp()}
        </div>

        <div className='field'>
          <label className='label'>Donation Address</label>
          <div className='field-body'>
            <div className='field is-grouped'>
              { donationAddressIcon }
              <p className='control is-expanded'>
                <input className={`input ${donationAddressStateClass}`}
                       type='text'
                       placeholder='Optional Donation Address'
                       value={this.state.donationAddress}
                       onChange={this.setDonationAddress.bind(this)} />
              </p>
            </div>
          </div>
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
                      placeholder='Type your message here'
                      value={ this.state.message }
                      onChange={this.setMessage.bind(this)} />
          </p>
        </div>

        <div className='button is-primary'
             disabled={!this.validBidForm()}
             onClick={this.props.sendBid.bind(
               this,
               this.state.bidder,
               this.state.bid,
               this.state.donationAddress,
               this.state.message)}>
          {
            this.props.pendingBid ?
              'Bidding...' : 'Bid Now!'
          }
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
    eth: state.site.eth,
    currentAuction: state.site.currentAuction,
    pendingBid: state.site.pendingBid,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendBid: (bidder, bid, donationAddress, message) => dispatch(sendBid(bidder, bid, donationAddress, message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BidFormWrapper)
