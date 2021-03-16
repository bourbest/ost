import {validateClaim, CLAIM_DENIAL_REASONS} from '../invoice-claim'

const BASE_INVOICE = {
  time: '05:00:00',
  date: new Date('2020-02-16T00:00:00.000Z'),
  id: '259192-1',
  subTotal: parseFloat('22.95'),
  total: parseFloat('26.39'),
  server: 'Astrid',
  paymentMethod: 'ARGENT',
  items: [
    {item: 'BRUNCH COMPLET', qty: 1.0}
  ]
}

const TODAY = new Date(new Date().toISOString().slice(0, 10));
const YESTERDAY = new Date(TODAY)
YESTERDAY.setDate(TODAY.getDate() - 1)

describe('validateClaim', () => {
  it('denies if invoice not found and youngestDate > claim.invoiceDate', () => {
    const claim = {
      invoiceId: 'aaa',
      invoiceEffectiveDate: YESTERDAY,
      invoiceDate: YESTERDAY
    }
    // test
    const ret = validateClaim({}, claim, TODAY, [])

    // assert
    expect(ret).toEqual(false)
    expect(claim.status).toEqual('denied')
    expect(claim.reason).toEqual(CLAIM_DENIAL_REASONS.notFound)
  })

  it('doesnt change claim if invoice not found and youngestDate < claim.invoiceDate', () => {
    const claim = {
      invoiceId: 'aaa',
      invoiceEffectiveDate: TODAY,
      invoiceDate: TODAY,
      status: 'pending'
    }
    // test
    const ret = validateClaim({}, claim, YESTERDAY, [])

    // assert
    expect(ret).toEqual(false)
    expect(claim.status).toEqual('pending')
    expect(claim.reason).toBeUndefined()
  })

  it('denies claim when user has already claimed 2 invoices on that same day', () => {
    const claim = {
      invoiceId: 'aaa',
      invoiceEffectiveDate: YESTERDAY,
      invoiceDate: YESTERDAY,
      status: 'pending'
    }
    const invoice1 = {...BASE_INVOICE}
    const invoice2 = {...BASE_INVOICE}
    // test
    const ret = validateClaim({}, claim, TODAY, [invoice1, invoice2])

    // assert
    expect(ret).toEqual(false)
    expect(claim.status).toEqual('denied')
    expect(claim.reason).toEqual(CLAIM_DENIAL_REASONS.limitReached)
  })

  it('denies claim when invoice date does not match the claim date', () => {
    const claim = {
      invoiceId: 'aaa',
      invoiceDate: YESTERDAY,
      invoiceTime: '05:20',
      status: 'pending'
    }
    const invoice1 = {...BASE_INVOICE}
    const claimedInvoice = {
      ...BASE_INVOICE,
      id: claim.invoiceId,
      date: TODAY,
      time: '05:20'
    }
    const invoicesById = {
      [claimedInvoice.id]: claimedInvoice
    }
    // test
    const ret = validateClaim(invoicesById, claim, TODAY, [invoice1])

    // assert
    expect(ret).toEqual(false)
    expect(claim.status).toEqual('denied')
    expect(claim.reason).toEqual(CLAIM_DENIAL_REASONS.infoMismatch)
  })

  it('denies claim when invoice time does not match the claim time', () => {
    const claim = {
      invoiceId: 'aaa',
      invoiceTime: '05:20',
      invoiceDate: YESTERDAY,
      status: 'pending'
    }
    const invoice1 = {...BASE_INVOICE}
    const claimedInvoice = {
      ...BASE_INVOICE,
      id: claim.invoiceId,
      date: YESTERDAY,
      time: '05:21'
    }
    const invoicesById = {
      [claimedInvoice.id]: claimedInvoice
    }
    // test
    const ret = validateClaim(invoicesById, claim, TODAY, [invoice1])

    // assert
    expect(ret).toEqual(false)
    expect(claim.status).toEqual('denied')
    expect(claim.reason).toEqual(CLAIM_DENIAL_REASONS.infoMismatch)
  })

  it('denies claim when invoice already claimed by another user', () => {
    const claim = {
      invoiceId: 'aaa',
      invoiceTime: '05:20',
      invoiceDate: YESTERDAY,
      status: 'pending',
      ownerId: 'user1'
    }
    const invoice1 = {...BASE_INVOICE}
    const claimedInvoice = {
      ...BASE_INVOICE,
      id: claim.invoiceId,
      date: YESTERDAY,
      time: '05:20',
      claimedBy: 'user2'
    }
    const invoicesById = {
      [claimedInvoice.id]: claimedInvoice
    }
    // test
    const ret = validateClaim(invoicesById, claim, TODAY, [invoice1])

    // assert
    expect(ret).toEqual(false)
    expect(claim.status).toEqual('denied')
    expect(claim.reason).toEqual(CLAIM_DENIAL_REASONS.alreadyClaimed)
  })

  it('denies claim when invoice already claimed by user', () => {
    const claim = {
      invoiceId: 'aaa',
      invoiceTime: '05:20',
      invoiceDate: YESTERDAY,
      status: 'pending',
      ownerId: 'user1'
    }
    const invoice1 = {...BASE_INVOICE}
    const claimedInvoice = {
      ...BASE_INVOICE,
      id: claim.invoiceId,
      date: YESTERDAY,
      time: '05:20',
      claimedBy: 'user1'
    }
    const invoicesById = {
      [claimedInvoice.id]: claimedInvoice
    }
    // test
    const ret = validateClaim(invoicesById, claim, TODAY, [invoice1])

    // assert
    expect(ret).toEqual(false)
    expect(claim.status).toEqual('denied')
    expect(claim.reason).toEqual(CLAIM_DENIAL_REASONS.alreadyClaimedByUser)
  })

  it('approves claim when all info match and invoice was not claimed', () => {
    const claim = {
      invoiceId: 'aaa',
      invoiceTime: '05:20',
      invoiceDate: YESTERDAY,
      status: 'pending',
      ownerId: 'user1'
    }
    const invoice1 = {...BASE_INVOICE}
    const claimedInvoice = {
      ...BASE_INVOICE,
      id: claim.invoiceId,
      date: new Date(YESTERDAY),
      time: '05:20',
      claimedBy: null
    }
    const invoicesById = {
      [claimedInvoice.id]: claimedInvoice
    }
    // test
    const ret = validateClaim(invoicesById, claim, new Date(TODAY), [invoice1])

    // assert
    expect(ret).toEqual(true)
    expect(claim.status).toEqual('approved')
    expect(claimedInvoice.claimedBy).toEqual(claim.ownerId)
    expect(claim.reason).toBeUndefined()
  })
})