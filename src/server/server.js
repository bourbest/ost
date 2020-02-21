import express from 'express'
import https from 'https'
import path from 'path'

import createApiRouter from './api/apiRouter'
import {connectDatabase} from './api/repository/connect'

export default function createServer (context) {
  const app = express()

  app.use('/public', express.static(path.join(context.appPath, '/public')))
  
  app.get('/public/favicon.ico', function (req, res) {
    res.status(404).send('Not found')
  })
  
  app.disable('etag')
  app.disable('automatic 304s')

  // create server
  const httpsServer = https.createServer(context.credentials, app);
  
  // Connection url
  const dbConfig = context.configuration.db
  return connectDatabase(dbConfig.server, dbConfig.dbName)
    .then(database => {
      // api related
      app.use('/api', createApiRouter(context, context.configuration, database))
  
      const port = (process.env.NODE_ENV === 'production') ? process.env.PORT : context.configuration.port
      httpsServer.listen(port)
      return httpsServer
    })
}

