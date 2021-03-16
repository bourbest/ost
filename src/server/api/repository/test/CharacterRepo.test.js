import {connectDatabase} from './utils'
import CharacterRepository from '../CharacterRepository'

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
  return db.collection('Character').deleteMany({})
})

describe('CharacterRepository', () => {
  test('addXpAndGold updates the gold and xp of the character', () => {
    const testChar = {
      id: 'aa',
      xp: 0,
      availableGold: 0,
      lifetimeEarnedGold: 100,
      modifiedOn: null
    }
    const now = new Date()
    const repo = new CharacterRepository(db)
    return repo.insert(testChar)
      .then( () => {
        return repo.addXpAndGold(testChar.id, 50, 100, now)
      })
      .then(character => {
        expect(character.xp).toEqual(50)
        expect(character.availableGold).toEqual(100)
        expect(character.lifetimeEarnedGold).toEqual(200)
        expect(character.modifiedOn).toEqual(now)
      })
  })
})