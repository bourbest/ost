import {connectDatabase} from './utils'
import ScrollRepository from '../ScrollRepository'

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
  return db.collection('Scroll').deleteMany({})
})

describe('ScrollRepository', () => {
  test('assign Scroll to user is not already taken', () => {
    const userId = 'aa'
    const testScroll = {
      id: 'unusedScroll',
      xp: 100,
      gold: 150,
      ownerId: null,
      modifiedOn: null,
      usedOn: null
    }
    const now = new Date()
    const repo = new ScrollRepository(db)
    return repo.insert(testScroll)
      .then( () => {
        return repo.assignScrollToUser(testScroll.id, userId, now)
      })
      .then(scroll => {
        expect(scroll.ownerId).toEqual(userId)
        expect(scroll.usedOn).toEqual(now)
        expect(scroll.modifiedOn).toEqual(null)
      })
  })

  test('does not update Scroll if already used and return null', () => {
    const userId = 'aa'
    const now = new Date()
    const testScroll = {
      id: 'usedScroll',
      xp: 100,
      gold: 150,
      ownerId: 'anotherUser',
      modifiedOn: null,
      usedOn: now
    }

    const repo = new ScrollRepository(db)
    return repo.insert(testScroll)
      .then( () => {
        return repo.assignScrollToUser(testScroll.id, userId, now)
      })
      .then(scroll => {
        expect(scroll).toBeNull()
        return repo.findById(testScroll.id)
      })
      .then(scroll => {
        expect(scroll).toStrictEqual(testScroll)
      })
  })
})