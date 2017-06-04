import React from 'react'
import { connect } from 'react-redux'

import Notifications from 'react-notification-system-redux'

const NNotifications = props => {
  const notifications = props.notifications
  const style = {}
  return (
    <Notifications
      notifications={notifications}
      style={style} />
  )
}

const mapStateToProps = state => {
  return {
    notifications: state.notifications,
  }
}

export default connect(mapStateToProps)(NNotifications)
