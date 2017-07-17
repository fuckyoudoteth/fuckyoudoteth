import React from 'react'
import { connect } from 'react-redux'

import {
  ICO_FUNDING,
  buy,
} from '../../actions'

import {
  getIcoState,
  getTokensPerEth,
} from '../../selectors'

class BuyForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 1
    }
  }
  setAmount(evt) {
    this.setState({amount: evt.target.value})
  }
  validAmount() {
    return !Number.isNaN(Number(this.state.amount))
  }
  render() {
    const buttonDisabled = this.props.icoState != ICO_FUNDING && this.validAmount()
    const amountState = this.validAmount() ? '' : 'is-danger'
    const fucAmount = this.state.amount * this.props.tokensPerEth
    return (
      <div className='level'>
        <div className='level-item'>
          <div className='field has-addons'>
            <p className='control'>
              <div className='eth-label'>
                ETH
              </div>
              <input className={`input is-extra-large ${amountState}`}
                     type='text'
                     onChange={this.setAmount.bind(this)}
                     value={this.state.amount} />
            </p>
            <p className='control'>
              <a className='button is-success is-extra-large'
                 disabled={buttonDisabled}
                 onClick={this.props.buy.bind(this, this.state.amount)}>
                BUY {fucAmount} FUC
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    icoState: getIcoState(state),
    tokensPerEth: getTokensPerEth(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    buy: amount => dispatch(buy(web3.eth.accounts[0], Number(amount)))
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(BuyForm)
