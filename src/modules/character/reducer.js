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

    default:
      return state
  }
}

export default characterReducer
