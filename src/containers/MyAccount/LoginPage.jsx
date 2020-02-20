import React from 'react'
import {useHistory, Link} from 'react-router-dom'
import {isEmpty} from 'lodash'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ActionCreators as AuthenticationActions } from '../../modules/authentication/actions'
import { getFormError } from '../../modules/app/selectors'

// components
import {Button} from 'reactstrap'
import {FormError, Field, Input, Checkbox} from '../components/forms/'
import { useForm } from '../hooks'
import {loginSchema} from '../../modules/authentication/authentication-schema'


const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthenticationActions, dispatch)
  }
}

function LoginPage (props) {
  const history = useHistory()
  const defaultFormValues = {username: '', password: '', keepLoggedIn: false}
  const {form, bindings, setShowAllErrors} = useForm(loginSchema, defaultFormValues)

  const login = function () {
    if (isEmpty(form.fieldErrors)) {
      const data = form.values
      props.authActions.loginUser(data.username, data.password, data.keepLoggedIn, function () {
        history.replace('/')
      })
    } else {
      setShowAllErrors(true)
    }
  }

  return (
    <div className="container">
      <h1>Venez lever l'ost!</h1>
      <form>
        <FormError error={props.formError} />
        <Field form={form} required name="username" label="Courriel" control={Input} type="email" bindings={bindings} />
        <Field form={form} required name="password" label="Mot de passe" control={Input} type="password" bindings={bindings} />
        <Field form={form} name="keepLoggedIn" text="Rester connecté" control={Checkbox} bindings={bindings} />

        <div className="text-right mb-4">
          <Button type="button" color="primary" className="mr-2" onClick={login}>Connecter</Button>
        </div>
      </form>
      <div>
        Vous n'êtes pas membre ? <Link to="/create-account">Créez un compte !</Link>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const props = {
    formError: getFormError(state, 'auth')
  }
  return props
}

const ConnectedLoginPage = connect(mapStateToProps, mapDispatchToProps)(LoginPage)

export default ConnectedLoginPage
