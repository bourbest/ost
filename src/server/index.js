import {loadContext} from './config/config'
import createServer from './server'
import redirectToHttps from './redirect'

// remove this if running in a production envrionment
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

const context = loadContext()

createServer(context)
  .then (server => {
    console.log('listening on port ' + context.configuration.port)
    const httpServer = redirectToHttps()
    httpServer.listen(80)
  })
  .catch(error => {
    console.log('createServer failed', error)
  })
