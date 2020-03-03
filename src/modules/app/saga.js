import { put, takeEvery, all, call, select } from 'redux-saga/effects'
import { ActionCreators as AppActions } from '../app/actions'
import { ActionCreators as CharacterActions } from '../character/actions'
import {getService} from './selectors'
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
        const appSvc = yield select(getService, 'app')

        const [perks] = yield all([
          call(appSvc.getPerks),
          put(AppActions.setLoading('store', true)),
          put(CharacterActions.loadMyCharacter())
        ])

        yield all([
          put(AppActions.setPerks(perks.entities)),
          put(AppActions.setLoading('store', false))
        ])
      } catch (error) {
        errorAction = handleError('store', error)
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
