import React from 'react'
import {connect} from 'react-redux'

import IcoTimer from '../IcoTimer'
import BuyForm from '../BuyForm'
import ROEthWarning from '../../../components/ROEthWarning'
import WhitepaperSection from '../../../components/WhitepaperSection'

import {getEthRWStatus} from '../../../selectors'
import {ICO_FUNDED} from '../../actions'
import {getIcoState} from '../../selectors'

const IcoPage = props => {
  let form
  if(props.isRW) {
    if(props.icoState == ICO_FUNDED) {
      form = null
    } else {
      form = <BuyForm />
    }
  } else {
    form = <ROEthWarning />
  }
  return (
    <div>
      <div className='title is-2 has-text-centered'>
        FuckYouCoin ICO
      </div>
      <IcoTimer />
      {form}
      <WhitepaperSection />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    icoState: getIcoState(state),
    isRW: getEthRWStatus(state),
  }
}

export default connect(mapStateToProps)(IcoPage)
