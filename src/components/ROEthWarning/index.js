import React from 'react'

const ROEthWarning = props => {
  return (
    <article className='message is-warning'>
      <div className='message-body'>
        <div className='subtitle'>
          Your Browser does not support Smart Contracts
        </div>
        You can read from the Ethereum blockchain, but in order to interact with it from a browser, download an Ethereum enabled browser like <a href='https://github.com/ethereum/mist/releases' target='_blank'>Mist</a>, <a href='https://ethcore.io/parity.html' target='_blank'>Parity</a> or install the <a href='https://metamask.io/' target='_blank'>Metamask Chrome Extension</a>.
      </div>
    </article>
  )
}

export default ROEthWarning
