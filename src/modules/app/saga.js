import { put, takeEvery, all } from 'redux-saga/effects'
import { ActionCreators as AppActions } from '../app/actions'
import { ActionCreators as CharacterActions } from '../character/actions'

import {handleError} from '../common/commonHandlers'
import { Actions } from './actions'

// import {toastr} from 'react-redux-toastr'
// import i18next from 'i18next'

function * appSaga (action) {
  let errorAction = null
  switch (action.type) {
    case Actions.NOTIFY:
/*      
      const title = i18next.t(action.title, lng)
      const message = i18next.t(action.message, {...action.params, lng})
      if (action.isError) {
        toastr.error(title, message)
      } else {
        toastr.success(title, message)
      }
      */
      break

    case Actions.REFRESH_STORE:
      try {
        yield all([
          put(AppActions.setLoading('store', true)),
          put(CharacterActions.loadMyCharacter())
        ])
        /* const ret = yield call(svc.getMyCharacter)
  
        yield all([
          put(AppActions.setCsrfToken(ret.csrfToken)),
          put(AuthActionCreators.setUser(ret.user))
        ])

        if (action.cb) {
          yield call(action.cb)
        }
        yield put(AppActions.stopSubmit(FORM_NAME))
        */
      } catch (error) {
        errorAction = handleError('store', error)
      } finally {
        yield put(AppActions.setLoading('store', false))
      }
      break

    default:
      throw new Error('Unsupported trigger action in app saga', action)
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default takeEvery([
  Actions.NOTIFY,
  Actions.REFRESH_STORE
], appSaga)
