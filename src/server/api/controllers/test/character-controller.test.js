import request from 'supertest'
import {connectDatabase} from '../../repository/test/utils'
import {createApp, getAuthCookie} from './utils'
import { CharacterRepository } from '../../repository'

let db = null
let client = null
let app = null

// Constants used in tests
const USER_ID = '234'
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
  db.collection('Character').deleteMany({})
})

describe('GET /api/my-character', () => {
  it('should return 401 when not authenticated', async () => {
    const res = await request(app)
      .get('/api/my-character')
      .send()
    expect(res.statusCode).toEqual(401)
  })

  it('should return the users character when authenticated', async () => {
    const charRepo = new CharacterRepository(db)
    const character = {
      id: USER_ID,
      name: 'Thor'
    }
    await charRepo.insert(character)
    const res = await request(app)
      .get('/api/my-character')
      .set('Cookie', AUTH_COOKIE)
      .send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(character)
  })

  it('should return 404 when the user has no character', async () => {
    const charRepo = new CharacterRepository(db)
    const character = {
      id: '342',
      name: 'Thor'
    }
    await charRepo.insert(character)
    const res = await request(app)
      .get('/api/my-character')
      .set('Cookie', AUTH_COOKIE)
      .send()
    expect(res.statusCode).toEqual(404)
  })
})
