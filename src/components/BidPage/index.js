import React from 'react'
import { connect } from 'react-redux'

import {
  getCurrentLoading,
  getEthLoading,
  getEthRWStatus,
} from '../../selectors'

import BidForm from '../BidForm'
import CurrentAuctionStatus from '../CurrentAuctionStatus'
import ROEthWarning from '../ROEthWarning'
import WithdrawalStatus from '../WithdrawalStatus'

const BidPage = props => {
  return (
    <div>
      <div className='columns'>
        <div className='column'>
          <div className='title'>Current Highest Bid</div>
          {
            !props.bidLoading &&
              <CurrentAuctionStatus />
          }
        </div>
        {
          props.eth ?
          <div className='column is-7'>
            <div className='title'>New Bid</div>
            <BidForm />
          </div> : null
        }
      </div>
      {
        props.ethLoading ?
          <div /> :
        props.eth ?
        <div>
          <div className='title'>Pending Withdrawals</div>
          <WithdrawalStatus />
        </div> :
        <div className='columns'>
          <div className='column is-half is-offset-one-quarter'>
            <ROEthWarning />
          </div>
        </div>
      }
    </div>
  )
}

const mapStateToProps = state => {
  return {
    eth: getEthRWStatus(state),
    ethLoading: getEthLoading(state),
    bidLoading: getCurrentLoading(state),
  }
}

export default connect(mapStateToProps)(BidPage)
