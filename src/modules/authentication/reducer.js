import { Actions } from './actions'

const initialState = {
  user: null
}

const authenticationReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case Actions.SET_USER:
      return {...state, user: action.user, authenticating: false}

    default:
      return state
  }
}

export default authenticationReducer
