import React from 'react'
import { connect } from 'react-redux'

import {
  ICO_PREFUNDING,
  ICO_FUNDING,
  ICO_FUNDED,
} from '../../actions'

import {
  getBlocksUntilNextChange,
  getIcoState,
} from '../../selectors'

const PrefundingTimer = props => {
  return (
    <div>
      <p className='title'>{props.blocksRemaining}<p>
      <p className='heading'>blocks until ICO begins!</p>
    </div>
  )
}

const FundingTimer = props => {
  return (
    <div>
      <p className='title'>{props.blocksRemaining}<p>
      <p className='heading'>blocks until next ICO reward.</p>
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

const IcoTimer = props => {
  return (
    <nav className='level'>
      <div className='level-item has-text-centered'>
      {
        switch(props.icoState) {
          case ICO_PREFUNDING:
            return <PrefundingTimer {...props} />
          case ICO_FUNDING:
            return <FundingTimer {...props} />
          case ICO_FUNDED:
            return <FundedTimer {...props} />
        }
      }
      </div>
    </nav>
  )
}

const mapStateToProps = state => {
  return {
    icoState: getIcoState(state),
    blocksRemaining: getBlocksUntilNextChange(state),
  }
}

export default connect(mapStateToProps)(IcoTimer)
