import {MongoClient} from 'mongodb'
import bluebird from 'bluebird'

export const connectDatabase = () => {
  return MongoClient.connect('mongodb://localhost:27017', {promiseLibrary: bluebird, useNewUrlParser: true, useUnifiedTopology: true})
    .then(mongoClient => {
      const db = mongoClient.db('ost-test')
      return [ mongoClient, db]
    })
}