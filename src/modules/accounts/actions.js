import { createActions } from '../common/actions'

const prefix = 'ACCOUNT'

export const Actions = createActions(prefix, [
  'CREATE_ACCOUNT',
  'SUBMIT_CHANGE_PASSWORD'
])

export const ActionCreators = {
  createAccount: (account, cb) => ({type: Actions.CREATE_ACCOUNT, account, cb}),
  submitChangePassword: (changePasswordForm, cb) => ({type: Actions.SUBMIT_CHANGE_PASSWORD, changePasswordForm, cb})
}
