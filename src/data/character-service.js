export default class CharacterService {
  constructor (apiClient) {
    this.apiClient = apiClient
    this.getMyCharacter = this.getMyCharacter.bind(this)
    this.createInvoiceClaim = this.createInvoiceClaim.bind(this)
    this.getMyClaims = this.getMyClaims.bind(this)
  }

  getMyCharacter () {
    return this.apiClient.get('my-character')
  }

  getMyClaims () {
    return this.apiClient.get('my-character/claims')
  }

  createInvoiceClaim (claim) {
    return this.apiClient.post('xp/invoice-claim', claim)
  }
}
