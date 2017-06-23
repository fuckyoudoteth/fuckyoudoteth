import React from 'react'
import { connect } from 'react-redux'

import { getAuctionNumber } from '../../selectors'

import AuctionHero from '../AuctionHero'
import CallToAuction from '../CallToAuction'
import StepsSection from '../StepsSection'
import Footer from '../Footer'

const LandingPage = props => {
  return (
    <div>
      <AuctionHero {...props} />
      <CallToAuction />
      <StepsSection />
      <Footer />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    auctionNumber: getAuctionNumber(state) - 1,
  }
}
export default connect(mapStateToProps)(LandingPage)
