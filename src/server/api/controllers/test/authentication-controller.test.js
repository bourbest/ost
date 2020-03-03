import request from 'supertest'
import {connectDatabase} from '../../repository/test/utils'
import {createApp} from './utils'
import { UserAccountRepository, CharacterRepository } from '../../repository'
import {UNAUTH_EX, ACCOUNT_DISABLED_EX} from '../AuthenticationController'

let db = null
let client = null
let app = null

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
  return Promise.all([
    db.collection('UserAccount').deleteMany({}),
    db.collection('Character').deleteMany({})
  ])
})

describe('POST /api/authenticate', () => {
  it('returns 400 when not well formed', async () => {
    const res = await request(app)
      .post('/api/authenticate')
      .send({})
    expect(res.statusCode).toEqual(400)
  })

  it('returns 401 with message when account does not exists', async () => {
    const credentials = {
      username: 'missing@gmail.com',
      password: 'abc'
    }
    const res = await request(app)
      .post('/api/authenticate')
      .send(credentials)

    expect(res.statusCode).toEqual(UNAUTH_EX.httpStatus)
    expect(res.body.message).toEqual(UNAUTH_EX.message)
  })

  it('returns 401 with message when account is deactivated', async () => {
    const account = {
      username: 'deactivated@gmail.com',
      isDisabled: true
    }
    const userRepo = new UserAccountRepository(db)
    await userRepo.insert(account)

    const credentials = {
      username: account.username,
      password: 'test'
    }

    const res = await request(app)
      .post('/api/authenticate')
      .send(credentials)

    expect(res.statusCode).toEqual(ACCOUNT_DISABLED_EX.httpStatus)
    expect(res.body.message).toEqual(ACCOUNT_DISABLED_EX.message)
  })

  it('returns 401 when password does not match', async () => {
    const account = {
      username: 'joe@gmail.com',
      password: 'test',
      confirm: 'test',
      name: 'joe'
    }

    await request(app).post('/accounts').send(account)

    const credentials = {
      username: account.username,
      password: 'whatever'
    }

    const res = await request(app)
      .post('/api/authenticate')
      .send(credentials)
    expect(res.statusCode).toEqual(UNAUTH_EX.httpStatus)
    expect(res.body.message).toEqual(UNAUTH_EX.message)
  })

  it('returns the user without its passwordHash', async () => {
    const account = {
      username: 'joe2@gmail.com',
      password: 'test',
      confirm: 'test',
      name: 'joe'
    }

    await request(app).post('/api/accounts').send(account)
    const credentials = {
      username: account.username,
      password: account.password
    }

    const res = await request(app)
      .post('/api/authenticate')
      .send(credentials)
    expect(res.statusCode).toEqual(200)
    expect(res.body.passwordHash).toBeUndefined()
  })
})
