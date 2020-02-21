import express from 'express'
import createApiRouter from '../../apiRouter'
import {COOKIE_NAMES} from '../../../config/const'
import jwt from 'jsonwebtoken'

const authSecret = '98fyv8cynh994cinr0rch87nidaÉdf,sdvc..3234ff'

export function createApp(database) {
  const app = express()
  const context = {}
  context.configuration = {
    secret: authSecret // for jwt user cookie
  }

  app.use('/api', createApiRouter(context, context.configuration, database))
  
  return app
}

export function getAuthCookie (userId) {
  const user = {
    id: userId
  }

  const token = jwt.sign(user, authSecret, {
    expiresIn: '1d'
  })

  return `${COOKIE_NAMES.auth}=${token}`
}

