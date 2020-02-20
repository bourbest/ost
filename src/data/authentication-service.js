const url = 'authenticate'

export default class AuthService {
  constructor (apiClient) {
    this.apiClient = apiClient

    this.resume = this.resume.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  resume () {
    return this.apiClient.get(url)
  }

  login (username, password, keepLoggedIn) {
    const payload = {username, password, keepLoggedIn}
    return this.apiClient.post(url, payload)
  }

  logout () {
    return this.apiClient.delete(url, '')
  }

}

