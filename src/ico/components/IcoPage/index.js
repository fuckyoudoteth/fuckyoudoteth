import React from 'react'

import IcoTimer from '../IcoTimer'
import BuyForm from '../BuyForm'
import ROEthWarning from '../../../components/ROEthWarning'

const IcoPage = props => {
  return (
    <div>
      <IcoTimer />
      {
        isRW ?
        <BuyForm /> : <ROEthWarning />
      }
    <div>
  )
}
