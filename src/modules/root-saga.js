import { all } from 'redux-saga/effects'
import appSaga from './app/saga'
import authenticationSaga from './authentication/saga'
import accountSaga from './accounts/saga'
import characterSaga from './character/saga'

export default function * rootSaga () {
  yield all([
    appSaga,
    accountSaga,
    authenticationSaga,
    characterSaga
  ])
}
