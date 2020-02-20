import { Actions } from './actions'
const initialState = {
  apiConfig: {
    headers: {
    }
  },
  forms: {},
  loading: {}
}

const appReducer = (state = initialState, action = {}) => {
  const newState = {...state}
  switch (action.type) {
    case Actions.SET_API_CONFIG:
      newState.apiConfig = {...state.apiConfig, ...action.config}
      return newState

    case Actions.SET_CSRF_TOKEN:
      newState.apiConfig.headers['X-CSRF-Token'] = action.token
      return newState

    case Actions.SET_SUBMIT:
      newState.forms = {...newState.forms}
      newState.forms[action.form] = {submitting: action.value, error: action.err}
      return newState

    case Actions.SET_LOADING:
      newState.loading = {...newState.loading}
      newState[action.entityName] = action.value
      return newState

    default:
      return state
  }
}

export default appReducer
