import express from 'express'
import cookieParser from 'cookie-parser'
import corser from 'corser'
import bodyParser from 'body-parser'

import {mustBeAuthenticated, injectGlobals, logger, checkCsrf, loadUser} from './middlewares'
import {COOKIE_NAMES} from '../config/const'
import registerRoutes from './controllers/routes'

function createApiRouter (context, config, database) {
  const apiRouter = express.Router()

  const globals = {
    database,
    secret: config.secret
  }

  apiRouter.use(corser.create({
    origin: process.env.NODE_ENV === 'production' ? ['chopegobeline.com'] : ['localhost:3000']
  }))
  apiRouter.use(bodyParser.json())
  apiRouter.use(injectGlobals(globals))

  apiRouter.use(cookieParser())
  apiRouter.use(loadUser(context.configuration.secret))
  
  apiRouter.use(injectGlobals(globals))

  // ignore security on those routes
  const ignoredRoutes = [
    '/accounts',
    '/authenticate'
  ]
  // CSRF protection on all non idempotent request
  apiRouter.use(checkCsrf({
    ignoredRoutes,
    cookie: {
      key: COOKIE_NAMES.csrfToken,
      secure: process.env.NODE_ENV === 'production'
    }
  }))

  apiRouter.use(mustBeAuthenticated({
    ignoredRoutes
  }))

  // routes here
  registerRoutes(apiRouter)

  // if no route matches, send 404
  apiRouter.use(function (req, res, next) {
    if (!req.route) {
      return next({httpStatus: 404, message: `route not found ${req.originalUrl}`})
    } else {
      
    }
    next()
  })

  // error handling
  apiRouter.use(function (err, req, res, next) {
    if(process.env.NODE_ENV !== 'test') {
      console.log('error handler', err)
    }
    if (err.httpStatus) {
      res.status(err.httpStatus)
      res.result = {message: err.message, errors: err.errors}
    } else {
      res.status(500)
      res.result = {message: 'Internal server error', stack: err.stack}
    }
    next() 
  })

  // send result
  apiRouter.use(function (req, res, next) {
    if (res.result !== undefined) {
      if (res.result === '') {
        res.send('')
      } else {
        // res.status(200)
        res.json(res.result)
      }
    } else {
      res.send('')
    }
    next()
  })

  // log result to console
  apiRouter.use(logger)

  return apiRouter
}

export default createApiRouter
