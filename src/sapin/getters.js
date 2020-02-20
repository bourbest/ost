var _ = require('lodash')
var isNil = _.isNil
var trim = _.trim
var isString = _.isString

module.exports = {
  getString: function (value) {
    return isNil(value) ? null : value.toString()
  },

  getTrimmedString: function (value) {
    return isNil(value) ? null : trim(value.toString())
  },

  getNumber: function (value) {
    return isNil(value) ? null : Number(value)
  },

  getFriendlyNumber: function (value) {
    if (!isNil(value)) {
      if (isString(value)) {
        value = value.replace(',', '.')
      }
      value = Number(value)
    } else {
      value = null
    }

    return value
  },

  getDate: function (value) {
    return value ? new Date(value) : null
  },

  getBool: function (value) {
    if (value === true || value === 'true') return true
    if (value === false || value === 'false') return false
    return null
  }
}
