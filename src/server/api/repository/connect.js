import {MongoClient} from 'mongodb'
import bluebird from 'bluebird'

export const connectDatabase = (url, dbName) => {
  return MongoClient.connect(url, {promiseLibrary: bluebird, useNewUrlParser: true, useUnifiedTopology: true})
    .then(mongoClient => {
      return mongoClient.db(dbName)
    })
}
