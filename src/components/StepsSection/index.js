import React from 'react'

import craftSrc from '../../../images/craft.png'
import placeSrc from '../../../images/place.png'
import baskSrc from '../../../images/bask.png'

const StepsSection = props => {
  return (
    <div className='steps-section section is-large'>
      <div className='columns has-text-centered'>
        <div className='column is-4'>
          <div className='level'>
          <div className='level-item'>
          <figure className='image is-128x128'>
            <img height='128px' src={craftSrc} />
          </figure>
          </div>
          </div>
          <div className='heading'>
            Craft Your Message
          </div>
        </div>
        <div className='column is-4'>
          <div className='level'>
          <div className='level-item'>
          <figure className='image is-128x128'>
            <img height='128px' src={placeSrc} />
          </figure>
          </div>
          </div>
          <div className='heading'>
            Place Your Bid
          </div>
        </div>
        <div className='column is-4'>
          <div className='level'>
          <div className='level-item'>
          <figure className='image is-128x128'>
            <img height='128px' src={baskSrc} />
          </figure>
          </div>
          </div>
          <div className='heading'>
            Soak Up Your Victory
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepsSection
