import Cookie from 'cookie'
import {sign} from 'cookie-signature'
import Tokens from 'csrf'

export default function checkCsrf (options) {
  const opts = options || {}

  const cookieOptions = getCookieOptions(opts.cookie)
  const getTokenFromRequest = opts.getValue || defaultGetValue
  const tokens = new Tokens(opts)
  const ignoreMethod = getIgnoredMethods(['GET', 'HEAD', 'OPTIONS'])
  const ignoredRoutes = getIgnoredRoutes(opts.ignoredRoutes)

  const generateToken = function (req, res) {
    const secret = tokens.secretSync()
    setSecret(req, res, secret, cookieOptions)
  
    const token = tokens.create(secret)
    return token
  }

  return function (req, res, next) {
    // add this service to the request object so other routes / middleware can generate tokens
    req.csrf = {generateToken}

    // verify the incoming token
    if (!ignoreMethod[req.method] && !ignoredRoutes[req.path]) {
      const secret = getSecret(req, cookieOptions)
      const token = getTokenFromRequest(req)
  
      if (tokens.verify(secret, token) === false) {
        return next({httpStatus: 403, error: 'Invalid csrf token'})
      }
    }
    next()
  }
}

/**
 * Default value function, checking the `req.body`
 * and `req.query` for the CSRF token.
 *
 * @param {IncomingMessage} req
 * @return {String}
 * @api private
 */

function defaultGetValue (req) {
  return (req.body && req.body._csrf) ||
    (req.query && req.query._csrf) ||
    (req.headers['csrf-token']) ||
    (req.headers['xsrf-token']) ||
    (req.headers['x-csrf-token']) ||
    (req.headers['x-xsrf-token'])
}

/**
 * Get options for cookie.
 *
 * @param {boolean|object} [options]
 * @returns {object}
 * @api private
 */

function getCookieOptions (options) {
  var opts = {
    key: '_csrf',
    path: '/'
  }

  if (options && typeof options === 'object') {
    for (var prop in options) {
      var val = options[prop]

      if (val !== undefined) {
        opts[prop] = val
      }
    }
  }

  return opts
}

/**
 * Get a lookup of ignored methods.
 *
 * @param {array} methods
 * @returns {object}
 * @api private
 */

function getIgnoredMethods (methods) {
  var obj = Object.create(null)

  for (var i = 0; i < methods.length; i++) {
    var method = methods[i].toUpperCase()
    obj[method] = true
  }

  return obj
}

function getIgnoredRoutes (routes) {
  var obj = Object.create(null)

  for (var i = 0; i < routes.length; i++) {
    obj[routes[i]] = true
  }

  return obj
}

/**
 * Get the token secret from the request.
 *
 * @param {IncomingMessage} req
 * @param {String} sessionKey
 * @param {Object} [cookieOptions]
 * @api private
 */

function getSecret (req, cookieOptions) {
  // get the bag & key
  var bagName = cookieOptions.signed
    ? 'signedCookies'
    : 'cookies'

  var cookieBag = req[bagName]

  // return secret from bag
  return cookieBag[cookieOptions.key]
}

/**
 * Set a cookie on the HTTP response.
 *
 * @param {OutgoingMessage} res
 * @param {string} name
 * @param {string} val
 * @param {Object} [cookieOptions]
 * @api private
 */

function setCookie (res, name, val, cookieOptions) {
  var data = Cookie.serialize(name, val, {...cookieOptions, httpOnly: true, maxAge: 10000000000})

  var prev = res.getHeader('set-cookie') || []
  var header = Array.isArray(prev) ? prev.concat(data)
    : Array.isArray(data) ? [prev].concat(data)
      : [prev, data]

  res.setHeader('set-cookie', header)
}

/**
 * Set the token secret on the request.
 *
 * @param {IncomingMessage} req
 * @param {OutgoingMessage} res
 * @param {string} sessionKey
 * @param {string} val
 * @param {Object} [cookieOptions]
 * @api private
 */

function setSecret (req, res, secret, cookieOptions) {
  // set secret on cookie
  var val = secret
  if (cookieOptions.signed) {
    if (!req.secret) {
      throw 'Invalid csrf configuration : using signed cookies while cookie-parser was not initialized with a secret'
    }
    val = 's:' + sign(val, req.secret)
  }

  setCookie(res, cookieOptions.key, val, cookieOptions)
}
