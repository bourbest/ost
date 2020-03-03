import {filter} from 'lodash'
import { Actions } from './actions'
const initialState = {
  characterInfo: {},
  invoiceClaims: [],
  perks: []
}

const characterReducer = (state = initialState, action = {}) => {
  const newState = {...state}
  switch (action.type) {
    case Actions.SET_CHARACTER:
      newState.characterInfo = {...action.character}
      return newState

    case Actions.SET_CLAIMS:
      newState.invoiceClaims = action.claims
      return newState

    case Actions.ADD_LOCAL_CLAIM:
      newState.invoiceClaims = [...newState.invoiceClaims, action.claim]
      return newState

    case Actions.SET_PERKS:
      newState.perks = action.perks
      return newState

    case Actions.ADD_LOCAL_PERK:
      newState.perks = [...newState.perks, action.perk]
      return newState

    case Actions.REMOVE_LOCAL_PERK:
      newState.perks = filter(newState.perks, charPerk => charPerk.id !== action.characterPerkId)
      return newState

    case Actions.APPLY_SCROLL_EFFECT:
      const updatedChar = {...newState.characterInfo}
      updatedChar.xp += action.scroll.xp
      updatedChar.availableGold += action.scroll.gold
      updatedChar.lifetimeEarnGold += action.scroll.gold
      newState.characterInfo = updatedChar
      return newState

    default:
      return state
  }
}

export default characterReducer
