import React from 'react'
import { connect } from 'react-redux'
import CSSTransition from 'react-transition-group/CSSTransition'
import TransitionGroup from 'react-transition-group/TransitionGroup'

import {
  getCurrentLoading,
  getEthLoading,
  getEthRWStatus,
  hasWithdrawals,
} from '../../selectors'

import BidForm from '../BidForm'
import CurrentAuctionStatus from '../CurrentAuctionStatus'
import ROEthWarning from '../ROEthWarning'
import WithdrawalStatus from '../WithdrawalStatus'

const CurrentHighestBid = props => (
  <div className='card highest-bid-card'>
    <div className='card-content has-text-centered'>
      <CSSTransition in={!props.bidLoading}
                     timeout={1200}
                     classNames='current-bid'>

       {
         true && props.bidLoading ?
          <div className='button is-loading is-primary is-outlined'/> :
          <CurrentAuctionStatus />
       }

      </CSSTransition>
           </div>
         </div>
)

const NewBid = props => (
  <CSSTransition in={!props.ethLoading}
                 timeout={200}
                 classNames='fade-in'>
    {
      props.ethLoading ?
        <div/> :
      !props.eth ?
        <div /> :
        <div className='card highest-bid-card'>
          <div className='card-content'>
            <BidForm />
          </div>
        </div>
    }
  </CSSTransition>
)

const PendingWithdrawals = props => (
  <CSSTransition in={!props.ethLoading}
                     timeout={200}
                     classNames='fade-in'>
    {
      props.ethLoading || !props.eth || !props.hasWithdrawals ?
        <div /> :
        <div className='card highest-bid-card'>
          <div className='card-content'>
            <WithdrawalStatus />
          </div>
        </div>
    }
  </CSSTransition>
)

const BidPage = props => {
  return (
    <div>
      <CurrentHighestBid {...props} />
      <NewBid {...props} />
      <PendingWithdrawals {...props} />
      {
        !props.ethLoading && !props.eth &&
        <ROEthWarning />
      }
      <div className='bottom-image dolphin' />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    eth: getEthRWStatus(state),
    ethLoading: getEthLoading(state),
    bidLoading: getCurrentLoading(state),
    hasWithdrawals: hasWithdrawals(state),
  }
}

export default connect(mapStateToProps)(BidPage)
