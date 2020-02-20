import {omit} from 'lodash'
import {UserAccountRepository} from '../repository'
import {entityFromBody} from '../middlewares/entityFromBody'
import {loginSchema} from '../../../src/modules/authentication/authentication-schema'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {COOKIE_NAMES} from '../../config/const'

const UNAUTH_EX = {httpStatus: 401, message: 'Code utilisateur ou mot de passe invalide'}
const ACCOUNT_DISABLED_EX = {httpStatus: 401, message: 'Le compte a été désactivé'}

function ensureAcccountExists (user) {
  if (!user) {
    throw UNAUTH_EX
  }
  return user
}

function ensureAccountIsActive (user) {
  if (user.isArchived) {
    throw ACCOUNT_DISABLED_EX
  }
  return user
}

function ensurePasswordMatch (password) {
  return function (user) {
    return bcrypt.compare(password, user.passwordHash)
      .then(isValid => {
        if (isValid) {
          return user
        }
        throw UNAUTH_EX
      })
  }
}

function loginUser(req, res, next) {
  const repo = new UserAccountRepository(req.database)
  return repo.findByUsername(req.body.username)
    .then(ensureAcccountExists)
    .then(ensureAccountIsActive)
    .then(ensurePasswordMatch(req.body.password))
    .then(function (user) {
      req.user = user
      next()
    })
    .catch(next)
}

function sendAuthenticated (req, res, next) {
  const user = omit(req.user, ['passwordHash'])
  const expiresIn = req.entity.keepLoggedIn ? '365d' : '1d'
  const token = jwt.sign(user, req.secret, {
    expiresIn
  })

  const maxAge = req.entity.keepLoggedIn ? 365 *24 * 3600 * 1000 : 24 * 3600 * 1000
  res.cookie(COOKIE_NAMES.auth, token, { httpOnly: true, maxAge })
  const csrfToken = req.csrf.generateToken(req, res)
  res.result = {success: true, user, csrfToken}
  next()
}

function logout (req, res, next) {
  res.clearCookie(COOKIE_NAMES.auth)
  res.result = {}
  next()
}

function refreshToken (req, res, next) {
  const user = req.user ? omit(req.user, ['passwordHash']) : null
  const csrfToken = req.csrf.generateToken(req, res)
  res.result = {success: true, user, csrfToken}
  next()
}

export default {
  login: [entityFromBody(loginSchema), loginUser, sendAuthenticated], 
  logout,
  refreshToken
}
