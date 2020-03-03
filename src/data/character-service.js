export default class CharacterService {
  constructor (apiClient) {
    this.apiClient = apiClient
    this.getMyCharacter = this.getMyCharacter.bind(this)
    this.createInvoiceClaim = this.createInvoiceClaim.bind(this)
    this.getMyClaims = this.getMyClaims.bind(this)
    this.getMyPerks = this.getMyPerks.bind(this)
    this.useScroll = this.useScroll.bind(this)
    this.buyPerk = this.buyPerk.bind(this)
    this.usePerk = this.usePerk.bind(this)
  }

  getMyCharacter () {
    return this.apiClient.get('my-character')
  }

  getMyClaims () {
    return this.apiClient.get('my-character/claims')
  }

  createInvoiceClaim (claim) {
    return this.apiClient.post('invoice-claims', claim)
  }

  useScroll (scrollId) {
    const id = encodeURIComponent(scrollId)
    return this.apiClient.post(`scrolls/${id}/use`, '')
  }

  getMyPerks () {
    return this.apiClient.get('my-character/perks')
  }

  buyPerk (perkId) {
    return this.apiClient.post(`/perks/${perkId}/buy`)
  }

  usePerk (characterPerkId, staffCode) {
    const payload = {
      characterPerkId,
      staffCode
    }
    return this.apiClient.post(`/my-character/perks/use`, payload)
  }
}
