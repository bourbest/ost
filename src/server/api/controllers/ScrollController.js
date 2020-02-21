import {ScrollRepository, CharacterRepository} from '../repository'

export const EX_INVALID_SCROLL = {httpStatus: 400, message: 'Code de parchemin est invalide.'}
export const EX_ALREADY_CONSUMED_BY_USER = {httpStatus: 400, message: 'Vous avez déjà utilisé ce parchemin.'}
export const EX_CONSUMED_BY_ANOTHER_USER = {httpStatus: 400, message: 'Ce parchemin a déjà été utilisé par une autre personne.'}

function useScroll (req, res, next) {
  const scrollId = req.params.id
  const scrollRepo = new ScrollRepository(req.database)
  const now = new Date()
  const promises = [
    scrollRepo.findById(scrollId),
    scrollRepo.assignScrollToUser(scrollId, req.user.id, now)
  ]
  
  Promise.all(promises).then(([scroll, updatedScroll]) => {
    if (!scroll) {
      return next(EX_INVALID_SCROLL)
    } else if (!updatedScroll) {
      if (scroll.ownerId === req.user.id) {
        return next(EX_ALREADY_CONSUMED_BY_USER)
      } else {
        return next(EX_CONSUMED_BY_ANOTHER_USER)
      }
    } else {
      // the scroll was assigned to the user, we can update its account
      res.result = updatedScroll
      const charRepo = new CharacterRepository(req.database)
      return charRepo.addXpAndGold(req.user.id, scroll.xp, scroll.gold, now)
    }
  })
  .then (() => {
    next()
  })
  .catch(next)
}

export default {
  useScroll: [
    useScroll
  ]
}
