import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import LoginPage from './containers/MyAccount/LoginPage'
import HomePage from './containers/Home/HomePage'
import CreateAccountPage from './containers/MyAccount/CreateAccountPage'
import AddInvoicePage from './containers/XP/AddInvoicePage'

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/create-account" component={CreateAccountPage} />
        <Route exact path="/xp/add-invoice" component={AddInvoicePage} />
        <Route>
          Not found
        </Route>
      </Switch>
    </Router>
  )
}
