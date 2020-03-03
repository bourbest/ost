import request from 'supertest'
import {connectDatabase} from '../../repository/test/utils'
import {createApp, getAuthCookie} from './utils'
import { PerksRepository, CharacterRepository, CharacterPerksRepository, StaffRepository } from '../../repository'
import {PERK_NOT_FOUND, CANT_BUY_PERK, CHAR_NOT_FOUND, STAFF_NOT_FOUND, CANT_USE_PERK} from '../PerksController'

let db = null
let client = null
let app = null

// Constants used in tests
const USER_ID = '238'
const AUTH_COOKIE = getAuthCookie(USER_ID)
const STAFF_MEMBER = {
  id: 'joe',
  code: 'alpha'
}

beforeAll(() => {
  return connectDatabase()
    .then( ([mongoClient, database]) => {
      db = database
      client = mongoClient
      app = createApp(db)
    })
    .then(() => {
      const staffRepo = new StaffRepository(db)
      return staffRepo.upsert(STAFF_MEMBER)
    })
})

afterAll(() => {
  if (client) {
    client.close()
  }
})

beforeEach( () => {
  return Promise.all([
    db.collection('Perks').deleteMany({}),
    db.collection('CharacterPerks').deleteMany({}),
    db.collection('Character').deleteMany({}),
  ])
})

describe('GET /api/perks', () => {
  it('returns 401 when not authenticated', async () => {
    const res = await request(app)
      .get('/api/my-character')
      .send()
    expect(res.statusCode).toEqual(401)
  })

  it('returns the complete list of perks', async () => {
    const repo = new PerksRepository(db)
    const perks = [{
      id: 'test1'
    }, {
      id: 'test2'
    }]
    await repo.insertMany(perks)
    const res = await request(app)
      .get('/api/perks')
      .set('Cookie', AUTH_COOKIE)
      .send()
    expect(res.statusCode).toEqual(200)
    expect(res.body.entities).toEqual(perks)
  })
})

describe('POST /api/perks/:perkId/buy', () => {
  it('returns 401 when not authenticated', async () => {
    const res = await request(app)
      .post('/api/perks/test1/buy')
      .send()
    expect(res.statusCode).toEqual(401)
  })

  it('returns 404 when character does not exists', async () => {
    const repo = new PerksRepository(db)
    const perks = [{
      id: 'test1'
    }, {
      id: 'test2'
    }]
    await repo.insertMany(perks)
    const res = await request(app)
      .post('/api/perks/test10/buy')
      .set('Cookie', AUTH_COOKIE)
      .send()
    expect(res.statusCode).toEqual(404)
    expect(res.body.message).toEqual(CHAR_NOT_FOUND.message)
  })

  it('returns 404 when perk does not exists', async () => {
    const repo = new PerksRepository(db)
    const charRepo = new CharacterRepository(db)
    const perks = [{
      id: 'test1'
    }, {
      id: 'test2'
    }]

    const character = {
      id: USER_ID,
      xp: 500,
      availableGold: 4000
    }
    await Promise.all([
      repo.insertMany(perks),
      charRepo.insert(character)
    ])

    const res = await request(app)
      .post('/api/perks/test10/buy')
      .set('Cookie', AUTH_COOKIE)
      .send()
    expect(res.statusCode).toEqual(404)
    expect(res.body.message).toEqual(PERK_NOT_FOUND.message)
  })

  it('returns 400 when level too low', async () => {
    const repo = new PerksRepository(db)
    const charRepo = new CharacterRepository(db)
    const perks = [{
      id: 'test1',
      levelRequired: 1,
      cost: 100
    }]

    const character = {
      id: USER_ID,
      xp: 499,
      availableGold: 4000
    }
    await Promise.all([
      repo.insertMany(perks),
      charRepo.insert(character)
    ])

    const res = await request(app)
      .post('/api/perks/test1/buy')
      .set('Cookie', AUTH_COOKIE)
      .send()
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual(CANT_BUY_PERK.message)
  })

  it('returns 400 when not enough gold', async () => {
    const repo = new PerksRepository(db)
    const charRepo = new CharacterRepository(db)
    const perks = [{
      id: 'test1',
      levelRequired: 1,
      cost: 10000
    }]

    const character = {
      id: USER_ID,
      xp: 500,
      availableGold: 4000
    }
    await Promise.all([
      repo.insertMany(perks),
      charRepo.insert(character)
    ])

    const res = await request(app)
      .post('/api/perks/test1/buy')
      .set('Cookie', AUTH_COOKIE)
      .send()
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual(CANT_BUY_PERK.message)
  })

  it('returns 200 with boughtPerk entity when transaction is valid', async () => {
    const repo = new PerksRepository(db)
    const charRepo = new CharacterRepository(db)
    const perks = [{
      id: 'test1',
      levelRequired: 1,
      cost: 100
    }]

    const character = {
      id: USER_ID,
      xp: 500,
      availableGold: 4000
    }
    await Promise.all([
      repo.insertMany(perks),
      charRepo.insert(character)
    ])

    const res = await request(app)
      .post('/api/perks/test1/buy')
      .set('Cookie', AUTH_COOKIE)
      .send()
    expect(res.statusCode).toEqual(200)
    expect(res.body.id).toBeDefined()
    expect(res.body.ownerId).toEqual(USER_ID)
    expect(res.body.cost).toEqual(perks[0].cost)
    expect(res.body.usedOn).toEqual(null)
    expect(res.body.boughtOn).toBeDefined()

    const updatedChar = await charRepo.findById(USER_ID)
    expect(updatedChar.availableGold).toEqual(3900)
  })
})

