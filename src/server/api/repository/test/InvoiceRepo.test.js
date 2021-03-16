import {connectDatabase} from './utils'
import InvoiceRepository from '../InvoiceRepository'
import InvoiceClaimRepository from '../InvoiceClaimRepository'

let db = null
let client = null

beforeAll(() => {
  return connectDatabase().then( ([mongoClient, database]) => {
    db = database
    client = mongoClient
  })
})

afterAll(() => {
  if (client) {
    return client.close()
  }
})

beforeEach( () => {
  return Promise.all([
    db.collection('Invoice').deleteMany({}),
    db.collection('InvoiceClaim').deleteMany({})
  ])
})

const NOW = new Date()
const YESTERDAY = new Date()
YESTERDAY.setDate(NOW.getDate() - 1)

describe('InvoiceRepository', () => {
  describe('findYoungestInvoice', () => {
    test('returns the youngest invoice', () => {
      const oldInvoice = {id: 'aa', date: YESTERDAY}
      const youngestInvoice = {id: 'bb', date: NOW}
      const repo = new InvoiceRepository(db)
      return repo.insertMany([oldInvoice, youngestInvoice])
        .then( () => {
          return repo.findYoungestInvoice()
        })
        .then(invoice => {
          expect(invoice.id).toEqual(youngestInvoice.id)
        })
    })
  })
  describe('findInvoicesWithPendingClaims', () => {
    test('returns invoice with pending claims', () => {
      const invoiceWithClaim = {id: 'inv1'}
      const invoiceWithoutClaim = {id: 'inv2'}
      const pendingClaim = {id: 'claim1', invoiceId: invoiceWithClaim.id, status: 'pending'}
      const processedClaim = {id: 'claim2', invoiceId: invoiceWithClaim.id, status: 'processed'}

      const invoiceRepo = new InvoiceRepository(db)
      const claimRepo = new InvoiceClaimRepository(db)
      return Promise.all([
        invoiceRepo.insertMany([invoiceWithClaim, invoiceWithoutClaim]),
        claimRepo.insertMany([pendingClaim, processedClaim])
      ])
      .then( () => {
        return invoiceRepo.findInvoicesWithPendingClaims()
      })
      .then(invoices => {
        expect(invoices.length).toEqual(1)
        expect(invoices[0].id).toEqual(invoiceWithClaim.id)
      })
    })

    test('returns an invoice only once when multiple claims linked to it', () => {
      const invoiceWithClaim = {id: 'inv1'}
      const pendingClaim1 = {id: 'claim1', invoiceId: invoiceWithClaim.id, status: 'pending'}
      const pendingClaim2 = {id: 'claim2', invoiceId: invoiceWithClaim.id, status: 'pending'}

      const invoiceRepo = new InvoiceRepository(db)
      const claimRepo = new InvoiceClaimRepository(db)
      return Promise.all([
        invoiceRepo.insertMany([invoiceWithClaim]),
        claimRepo.insertMany([pendingClaim1, pendingClaim2])
      ])
      .then( () => {
        return invoiceRepo.findInvoicesWithPendingClaims()
      })
      .then(invoices => {
        expect(invoices.length).toEqual(1)
      })
    })
  })

  describe('findUserClaimedInvoicesForDate', () => {
    test('returns invoices claimed by a user for a given date', () => {
      const userInvoice1 = {id: 'inv1'}
      const userInvoice2 = {id: 'inv2'}
      const otherUserInvoice = {id: 'invOtherUser'}
      const userPendingClaimInvoice = {id: 'invPending'}
      const pendingClaim = {id: 'claim1', invoiceId: userPendingClaimInvoice.id, status: 'pending', invoiceDate: YESTERDAY, ownerId: 'user1'}
      const approvedClaim = {id: 'claim2', invoiceId: userInvoice1.id, status: 'approved', invoiceDate: YESTERDAY, ownerId: 'user1'}
      const approvedClaim2 = {id: 'claim3', invoiceId: userInvoice2.id, status: 'approved', invoiceDate: NOW, ownerId: 'user1'}
      const approvedClaim3 = {id: 'claim3', invoiceId: otherUserInvoice.id, status: 'approved', invoiceDate: NOW, ownerId: 'otherUser'}

      const invoiceRepo = new InvoiceRepository(db)
      const claimRepo = new InvoiceClaimRepository(db)
      return Promise.all([
        invoiceRepo.insertMany([userInvoice1, userInvoice2, userPendingClaimInvoice]),
        claimRepo.insertMany([pendingClaim, approvedClaim, approvedClaim2])
      ])
      .then( () => {
        return invoiceRepo.findUserClaimedInvoicesForDate('user1', YESTERDAY)
      })
      .then(invoices => {
        expect(invoices.length).toEqual(1)
        expect(invoices[0].id).toEqual(userInvoice1.id)
      })
    })
  })
})