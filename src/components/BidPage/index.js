import React from 'react'
import { connect } from 'react-redux'
import CSSTransition from 'react-transition-group/CSSTransition'
import TransitionGroup from 'react-transition-group/TransitionGroup'

import {
  getCurrentLoading,
  getEthLoading,
  getEthRWStatus,
} from '../../selectors'

import BidForm from '../BidForm'
import CurrentAuctionStatus from '../CurrentAuctionStatus'
import ROEthWarning from '../ROEthWarning'
import WithdrawalStatus from '../WithdrawalStatus'

const tabs = [
  'New Bid',
  'Current Highest Bid',
  'Pending Withdrawals',
]

const CurrentHighestBid = props => (
    <CSSTransition in={!props.bidLoading}
                   timeout={200}
                   classNames='fade-in'>
      {
        props.bidLoading ?
          <div /> :
          <CurrentAuctionStatus />
      }
    </CSSTransition>
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
        <div>
          <BidForm />
        </div>
    }
  </CSSTransition>
)

const PendingWithdrawals = props => (
  <CSSTransition in={!props.ethLoading}
                     timeout={200}
                     classNames='fade-in'>
    {
      props.ethLoading ?
        <div /> :
      !props.eth ?
        <div /> :
        <div>
          <WithdrawalStatus />
        </div>
    }
  </CSSTransition>
)

const BidPageElement = ({children, ...props}) => (
  <CSSTransition
    {...props}
    key={props.key}
    timeout={500}
    classNames='wipe-in'>
    <div>
    <div className='card'>
    <div className='card-content'>
    {children}
    </div>
    </div>
    {
      !props.ethLoading && !props.eth &&
        <ROEthWarning />
    }
    <div className='bottom-image dolphin' />
    </div>
  </CSSTransition>
)

class BidPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTab: 0,
    }
  }
  render() {
    return (
      <div>
        <div className='bid-tabs tabs is-right'>
          <ul>
            {tabs.map((t, ix) => (
              <li key={ix}
                  className={ix == this.state.currentTab && 'is-active'}
                  onClick={() => this.setState({currentTab: ix})}>
                <a>
                {t}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <TransitionGroup>
        {
          this.state.currentTab == 0 ?
            <BidPageElement {...this.props} key={0}>
              <NewBid {...this.props} />
            </BidPageElement>
          : this.state.currentTab == 1 ?
            <BidPageElement {...this.props} key={1}>
              <CurrentHighestBid {...this.props} />
            </BidPageElement>
          : this.state.currentTab == 2 ?
            <BidPageElement {...this.props} key={2}>
              <PendingWithdrawals {...this.props} />
            </BidPageElement>
          : <div />
        }
        </TransitionGroup>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    eth: getEthRWStatus(state),
    ethLoading: getEthLoading(state),
    bidLoading: getCurrentLoading(state),
  }
}

export default connect(mapStateToProps)(BidPage)
