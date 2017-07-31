import React from 'react'

import StepsSection from '../StepsSection'

const AboutPage = props => {
  return (
    <div className='content has-text-centered'>
      <h2>Unleash your rage on the world!</h2>
      <p>FuckYou.eth is a daily auction for a front-page fuck you.</p>
      <p>Bid to publish your message of your choice to the world for a full day.</p>
      <p>The winner gets to publish a message of their choice to the world, along with a donation address!</p>
      <StepsSection />
      <div className='bottom-image sassy' />
    </div>
  )
}

export default AboutPage
