import { createActions } from '../common/actions'

const prefix = 'CHARACTER'

export const Actions = createActions(prefix, [
  'LOAD_CHARACTER', // saga
  'SET_CHARACTER',
  'SET_CLAIMS',
  'ADD_INVOICE', // saga
  'USE_SCROLL', // saga
  'APPLY_SCROLL_EFFECT'
])

export const ActionCreators = {
  loadMyCharacter: () => ({type: Actions.LOAD_CHARACTER}),
  setCharacter: (character) => ({type: Actions.SET_CHARACTER, character}),
  setClaims: (claims) => ({type: Actions.SET_CLAIMS, claims}),
  addInvoice: (invoice, cb) => ({type: Actions.ADD_INVOICE, invoice, cb}),
  useScroll: (scroll, cb) => ({type: Actions.USE_SCROLL, scroll, cb}),
  applyScrollEffect: (scroll) => ({type: Actions.APPLY_SCROLL_EFFECT, scroll})
}
