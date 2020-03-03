import {forEach, sortBy, filter} from 'lodash'
import { createService } from '../../data/index'
import {EMPTY_OBJECT} from '../common/selectors'
import {LEVELS} from '../../data/levels'
import {createSelector} from 'reselect'

export const getApiConfig = (state) => state.app.apiConfig

export const getService = (state, serviceName) => {
  const apiConfig = getApiConfig(state)
  return createService(serviceName, apiConfig)
}

export const getFormError = (state, formName) => {
  const formInfo = state.app.forms[formName] || EMPTY_OBJECT
  return formInfo.error
}

export const getPerksById = state => state.app.perksById

export const getPerksByLevel = createSelector(
  [getPerksById],
  (perksById) => {
    const perksByLevel = {}
    forEach(LEVELS, level => {
      perksByLevel[level.id] = filter(perksById, perk => perk.levelRequired === level.value)
      perksByLevel[level.id] = sortBy(perksByLevel[level.id], 'cost')
    })
    return perksByLevel
  })