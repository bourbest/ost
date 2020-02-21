import { Actions } from './actions'
const initialState = {
  characterInfo: {},
  invoiceClaims: [],
  availableTalents: []
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

    case Actions.APPLY_SCROLL_EFFECT:
      const updatedChar = {...newState.characterInfo}
      updatedChar.xp += action.scroll.xp
      updatedChar.availableGold += action.scroll.gold
      updatedChar.lifetimeEarnedGold += action.scroll.gold
      newState.characterInfo = updatedChar
      return newState

    default:
      return state
  }
}

export default characterReducer
