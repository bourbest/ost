import request from 'supertest'
import {connectDatabase} from '../../repository/test/utils'
import {createApp, getAuthCookie} from './utils'
import { ScrollRepository, CharacterRepository } from '../../repository'
import { EX_INVALID_SCROLL, EX_ALREADY_CONSUMED_BY_USER, EX_CONSUMED_BY_ANOTHER_USER } from '../ScrollController'

let db = null
let client = null
let app = null

// Constants used in tests
const USER_ID = '235'
const AUTH_COOKIE = getAuthCookie(USER_ID)

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
  return db.collection('Scroll').deleteMany({})
})

describe('POST /api/scrolls/:id/use', () => {
  it('returns 401 when not authenticated', async () => {
    const res = await request(app)
      .post('/api/scrolls/548/use')
      .send()
    expect(res.statusCode).toEqual(401)
  })

  it('returns 400 scroll does not exist ', async () => {
    const res = await request(app)
      .post('/api/scrolls/548/use')
      .set('Cookie', AUTH_COOKIE)
      .send()

    expect(res.statusCode).toEqual(EX_INVALID_SCROLL.httpStatus)
    expect(res.body.message).toEqual(EX_INVALID_SCROLL.message)
  })

  it('returns 400 with rigth message when scroll already consumed by user', async () => {
    const scroll = {
      id: '34234',
      ownerId: USER_ID
    }
    const scrollRepo = new ScrollRepository(db)
    await scrollRepo.insert(scroll)

    const res = await request(app)
      .post('/api/scrolls/34234/use')
      .set('Cookie', AUTH_COOKIE)
      .send()
    expect(res.statusCode).toEqual(EX_ALREADY_CONSUMED_BY_USER.httpStatus)
    expect(res.body.message).toEqual(EX_ALREADY_CONSUMED_BY_USER.message)
  })

  
  it('returns 400 with rigth message when scroll consumed by another user', async () => {
    const scroll = {
      id: '1',
      ownerId: 'otherUser'
    }
    const scrollRepo = new ScrollRepository(db)
    await scrollRepo.insert(scroll)

    const res = await request(app)
      .post('/api/scrolls/1/use')
      .set('Cookie', AUTH_COOKIE)
      .send()
    expect(res.statusCode).toEqual(EX_CONSUMED_BY_ANOTHER_USER.httpStatus)
    expect(res.body.message).toEqual(EX_CONSUMED_BY_ANOTHER_USER.message)
  })

  it('returns updated scroll and updates character xp and gold', async () => {
    const scroll = {
      id: '10',
      ownerId: null,
      xp: 100,
      gold: 200
    }

    const character = {
      id: USER_ID,
      availableGold: 300,
      lifetimeEarnedGold: 1000,
      xp: 4
    }

    const scrollRepo = new ScrollRepository(db)
    const charRepo = new CharacterRepository(db)
    await Promise.all([
      scrollRepo.insert(scroll),
      charRepo.insert(character)
    ])

    const res = await request(app)
      .post('/api/scrolls/10/use')
      .set('Cookie', AUTH_COOKIE)
      .send()

    expect(res.statusCode).toEqual(200)

    // ensure scroll updated properly
    const updatedScroll = res.body
    expect(updatedScroll.ownerId).toEqual(USER_ID)
    expect(updatedScroll.usedOn).toBeDefined()

    // ensure character updated properly
    const updatedChar = await charRepo.findById(character.id)
    expect(updatedChar.availableGold).toEqual(500)
    expect(updatedChar.lifetimeEarnedGold).toEqual(1200)
    expect(updatedChar.xp).toEqual(104)
    expect(updatedChar.modifiedOn).toBeDefined()
  })
})