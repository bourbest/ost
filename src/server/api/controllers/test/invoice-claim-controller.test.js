import request from 'supertest'
import {connectDatabase} from '../../repository/test/utils'
import {createApp, getAuthCookie} from './utils'
import { InvoiceClaimRepository } from '../../repository'

let db = null
let client = null
let app = null

// Constants used in tests
const USER_ID = '234'
const AUTH_COOKIE = getAuthCookie(USER_ID)

const A_WELL_FORMED_CLAIM = {
  invoiceId: 6546,
  invoiceDate: '2019-08-08T00:00:00.000Z',
  invoiceTime: '5:19'
}

beforeAll(() => {
  return connectDatabase().then( ([mongoClient, database]) => {
    db = database
    client = mongoClient
    app = createApp(db)
  })
})

afterAll(() => {
  if (client) {
    client.close()
  }
})

beforeEach( () => {
  return db.collection('InvoiceClaim').deleteMany({})
})

describe('GET /api/my-character/claims', () => {
  it('should return 401 when not authenticated', async () => {
    const res = await request(app)
      .get('/api/my-character/claims')
      .send()
    expect(res.statusCode).toEqual(401)
  })

  it('should return ONLY the character s claims when authenticated', async () => {
    const claimRepo = new InvoiceClaimRepository(db)
    // insert two claims that should be returned
    const expectedClaims = [
      {id: '1', ownerId: USER_ID},
      {id: '2', ownerId: USER_ID}
    ]
    const missingClaim = {id: '3', ownerId: 'hide'}
    const allClaims = [...expectedClaims, missingClaim]
    await claimRepo.insertMany(allClaims)

    const res = await request(app)
      .get('/api/my-character/claims')
      .set('Cookie', AUTH_COOKIE)
      .send()
    expect(res.statusCode).toEqual(200)
    expect(res.body.entities).toEqual(expectedClaims)
  })
})

describe('POST /api/invoice-claims', () => {
  it('should return 401 when not authenticated', async () => {
    const res = await request(app)
      .post('/api/invoice-claims')
      .send(A_WELL_FORMED_CLAIM)
    expect(res.statusCode).toEqual(401)
  })

  it('returns 400 when invalid claim', async () => {
    const invalidClaim = {}
    const res = await request(app)
      .post('/api/invoice-claims')
      .set('Cookie', AUTH_COOKIE)
      .send(invalidClaim)
    expect(res.statusCode).toEqual(400)
  })

  it('returns the created claim when authenticated and claim is valid', async () => {
    const res = await request(app)
      .post('/api/invoice-claims')
      .set('Cookie', AUTH_COOKIE)
      .send(A_WELL_FORMED_CLAIM)
    expect(res.statusCode).toEqual(200)
    expect(res.body.id).toBeDefined()
    expect(res.body.modifiedOn).toBeDefined()
    expect(res.body.createdOn).toEqual(res.body.modifiedOn)
    expect(res.body).toMatchObject(A_WELL_FORMED_CLAIM)
    expect(res.body.ownerId).toEqual(USER_ID)
    expect(res.body.status).toEqual('pending')
  })
})
