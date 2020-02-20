import {createStore, applyMiddleware, compose} from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './root-reducer'
import { ActionCreators as AppActions } from './app/actions'
const sagaMiddleware = createSagaMiddleware()
const devToolsExtension = typeof window === 'object' && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f

export default (initialState = {}) => {
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(sagaMiddleware),
    devToolsExtension
  ))

  // setup api config
  const apiConfig = {
    baseURL: process.env.REACT_APP_API_URL
  }

  store.dispatch(AppActions.setApiConfig(apiConfig))
  store.runSaga = sagaMiddleware.run
  return store
}