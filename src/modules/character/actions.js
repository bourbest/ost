import { createActions } from '../common/actions'

const prefix = 'CHARACTER'

export const Actions = createActions(prefix, [
  'LOAD_CHARACTER',
  'SET_CHARACTER',
  'SET_CLAIMS',
  'ADD_INVOICE',
  'USE_SCROLL',
  
])

export const ActionCreators = {
  loadMyCharacter: () => ({type: Actions.LOAD_CHARACTER}),
  setCharacter: (character) => ({type: Actions.SET_CHARACTER, character}),
  setClaims: (claims) => ({type: Actions.SET_CLAIMS, claims}),
  addInvoice: (invoice, cb) => ({type: Actions.ADD_INVOICE, invoice, cb}),
  useScroll: (scroll, cb) => ({type: Actions.USE_SCROLL, scroll, cb}),
  
}
