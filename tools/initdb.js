const {MongoClient} = require('mongodb')
const {maxBy} = require('lodash')
const fs = require('fs')
const bluebird = require('bluebird')
const createDb = require('./revisions/createdb')

getDbConfig = function () {
  const configPath = './server.config.json'
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  console.log('db config', config.db)
  return config.db
}

getRevision = function (db) {
  const revRepo = db.collection('DbRevision')

  return revRepo.find({}).toArray()
    .then(results => {
      const rev = maxBy(results, '_id')
      if (rev) {
        db.revision = rev._id
      } else {
        db.revision = 0
      }
      console.log('actual revision :', db.revision)
      return db
    })
}

const dbConfig = getDbConfig();

(async () => {
  let client
  await MongoClient.connect(dbConfig.server, {promiseLibrary: bluebird})
    .then(mongoClient => {
      client = mongoClient
      return mongoClient.db(dbConfig.dbName)
    })
    .then(getRevision)
    .then(createDb)
    .then(() => {
      console.log('initdb complete')
    })
    .catch(error => {
      console.log('error encountered', error)
    })
    .finally(() => {
      client.close()
  })
})();
