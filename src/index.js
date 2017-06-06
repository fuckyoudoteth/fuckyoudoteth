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

import {reducer as notifications} from 'react-notification-system-redux'

import 'bulma'
import './styles.css'

import constants from '../constants'

import reducer from './reducer'
import sagas from './sagas'

import App from './components/App'

const history = createHashHistory()

const sagaMiddleware = createSagaMiddleware()
const routerMiddleware = reactRouterMiddleware(history)

let store = createStore(combineReducers({
  site: reducer,
  router: routerReducer,
  notifications,
}), //compose(
  applyMiddleware(sagaMiddleware, routerMiddleware) //,
  //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
) //)

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    sagaMiddleware.run(sagas, constants, store)
  }
  if (typeof window.callPhantom === 'function') {
    window.callPhantom({dataz: 'lol'})
  }
}

render(<App store={store} history={history} />, document.getElementById('app'))
