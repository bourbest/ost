import { select, takeEvery, call, put, all } from 'redux-saga/effects'
import { Actions, ActionCreators as CharacterActions } from './actions'
import { ActionCreators as AppActions } from '../app/actions'
import {getService} from '../app/selectors'
import { handleError } from '../common/commonHandlers'

function * CharacterSaga (action) {
  const XP_FORM_NAME = 'xp'
  const CHARACTER_FORM_NAME = 'character'
  let errorAction = null
  const charSvc = yield select(getService, 'character')

  switch (action.type) {
    case Actions.LOAD_CHARACTER:
      try {
        const [character, claims] = yield all([
          call(charSvc.getMyCharacter),
          call(charSvc.getMyClaims),
          put(AppActions.setLoading(CHARACTER_FORM_NAME, true))
        ])
        yield all([
          put(CharacterActions.setCharacter(character)),
          put(CharacterActions.setClaims(claims)),
          put(AppActions.setLoading(CHARACTER_FORM_NAME, false))
        ])
      } catch (error) {
        errorAction = handleError(CHARACTER_FORM_NAME, error)
      }
      break
    case Actions.ADD_INVOICE: 
      try {
        yield put(AppActions.startSubmit(XP_FORM_NAME))
        const invoiceResult = yield call(charSvc.createInvoiceClaim, action.invoice)

        if (action.cb) {
          yield call(action.cb, invoiceResult)
        }
      } catch (error) {
        errorAction = handleError(XP_FORM_NAME, error)
      } finally {
        yield put(AppActions.stopSubmit(XP_FORM_NAME))
      }
      break

    case Actions.USE_SCROLL:
      try {
        yield put(AppActions.startSubmit(XP_FORM_NAME))
        const usedScroll = yield call(charSvc.useScroll, action.scroll.id)

        yield put(Actions.applyScrollEffect(usedScroll))
        if (action.cb) {
          yield call(action.cb, usedScroll)
        }
      } catch (error) {
        console.log(error)
        errorAction = handleError(XP_FORM_NAME, error)
      } finally {
        yield put(AppActions.stopSubmit(XP_FORM_NAME))
      }
      break

    default:
      throw new Error('Unexpected action in CharacterSaga')
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default takeEvery([
  Actions.ADD_INVOICE,
  Actions.USE_SCROLL,
  Actions.LOAD_CHARACTER
], CharacterSaga)
