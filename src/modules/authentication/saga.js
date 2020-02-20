import { call, put, select, takeLatest, all } from 'redux-saga/effects'
import { ActionCreators as AppActions } from '../app/actions'
import { getService } from '../app/selectors'
import {handleError} from '../common/commonHandlers'

import {
  Actions,
  ActionCreators as AuthActionCreators
} from './actions'

function * authSaga (action) {
  const FORM_NAME = 'auth'
  const svc = yield select(getService, 'auth')
  let errorAction = null
  switch (action.type) {
    case Actions.LOG_IN:
      try {
        yield put(AppActions.startSubmit(FORM_NAME))
        const ret = yield call(svc.login, action.username, action.password, action.keepLoggedIn)
  
        yield all([
          put(AppActions.setCsrfToken(ret.csrfToken)),
          put(AuthActionCreators.setUser(ret.user)),
          put(AppActions.refreshStore())
        ])

        if (action.cb) {
          yield call(action.cb)
        }
        yield put(AppActions.stopSubmit(FORM_NAME))
      } catch (error) {
        errorAction = handleError(FORM_NAME, error)
      }
      break

    case Actions.LOG_OUT:
      try {
        yield call(svc.logout)
      } catch (error) {
        console.log('logout error', error)
      } finally {
        yield put(AuthActionCreators.setUser({}))
      }
      break

    case Actions.RESUME_SESSION:
      try {
        yield put(AppActions.startSubmit(FORM_NAME))
        const ret = yield call(svc.resume)
  
        yield all([
          put(AppActions.setCsrfToken(ret.csrfToken)),
          put(AuthActionCreators.setUser(ret.user)),
          put(AppActions.refreshStore())          
        ])

        if (action.cb) {
          yield call(action.cb, ret.user)
        }
      } catch (error) {
        errorAction = handleError(FORM_NAME, error)
      } finally {
        yield put(AppActions.stopSubmit(FORM_NAME))
      }
      break

    default:
      throw new Error('Unsupported trigger action in auth saga', action)
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default takeLatest([
  Actions.LOG_IN,
  Actions.LOG_OUT
], authSaga)
