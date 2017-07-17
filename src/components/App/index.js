import React from 'react'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import ScrollToTopRoute from '../ScrollToTopRoute'
import Nav from '../Nav'
import Footer from '../Footer'
import Notifications from '../Notifications'
import LandingPage from '../LandingPage'
import HomePage from '../HomePage'
import AboutPage from '../AboutPage'
import BidPage from '../BidPage'
import IcoPage from '../../ico/components/IcoPage'

const LandingApp = props => {
  return (
    <Provider store={props.store}>
      <ConnectedRouter history={props.history}>
        <div className='full-height'>
          <Notifications />
          <Switch>
            <ScrollToTopRoute exact path="/" component={LandingPage} />
            <ScrollToTopRoute component={App} />
          </Switch>
        </div>
      </ConnectedRouter>
    </Provider>
  )
}

const App = props => {
  return (
    <div id='wrapper'>
      <Nav />
      <section id='inner-wrapper' className='section'>
        <div className='container'>
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/bid" component={BidPage} />
          <Route exact path="/ico" component={IcoPage} />
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default LandingApp
