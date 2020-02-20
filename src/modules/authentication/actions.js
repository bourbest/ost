import { createActions } from '../common/actions'
const prefix = 'AUTH/'

const actions = [
  'LOG_IN',
  'SET_USER',
  'LOG_OUT',
  'RESUME_SESSION'
]

export const Actions = createActions(prefix, actions)

export const ActionCreators = {
  resumeSession: (cb) => ({type: Actions.RESUME_RESSION, cb}),
  loginUser: (username, password, keepLoggedIn, cb) => ({ type: Actions.LOG_IN, username, password, keepLoggedIn, cb }),
  setUser: (user) => ({ type: Actions.SET_USER, user }),
  logoutUser: () => ({ type: Actions.LOG_OUT })
}
