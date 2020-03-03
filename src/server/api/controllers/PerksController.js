import {PerksRepository, CharacterRepository, CharacterPerksRepository, StaffRepository} from '../repository'
import {makeFindAllHandler} from './StandardController'
import {Schema} from '../../../sapin'
import {parseFilters, entityFromBody} from '../middlewares/'

import {canBuyPerk} from '../../../modules/character/selectors'
import {usePerkSchema} from '../../../modules/character/character-schema'
import {getLevel} from '../../../data/levels'
import shortid from 'shortid'

const filterSchema = new Schema({})

export const CHAR_NOT_FOUND = {httpStatus: 404, message: 'Personnage introuvable'}
export const PERK_NOT_FOUND = {httpStatus: 404, message: 'Avantage introuvable'}
export const CANT_BUY_PERK = {httpStatus: 400, message: 'Niveau ou or insuffisant'}
export const STAFF_NOT_FOUND = {httpStatus: 400, message: 'Code de staff invalide'}
export const CANT_USE_PERK = {httpStatus: 400, message: 'Avantage déjà utilisé ou introuvable'}

function buyPerk (req, res, next) {
  const charRepo = new CharacterRepository(req.database)
  const perksRepo = new PerksRepository(req.database)
  const perkId = req.params.perkId

  const promises = [
    charRepo.findById(req.user.id),
    perksRepo.findById(perkId)
  ]
  Promise.all(promises)
    .then(([character, perk]) => {
      if (!character) throw CHAR_NOT_FOUND
      if (!perk) throw PERK_NOT_FOUND

      const currentLevel = getLevel(character.xp)
      const canBuy = canBuyPerk(perk, currentLevel, character.availableGold)
      if (!canBuy) throw CANT_BUY_PERK

      const modifiedOn = new Date()
      const boughtPerk = {
        id: shortid(),
        ownerId: req.user.id,
        boughtOn: modifiedOn,
        usedOn: null,
        perkId: perk.id,
        cost: perk.cost
      }

      return charRepo.spendGold(req.user.id, perk.cost, modifiedOn)
        .then (didUpdate => {
          if (didUpdate) {
            const charPerksRepo = new CharacterPerksRepository(req.database)
            return charPerksRepo.insert(boughtPerk)
          } else {
            throw CANT_BUY_PERK
          }
        })
        .then ( ret => {
          res.result = boughtPerk
          next()
        })
    })
    .catch(next)
}

function usePerk (req, res, next) {
  const staffRepo = new StaffRepository(req.database)
  staffRepo.findByCode(req.entity.staffCode)
    .then(staff => {
      if (!staff) throw STAFF_NOT_FOUND

      const charPerkRepo = new CharacterPerksRepository(req.database)
      return charPerkRepo.usePerk(req.entity.characterPerkId, new Date(), staff.id)
    })
    .then (couldUsePerk => {
      if (couldUsePerk) {
        res.result = ''
        next()
      } else {
        throw CANT_USE_PERK
      }
    })
    .catch(next)
}

function addRemoveUsedPerksFilter (req, res, next) {
  req.filters.usedOn = null
  next()
}

export default {
  getAll: makeFindAllHandler(PerksRepository),
  buyPerk,
  getMyPerks: [
    parseFilters(filterSchema, true), 
    addRemoveUsedPerksFilter,
    makeFindAllHandler(CharacterPerksRepository)
  ],
  usePerk: [
    entityFromBody(usePerkSchema),
    usePerk
  ] 
}
