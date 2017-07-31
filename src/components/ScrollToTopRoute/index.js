import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'


class ScrollToTopRoute extends Component {
  componentDidUpdate(prevProps) {
    if ((!this.props.path || this.props.path === this.props.location.pathname)
      && this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0)
    }

  }
  render() {
    return <Route {...this.props} />
  }
}

export default withRouter(ScrollToTopRoute)
