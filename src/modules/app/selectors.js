import { createService } from '../../data/index'
import {EMPTY_OBJECT} from '../common/selectors'

export const getApiConfig = (state) => state.app.apiConfig

export const getService = (state, serviceName) => {
  const apiConfig = getApiConfig(state)
  return createService(serviceName, apiConfig)
}

export const getFormError = (state, formName) => {
  const formInfo = state.app.forms[formName] || EMPTY_OBJECT
  return formInfo.error
}
