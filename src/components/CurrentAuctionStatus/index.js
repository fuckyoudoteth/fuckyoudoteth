import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  resetAuction
} from '../../actions'

moment().format()

class AuctionTimeRemaining extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      auctionEnded: this.auctionEnded(),
      timeRemaining: this.timeRemaining(),
      auctionEndTime: this.auctionEndTime(),
    }
    this.updateId = window.setInterval(this.update.bind(this), 1000)
  }
  componentWillUnmount() {
    window.clearInterval(this.updateId)
  }

  update() {
    this.setState({
      auctionEnded: this.auctionEnded(),
      timeRemaining: this.timeRemaining(),
      auctionEndTime: this.auctionEndTime(),
    })
  }
  auctionEnded() {
    return (new Date()) > this.auctionEndTime()
  }

  auctionEndTime() {
    return new Date(this.props.auctionStartTime.getTime() + (this.props.biddingTime * 1000))
  }

  timeRemainingSeconds() {
    return (new Date()) - this.auctionEndTime()
  }

  timeRemaining() {
    return moment(this.auctionEndTime()).fromNow()
  }

  render() {
    const heading = this.state.auctionEnded ?
      'Auction ended' : 'Auction time remaining'
    return (
      <nav className='level'>
        <div className='level-item has-text-centered'>
          <div>
            <div className='heading'>Highest Bid</div>
            <div className='subtitle'>{this.props.currentAuction.bid} ETH</div>
          </div>
        </div>
        <div className='level-item has-text-centered'>
          <div>
            <div className='heading'>{heading}</div>
            <div className='subtitle'>{this.state.timeRemaining}</div>
          </div>
        </div>
        {
          this.state.auctionEnded ?
            <div className='level-item has-text-centered'>
              <a className='button'
                 disabled={this.props.pendingReset}
                 onClick={this.props.resetAuction.bind(this)}>
                {
                  this.props.pendingReset ?
                    'Resetting...': 'Reset Auction'
                }
              </a>
            </div> : null
        }
      </nav>
    )
  }
}

const mapStateToProps = state => {
  return {
    auctionStartTime: state.site.auctionStartTime,
    biddingTime: state.site.biddingTime,
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
