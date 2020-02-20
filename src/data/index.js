import ApiClient from './base/api-client'
//import RestService from './base/rest-service'

import AuthService from './authentication-service'
import AccountService from './account-service'
import CharacterService from './character-service'

export const createService = (serviceName, apiConfig) => {
  const apiClient = new ApiClient(apiConfig)
  switch (serviceName) {
    case 'auth':
      return new AuthService(apiClient)

    case 'accounts':
      return new AccountService(apiClient)

    case 'character':
      return new CharacterService(apiClient)

    default:
      throw new Error('Invalid service name', serviceName)
  }
}
