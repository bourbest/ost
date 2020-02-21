import {omit} from 'lodash'
import {validate, transform} from '../../../sapin'

// validate route query parameters against schema and set isArchived to false by default
// if it is not provided
export function parseFilters (filtersSchema, useLoggedUserAsFilter = false) {
  return (req, res, next) => {
    let filters = {}
    if (req.query) {
      const error = validate(req.query, filtersSchema, null, true)

      if (error) {
        return next({httpStatus: 400, message: 'Invalid filters parameters', error})
      }

      filters = transform(req.query, filtersSchema)
    }

    if (useLoggedUserAsFilter) {
      if (req.user) {
        filters.ownerId = req.user.id
      } else {
        filters.ownerId = null
      }
      
    }
    
    req.filters = filters
    next()
  }
}
