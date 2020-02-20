import {omit} from 'lodash'
import {UserAccountRepository, CharacterRepository} from '../repository'
import {entityFromBody} from '../middlewares/entityFromBody'
import {newAccountSchema} from '../../../src/modules/accounts/account-schema'
import bcrypt from 'bcryptjs'
import shortid from 'shortid'

const USERNAME_MUST_BE_UNIQUE = {httpStatus: 400, message: 'Code utilisateur déjà utilisé'}

const hashPassword = (req, res, next) => {
  const password = req.entity.password
  req.entity = omit(req.entity, ['password', 'confirm'])
  if (password && password.length > 0) {
    bcrypt.hash(password, 8)
      .then(hashedPassword => {
        req.entity.passwordHash = hashedPassword
        next()
      })
  } else {
    next()
  }
}
function ensureUsernameIsUnique (req, res, next) {
  const repo = new UserAccountRepository(req.database)
  return repo.findByUsername(req.body.username)
    .then(function (user) {
      if (user === null) {
        next()
      } else {
        next(USERNAME_MUST_BE_UNIQUE)
      }
    })
}

function createAccount (req, res, next) {
  const repo = new UserAccountRepository(req.database)
  const user = req.entity
  user.id = shortid.generate()

  const now = new Date()
  user.createdOn = now
  user.modifiedOn = now

  return repo.insert(user)
    .then(function () {
      res.result = omit(user, ['passwordHash'])
      next()
    })
    .catch(next)
}

function createCharacter (req, res, next) {
  const repo = new CharacterRepository(req.database)
  const character = {
    id: res.result.id, // same as user
    name: res.result.name,
    availableGold: 0,
    lifetimeEarnedGold: 0,
    level: 1,
    xp: 0
  }

  character.createdOn = res.result.createdOn
  character.modifiedOn = res.result.modifiedOn

  return repo.insert(character)
    .then(function () {
      next()
    })
    .catch(next)
}


export default {
  createAccount: [
      entityFromBody(newAccountSchema),
      hashPassword,
      ensureUsernameIsUnique,
      createAccount,
      createCharacter
    ]
}
