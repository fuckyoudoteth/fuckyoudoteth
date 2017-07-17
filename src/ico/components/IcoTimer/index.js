import React from 'react'
import { connect } from 'react-redux'

import {
  ICO_PREFUNDING,
  ICO_FUNDING,
  ICO_FUNDED,

  dailyLossTokensPerEther,
  minTokensPerEther,
} from '../../actions'

import {
  getBlocksUntilNextChange,
  getIcoState,
  getTokensPerEth,
} from '../../selectors'

const PrefundingTimer = props => {
  return (
    <div>
      <p className='title'>{props.blocksRemaining}</p>
      <p className='heading'>blocks until ICO begins!</p>
    </div>
  )
}

const FundingTimer = props => {
  let timerMsg = props.tokensPerEth - dailyLossTokensPerEther == minTokensPerEther ?
    'blocks until ICO ENDS!!!' :
    'blocks until next lower ICO reward'
  return (
    <div>
      <p className='title'>{props.blocksRemaining}</p>
      <p className='heading'>{timerMsg}</p>
    </div>
  )
}

const FundedTimer = props => {
  return (
    <div>
      <p className='title'>ICO Finished 🖕</p>
    </div>
  )
}

const IcoRate = props => {
  return (
    <div>
      <p className='heading'>Current ICO reward</p>
      <p className='title'>{props.tokensPerEth} FUC per ETH</p>
    </div>
  )
}

const IcoTimer = props => {
  let timer, rate;
  switch(props.icoState) {
    case ICO_PREFUNDING:
      timer = <PrefundingTimer {...props} />
      rate = <IcoRate {...props} />
      break
    case ICO_FUNDING:
      timer = <FundingTimer {...props} />
      rate = <IcoRate {...props} />
      break
    case ICO_FUNDED:
      timer = <FundedTimer {...props} />
      rate = null
      break
  }
  return (
    <section className='section'>
      <nav className='level'>
        <div className='level-item has-text-centered'>
          {timer}
        </div>
      </nav>
      {
        rate &&
        <nav className='level'>
          <div className='level-item has-text-centered'>
            {rate}
          </div>
        </nav>

      }
    </section>
  )
}

const mapStateToProps = state => {
  return {
    icoState: getIcoState(state),
    blocksRemaining: getBlocksUntilNextChange(state),
    tokensPerEth: getTokensPerEth(state),
  }
}

export default connect(mapStateToProps)(IcoTimer)
