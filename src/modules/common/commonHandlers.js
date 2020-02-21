import { ActionCreators as appActions } from '../app/actions'

// this function returns the appropriate action to be dispatched to the store
export const handleError = (entityName, error) => {
  console.log(`error with ${entityName}`, error)
  try {
    if (error.response) {
      const {status, data} = error.response

      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(data)

      if (status >= 500) {
        return appActions.notify('commonErrors.communucationError', 'commonErrors.unexpected', data, true)
      }

      // Precondition failed on form submit
      if (status === 412 || status === 400 || status === 401) {
        return appActions.stopSubmit(entityName, data.message)
      }

      // all other errors should not occur unless user tries to hack
      // redirect the user to the error page which contains description for errors
      return null
      // request was made but the server did not respond
    } else if (error.request) {
      return appActions.notify('commonErrors.communicationError', 'commonErrors.noResponse', {}, true)
      // an error occured before the message could be sent to the server
    } else {
      // Something happened in setting up the request that triggered an Error
      return appActions.notify('commonErrors.communicationError', 'commonErrors.unexpected', error, true)
    }
  } catch (e) {
    return appActions.notify('commonErrors.communicationError', e.message, {}, true)
  }
}
