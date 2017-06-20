import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'

class ScrollToTopRoute extends Component {
  componentDidUpdate(prevProps) {
    if ((!this.props.path || this.props.path === this.props.location.pathname)
      && this.props.location.pathname !== prevProps.location.pathname) {
      console.log(true, this.props)
      window.scrollTo(0, 0)
    } else console.log(false, this.props)

  }

  render() {
    const { component: Component, ...rest } = this.props;
    return <Route {...rest} render={props => (<Component {...props} />)} />
  }
}

export default withRouter(ScrollToTopRoute)
