import {openDB} from 'idb'

const DB_VERSION = 8

export const RECIPE_STORE = 'recipies'
export const INGREDIENTS_STORE = 'ingredients'

let _db = null
export const getDb = function () { return _db }

export const setupDatabase = function () {
  //check for support
  if (!('indexedDB' in window)) {
    throw new Error('This browser doesn\'t support IndexedDB')
  }

  const dbPromise = openDB('ost', DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (!db.objectStoreNames.contains(INGREDIENTS_STORE)) {
        db.createObjectStore(INGREDIENTS_STORE, {keyPath: 'id'})
      }

      if (!db.objectStoreNames.contains(RECIPE_STORE)) {
        db.createObjectStore(RECIPE_STORE, {keyPath: 'id'})
      }
    }
  })

  return dbPromise.then(db => {
    _db = db
    return db
  })
}