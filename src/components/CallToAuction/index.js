import React from 'react'

import { Link } from 'react-router-dom'

const CallToAuction = props => {
  return (
    <section className='section'>
      <div className='level is-centered'>
        <div className='level-item has-text-centered'>
          <p className='title is-4'>Join the next auction</p>
        </div>
        <div className='level-item has-text-centered'>
        <Link className='button is-success'
              to='/bid'>Bid Now</Link>
        </div>
      </div>
    </section>
  )
}

export default CallToAuction
