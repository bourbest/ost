import { createActions } from '../common/actions'

const prefix = 'APP'

const actions = [
  'SET_API_CONFIG',
  'SET_CSRF_TOKEN',
  'NOTIFY',
  'SET_SUBMIT',
  'REFRESH_STORE',
  'SET_LOADING'
]

export const Actions = createActions(prefix, actions)

export const ActionCreators = {
  setApiConfig: (config) => ({type: Actions.SET_API_CONFIG, config}),
  setCsrfToken: (token) => ({type: Actions.SET_CSRF_TOKEN, token}),
  notify: (title, message, params = {}, isError = false) => ({type: Actions.NOTIFY, title, message, params, isError}),
  startSubmit: (form) => ({type: Actions.SET_SUBMIT, form, value: true}),
  stopSubmit: (form, err) => ({type: Actions.SET_SUBMIT, form, value: false, err}),
  refreshStore: () => ({type: Actions.REFRESH_STORE}),
  setLoading: (entityName, value) => ({type: Actions.SET_LOADING, entityName, value})
}
