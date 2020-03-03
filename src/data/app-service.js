export default class AppService {
  constructor (apiClient) {
    this.apiClient = apiClient
    this.getPerks = this.getPerks.bind(this)
  }

  getPerks () {
    return this.apiClient.get('/perks')
  }
}
