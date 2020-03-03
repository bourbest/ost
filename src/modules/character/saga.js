import {find} from 'lodash'
import { select, takeEvery, call, put, all } from 'redux-saga/effects'
import { Actions, ActionCreators as CharacterActions } from './actions'
import { ActionCreators as AppActions } from '../app/actions'
import { getMyPerks, XP_FORM_NAME, CHARACTER_FORM_NAME, USE_PERK_FORM_NAME } from './selectors'
import {getService} from '../app/selectors'
import { handleError } from '../common/commonHandlers'

function * CharacterSaga (action) {
  let errorAction = null
  const charSvc = yield select(getService, 'character')

  switch (action.type) {
    case Actions.LOAD_CHARACTER:
      try {
        const [character, claims, perks] = yield all([
          call(charSvc.getMyCharacter),
          call(charSvc.getMyClaims),
          call(charSvc.getMyPerks),
          put(AppActions.setLoading(CHARACTER_FORM_NAME, true))
        ])
        yield all([
          put(CharacterActions.setCharacter(character)),
          put(CharacterActions.setClaims(claims.entities)),
          put(CharacterActions.setPerks(perks.entities)),
          put(AppActions.setLoading(CHARACTER_FORM_NAME, false))
        ])
      } catch (error) {
        errorAction = handleError(CHARACTER_FORM_NAME, error)
      }
      break

    case Actions.CREATE_REMOTE_CLAIM: 
      try {
        yield put(AppActions.startSubmit(XP_FORM_NAME))
        const newInvoiceClaim = yield call(charSvc.createInvoiceClaim, action.invoice)

        yield put(CharacterActions.addLocalClaim(newInvoiceClaim))

        if (action.cb) {
          yield call(action.cb, newInvoiceClaim)
        }
      } catch (error) {
        errorAction = handleError(XP_FORM_NAME, error)
      } finally {
        yield put(AppActions.stopSubmit(XP_FORM_NAME))
      }
      break

    case Actions.BUY_PERK:
      const boughtPerk = yield call(charSvc.buyPerk, action.perkId)
      yield put(CharacterActions.addLocalPerk(boughtPerk))
      break

    case Actions.USE_SCROLL:
      try {
        yield put(AppActions.startSubmit(XP_FORM_NAME))
        const usedScroll = yield call(charSvc.useScroll, action.scroll.id)

        yield put(CharacterActions.applyScrollEffect(usedScroll))
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

    case Actions.USE_PERK:
      try {
        const [myPerks] = yield all([
          select(getMyPerks),
          put(AppActions.startSubmit(USE_PERK_FORM_NAME))
        ])

        const perkToUse = find(myPerks, {perkId: action.perkId})
        yield call(charSvc.usePerk, perkToUse.id, action.staffCode)

        yield put(CharacterActions.removeLocalPerk(perkToUse.id))
        if (action.cb) {
          yield call(action.cb)
        }
      } catch (error) {
        console.log(error)
        errorAction = handleError(USE_PERK_FORM_NAME, error)
      } finally {
        yield put(AppActions.stopSubmit(USE_PERK_FORM_NAME))
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
  Actions.CREATE_REMOTE_CLAIM,
  Actions.USE_SCROLL,
  Actions.LOAD_CHARACTER,
  Actions.USE_PERK,
  Actions.BUY_PERK
], CharacterSaga)
