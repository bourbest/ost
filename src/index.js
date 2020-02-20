import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './resources/custom.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import configureStore from './modules/store'
import rootSaga from './modules/root-saga'
import {getService} from './modules/app/selectors'
import {ActionCreators as AppActions} from './modules/app/actions'
import {ActionCreators as AuthActions} from './modules/authentication/actions'
const store = configureStore()
store.runSaga(rootSaga)

// resume session
let readyPromise = null
if (window.location.href.endsWith('/login') === false) {
  const authSvc = getService(store.getState(), 'auth')
  readyPromise = authSvc.resume()
    .then(result => {
      if (result.user === null) {
        window.location.replace('/login')
      } else {
        store.dispatch(AppActions.setCsrfToken(result.csrfToken))
        store.dispatch(AuthActions.setUser(result.user))
        store.dispatch(AppActions.refreshStore())
      }
    })
} else {
  readyPromise = Promise.resolve()
}

readyPromise.then( function () {
  ReactDOM.render((
    <Provider store={store}>
      <App />
    </Provider>
  ), document.getElementById('root'))
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
