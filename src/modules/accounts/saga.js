import { select, takeEvery, call, put } from 'redux-saga/effects'
import { Actions } from './actions'
import { ActionCreators as AppActions } from '../app/actions'
import {getService} from '../app/selectors'
import { handleError } from '../common/commonHandlers'

function * MyAccountSaga (action) {
  const FORM_NAME = 'account'
  let errorAction = null
  const accountSvc = yield select(getService, 'accounts')
  switch (action.type) {
    case Actions.CREATE_ACCOUNT: 
      try {
        yield put(AppActions.startSubmit(FORM_NAME))
        yield call(accountSvc.save, action.account)

        yield put(AppActions.refreshStore())

        if (action.cb) {
          yield call(action.cb)
        }
      } catch (error) {
        errorAction = handleError(FORM_NAME, error)
      } finally {
        yield put(AppActions.stopSubmit(FORM_NAME))
      }
      break

    case Actions.SUBMIT_CHANGE_PASSWORD:
      try {
        yield put(AppActions.startSubmit(FORM_NAME))
        yield call(accountSvc.changePassword, action.changePasswordForm)

        if (action.cb) {
          yield call(action.cb)
        }
      } catch (error) {
        errorAction = handleError(FORM_NAME, error)
      } finally {
        yield put(AppActions.stopSubmit(FORM_NAME))
      }
      break

    default:
      throw new Error('Unexpected action in MyAccountSaga')
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default takeEvery([
  Actions.SUBMIT_CHANGE_PASSWORD,
  Actions.CREATE_ACCOUNT
], MyAccountSaga)
