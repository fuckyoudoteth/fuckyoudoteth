import React from 'react'
import { connect } from 'react-redux'

import { withdraw } from '../../actions'
import {
  getPendingWithdrawals,
  getWithdrawals
} from '../../selectors'

import Identicon from '../Identicon'

class WithdrawalStatus extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentWithdrawal: Object.keys(props.withdrawals).length > 0 ?
          Object.keys(props.withdrawals)[0] : null
    }
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps[this.state.currentWithdrawal]) {
      const currentWithdrawal =
        Object.keys(nextProps.withdrawals).length > 0 ?
          Object.keys(nextProps.withdrawals)[0] : null
      this.setState({currentWithdrawal})
    }
  }
  toggleCurrentWithdrawal(evt) {
    const currentWithdrawal = evt.target.value
    this.setState({currentWithdrawal})
  }
  render() {
    if(!this.state.currentWithdrawal) {
      return <div>No Pending Withdrawals</div>
    }

    const address = this.state.currentWithdrawal
    const amount = this.props.withdrawals[address]
    const pending = this.props.pendingWithdrawals[address] || false

    return (
      <div className='field'>
        <div className='level'>
          <div className='level-item'>
            <div className='field is-grouped'>
              <div className='control'>
                <Identicon address={address} />
              </div>
              <div className='control'>
              {
                Object.keys(this.props.withdrawals).length == 1 ?
                  <div className='content'>
                    {address}
                  </div> :
                  <div className='select'>
                    <select value={address}
                            onChange={this.toggleCurrentWithdrawal.bind(this)}>
                      {
                        Object.keys(this.props.withdrawals)
                          .map(a => <option key={a}>{a}</option>)
                      }
                    </select>
                  </div>
              }
              </div>
            </div>
          </div>
          <div className='level-item'>
            <div className='button'
                 disabled={pending}
                 onClick={this.props.withdraw.bind(this, address)}>
              {
                pending ?
                  'Withdrawing' : `Withdraw ${amount} ETH`
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    withdrawals: getWithdrawals(state),
    pendingWithdrawals: getPendingWithdrawals(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    withdraw: (address) => dispatch(withdraw(address)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawalStatus)
