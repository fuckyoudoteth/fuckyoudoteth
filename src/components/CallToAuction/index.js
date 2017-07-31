import React from 'react'

import { Link } from 'react-router-dom'

const CallToAuction = props => {
  return (
    <section className='cta-section section is-large'>
      <div className='level is-centered is-vertical'>
        <div className='level-item has-text-centered'>
          <p className='title'>Join the next auction!</p>
        </div>
        <div className='level-item has-text-centered'>
        <Link className='button is-success is-large'
              to='/bid'>Bid Now</Link>
        </div>
      </div>
    </section>
  )
}

export default CallToAuction