describe('GET /api/my-character/perks', () => {
  it('returns only unused perks', async () => {
    const repo = new CharacterPerksRepository(db)
    const charPerks = [{
      id: 'unused',
      ownerId: USER_ID,
      usedOn: null,
      perkId: 'test1',
      cost: 100
    }, {
      id: 'used',
      ownerId: USER_ID,
      usedOn: new Date(),
      perkId: 'test1',
      cost: 100
    }, {
      id: 'different owner',
      ownerId: '3243',
      usedOn: null,
      perkId: 'test1',
      cost: 100
    }]

    await repo.insertMany(charPerks)

    const res = await request(app)
      .get('/api/my-character/perks')
      .set('Cookie', AUTH_COOKIE)
      .send()
    expect(res.statusCode).toEqual(200)
    expect(res.body.entities.length).toEqual(1)
    expect(res.body.entities[0]).toEqual(charPerks[0])
  })
})

describe('POST /api/my-character/perks/use', () => {
  it('return 400 when staff code does not exist', async () => {
    const usePerk = {
      characterPerkId: 'sdfsd',
      staffCode: 'aaa'
    }

    const res = await request(app)
      .post('/api/my-character/perks/use')
      .set('Cookie', AUTH_COOKIE)
      .send(usePerk)
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual(STAFF_NOT_FOUND.message)
  })

  it('return 400 when perk already used', async () => {
    const charPerkRepo = new CharacterPerksRepository(db)

    const characterPerk = {
      id: 'my-perk1',
      usedOn: new Date()
    }

    const usePerk = {
      characterPerkId: characterPerk.id,
      staffCode: STAFF_MEMBER.code
    }

    await charPerkRepo.insert(characterPerk)

    const res = await request(app)
      .post('/api/my-character/perks/use')
      .set('Cookie', AUTH_COOKIE)
      .send(usePerk)
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual(CANT_USE_PERK.message)
  })

  it('return 200 when perk was used and set the date and staff id on the characterPerk', async () => {
    const charPerkRepo = new CharacterPerksRepository(db)

    const characterPerk = {
      id: 'my-perk2',
      usedOn: null
    }

    const usePerk = {
      characterPerkId: characterPerk.id,
      staffCode: STAFF_MEMBER.code
    }

    await charPerkRepo.insert(characterPerk)

    const res = await request(app)
      .post('/api/my-character/perks/use')
      .set('Cookie', AUTH_COOKIE)
      .send(usePerk)
    expect(res.statusCode).toEqual(200)
    
    const usedPerk = await charPerkRepo.findById(characterPerk.id)
    expect(usedPerk.usedOn).toBeDefined()
    expect(usedPerk.validatedBy).toEqual(STAFF_MEMBER.id)
  })
})