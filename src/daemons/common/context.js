import fs from 'fs'
import path from 'path'
import {MongoClient} from 'mongodb'
import bluebird from 'bluebird'

export const initializeContext = () => {
  const configPath = path.join('./', 'server.config.json')
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  if (!config) {
    throw new Error(`Could not find configuration file at path '${configPath}'`)
  }

  console.log(`connecting to server ${config.db.server} => ${config.db.dbName}`)
  return MongoClient.connect(config.db.server, {promiseLibrary: bluebird, useNewUrlParser: true, useUnifiedTopology: true})
    .then(mongoClient => {
      console.log('connected to database')
      const context = {
        db: mongoClient.db(config.db.dbName),
        client: mongoClient
      }
      return context
    })
}

export function cleanupContext (context) {
  return context.client.close()
}