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
import UseScrollPage from './containers/XP/UseScrollPage'
import BuyPerkPage from './containers/Perks/BuyPerksPage'
import MyPerksPage from './containers/Perks/MyPerksPage'

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/create-account" component={CreateAccountPage} />
        <Route exact path="/xp/add-invoice" component={AddInvoicePage} />
        <Route exact path="/xp/use-scroll" component={UseScrollPage} />
        <Route exact path="/perks/buy" component={BuyPerkPage} />
        <Route exact path="/my-perks" component={MyPerksPage} />
        <Route>
          Not found
        </Route>
      </Switch>
    </Router>
  )
}
