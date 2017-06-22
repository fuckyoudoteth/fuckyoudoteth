import 'babel-polyfill'
import 'blockies'
import React from 'react'
import { render } from 'react-dom'
import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createHashHistory from 'history/createHashHistory'
import {
  routerMiddleware as reactRouterMiddleware,
  routerReducer
} from 'react-router-redux'

import { createLogger } from "redux-logger"

import { reducer as notifications } from 'react-notification-system-redux'

import 'bulma'
import './styles.css'

import constants from '../constants'

import reducer from './reducer'
import sagas from './sagas'
import { SET_AUCTION_TIME_REMAINING } from './actions'

import App from './components/App'

const history = createHashHistory()

const middlewares = []

const sagaMiddleware = createSagaMiddleware()
const routerMiddleware = reactRouterMiddleware(history)

middlewares.push(sagaMiddleware, routerMiddleware)

if(process.env.NODE_ENV !== "production") {
  middlewares.push(
    createLogger({
      predicate: (getState, action) => action.type !== SET_AUCTION_TIME_REMAINING
    })
  )
}

let store = createStore(combineReducers({
  site: reducer,
  router: routerReducer,
  notifications,
}), //compose(
  applyMiddleware(...middlewares) //,
  //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
) //)

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    sagaMiddleware.run(sagas, constants, store)
  }
}

render(<App store={store} history={history} />, document.getElementById('app'))
