import React from 'react'
import {useHistory} from 'react-router-dom'
import {isEmpty} from 'lodash'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ActionCreators as AccountActions } from '../../modules/accounts/actions'
import { ActionCreators as AuthenticationActions } from '../../modules/authentication/actions'
import { getFormError } from '../../modules/app/selectors'

// components
import {Button} from 'reactstrap'
import {FormError, Field, Input} from '../components/forms/'
import { useForm } from '../hooks'
import {newAccountSchema} from '../../modules/accounts/account-schema'

const mapDispatchToProps = (dispatch) => {
  return {
    accountActions: bindActionCreators(AccountActions, dispatch),
    authActions: bindActionCreators(AuthenticationActions, dispatch)
  }
}

function CreateAccountPage (props) {
  const history = useHistory()
  const defaultFormValues = {username: '', name: '', password: '', confirm: ''}
  const {form, bindings, setShowAllErrors} = useForm(newAccountSchema, defaultFormValues)

  const save = function () {
    if (isEmpty(form.fieldErrors)) {
      const data = form.values
      props.accountActions.createAccount(data, () => {
        props.authActions.loginUser(data.username, data.password, false, function () {
          history.replace('/')
        })
      })
    } else {
      setShowAllErrors(true)
    }
  }

  return (
    <div className="container">
      <h1>Créer un compte</h1>
      <form>
        <FormError error={props.formError} />
        <Field form={form} required name="username" label="Courriel (sera votre code d'usager)" control={Input} type="email" bindings={bindings} />
        <Field form={form} required name="name" label="Nom de personnage" control={Input} type="text" bindings={bindings} />
        <Field form={form} required name="password" label="Mot de passe" control={Input} type="password" bindings={bindings} />
        <Field form={form} required name="confirm" label="Confirmer mot de passe" control={Input} type="password" bindings={bindings} />

        <div className="text-right mb-4">
          <Button type="button" color="secondary" onClick={() => history.goBack()}>Retour</Button>
          <Button type="button" color="primary" className="ml-2" onClick={save}>Créer</Button>
        </div>

      </form>
    </div>
  )

}

const mapStateToProps = (state) => {
  const props = {
    formError: getFormError(state, 'account')
  }
  return props
}

const ConnectedCreateAccountPage = connect(mapStateToProps, mapDispatchToProps)(CreateAccountPage)

export default ConnectedCreateAccountPage
