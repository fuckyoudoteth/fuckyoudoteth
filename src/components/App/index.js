import React from 'react'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import Nav from '../Nav'
import Footer from '../Footer'
import Notifications from '../Notifications'
import HomePage from '../HomePage'
import AboutPage from '../AboutPage'
import BidPage from '../BidPage'

const App = props => {
  return (
    <Provider store={props.store}>
      <ConnectedRouter history={props.history}>
        <div id='wrapper'>
          <Notifications />
          <Nav />
          <section id='inner-wrapper' className='section'>
            <div className='container'>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/about" component={AboutPage} />
              <Route exact path="/bid" component={BidPage} />
            </div>
          </section>
          <Footer />
        </div>
      </ConnectedRouter>
    </Provider>
  )
}

export default App
