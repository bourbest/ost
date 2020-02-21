import {CharacterRepository} from '../repository'

function getMyCharacter (req, res, next) {
  const repo = new CharacterRepository(req.database)
  return repo.findById(req.user.id)
    .then(function (entity) {
      if (entity) {
        res.result = entity
        next()
      } else {
        return next({httpStatus: 404, message: 'entity not found'})
      }
      next()
    })
    .catch(next)
}

export default {
  getMyCharacter
}
