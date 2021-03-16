import {findIndex, forEach, countBy, orderBy} from 'lodash'
import {createSelector} from 'reselect'
import {LEVELS, getLevel} from '../../data/levels'
import {getPerksById} from '../app/selectors'

export const XP_FORM_NAME = 'xp'
export const CHARACTER_FORM_NAME = 'character'
export const USE_PERK_FORM_NAME = 'use-perk'

export const getMyCharacter = state => state.character.characterInfo

export const getMyXp = state => state.character.characterInfo.xp
export const getMyAvailableGold = state => state.character.characterInfo.availableGold

export const getMyClaims = state => state.character.invoiceClaims
export const getMyClaimsByDate = createSelector(
  [getMyClaims],
  (claims) => {
    return orderBy(claims, ['invoiceDate', 'desc'])
  }
)

export const getMyLevel = createSelector(
  [getMyXp],
  xp => {
    return getLevel(xp)
  })

export const getMyNextLevel = createSelector(
   [getMyLevel],
   currentLevel => {
    const nextLevelIdx = findIndex(LEVELS, currentLevel) + 1
    return nextLevelIdx < LEVELS.length ? LEVELS[nextLevelIdx] : null
  })
  
export const getNextLevelXpRequired = state => {
  const currentLevel = getMyLevel(state)
  const nextLevel = getMyNextLevel(state)
  return nextLevel ? nextLevel.minXp - currentLevel.minXp : 0
}

export const getCurrentLevelXp = state => {
  const currentLevel = getMyLevel(state)
  return getMyXp(state) - currentLevel.minXp
}

export const getNextLevelProgress = createSelector(
  [getCurrentLevelXp, getNextLevelXpRequired],
  (xpForLevel, xpRequired) => {
    return xpRequired > 0 ? xpForLevel / xpRequired * 100 : 0
  })

export function canBuyPerk (perk, characterLevel, availableGold) {
  return perk.levelRequired <= characterLevel.value &&
    perk.cost <= availableGold
}

export const canBuyPerkById = createSelector(
    [getPerksById, getMyLevel, getMyAvailableGold],
    (perksById, currentLevel, availableGold) => {
      const ret = {}
      forEach(perksById, (perk, id) => {
        ret[id] = canBuyPerk(perk, currentLevel, availableGold)
      })
      return ret
    }
  )

export const getMyPerks = state => state.character.perks

export const getMyPerkCountsByPerkId = createSelector(
  [getMyPerks],
  (myPerks) => {
    return countBy(myPerks, 'perkId')
  })