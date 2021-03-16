import { createActions } from '../common/actions'

const prefix = 'CHARACTER'

export const Actions = createActions(prefix, [
  'LOAD_CHARACTER', // saga
  'SET_CHARACTER',

  'SET_CLAIMS',
  'CREATE_REMOTE_CLAIM', // saga
  'ADD_LOCAL_CLAIM',
  'REFRESH_CLAIMS', // saga

  'BUY_PERK', // saga
  'SET_PERKS',
  'ADD_LOCAL_PERK',
  'USE_PERK', // saga
  'REMOVE_LOCAL_PERK',

  'USE_SCROLL', // saga
  'APPLY_SCROLL_EFFECT'
])

export const ActionCreators = {
  loadMyCharacter: () => ({type: Actions.LOAD_CHARACTER}),
  setCharacter: (character) => ({type: Actions.SET_CHARACTER, character}),

  setClaims: (claims) => ({type: Actions.SET_CLAIMS, claims}),
  createClaim: (invoice, cb) => ({type: Actions.CREATE_REMOTE_CLAIM, invoice, cb}),
  addLocalClaim: (claim) => ({type: Actions.ADD_LOCAL_CLAIM, claim}),
  refreshClaims: () => ({type: Actions.REFRESH_CLAIMS}),

  setPerks: (perks) => ({type: Actions.SET_PERKS, perks}),
  buyPerk: (perkId) => ({type: Actions.BUY_PERK, perkId}),
  addLocalPerk: (perk) => ({type: Actions.ADD_LOCAL_PERK, perk}),
  usePerk: (perkId, staffCode, cb) => ({type: Actions.USE_PERK, perkId, staffCode, cb}),
  removeLocalPerk: (characterPerkId) => ({type: Actions.REMOVE_LOCAL_PERK, characterPerkId}),

  useScroll: (scroll, cb) => ({type: Actions.USE_SCROLL, scroll, cb}),
  applyScrollEffect: (scroll) => ({type: Actions.APPLY_SCROLL_EFFECT, scroll})
}
