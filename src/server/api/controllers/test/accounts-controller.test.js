import request from 'supertest'
import {connectDatabase} from '../../repository/test/utils'
import {createApp} from './utils'
import { UserAccountRepository, CharacterRepository } from '../../repository'
import {USERNAME_MUST_BE_UNIQUE} from '../AccountsController'

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
  db.collection('UserAccount').deleteMany({})
  db.collection('Character').deleteMany({})
})

describe('POST /accounts', () => {
  it('should return 400 when not well formed', async () => {
    const res = await request(app)
      .post('/api/accounts')
      .send({})
    expect(res.statusCode).toEqual(400)
  })

  it('return 400 with message when email is already in use', async () => {
    const accountRepo = new UserAccountRepository(db)
    // insert two claims that should be returned
    const existingAccount = {
      username: 'test@hotmail.com'
    }
    await accountRepo.insert(existingAccount)

    const wellFormedAccount ={
      username: existingAccount.username,
      password: 'abcd',
      confirm: 'abcd',
      name: 'test'
    }

    const res = await request(app)
      .post('/api/accounts')
      .send(wellFormedAccount)
    expect(res.statusCode).toEqual(USERNAME_MUST_BE_UNIQUE.httpStatus)
    expect(res.body.message).toEqual(USERNAME_MUST_BE_UNIQUE.message)
  })

  it('sets up the account and creates the character', async () => {
    const charRepo = new CharacterRepository(db)
    const wellFormedAccount ={
      username: 'test2@gmail.com',
      password: 'abcd',
      confirm: 'abcd',
      name: 'test'
    }

    const expectedChar = {
      name: wellFormedAccount.name,
      availableGold: 0,
      lifetimeEarnedGold: 0,
      level: 1,
      xp: 0
    }

    const res = await request(app)
      .post('/api/accounts')
      .send(wellFormedAccount)

    expect(res.statusCode).toEqual(200)
    expect(res.body.id).toBeDefined()
    expect(res.body.modifiedOn).toBeDefined()
    expect(res.body.createdOn).toEqual(res.body.modifiedOn)
    expect(res.body.password).toBeUndefined()
    expect(res.body.passwordHash).toBeUndefined()
    expect(res.body.confirm).toBeUndefined()

    const character = await charRepo.findById(res.body.id)
    expect(character).toMatchObject(expectedChar)
  })
})
