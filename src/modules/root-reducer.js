import { combineReducers } from 'redux'

import auth from './authentication/reducer'
import app from './app/reducer'
import character from './character/reducer'

export default combineReducers({
  auth,
  app,
  character
})
