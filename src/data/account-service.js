import {omit} from 'lodash'
import RestService from './base/rest-service'
const url = 'accounts'

export default class AccountService extends RestService {
  constructor (apiClient) {
    super(url, apiClient)
    this.changePassword = this.changePassword.bind(this)
    this.createAccount = this.createAccount.bind(this)
  }

  createAccount (account) {
    const payload = omit(account, 'confirm')
    return this.apiClient.post('accounts', payload)
  }

  changePassword (payload) {
    return this.apiClient.post('my-account/change-password', payload)
  }
}
