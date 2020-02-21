import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {isEmpty} from 'lodash'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getFormError } from '../../modules/app/selectors'
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as CharacterActions } from '../../modules/character/actions'

// components
import {Button} from 'reactstrap'
import {FormError, Field, Input} from '../components/forms'
import { useForm } from '../hooks'
import {invoiceClaimSchema} from '../../modules/character/character-schema'


const mapDispatchToProps = (dispatch) => {
  return {
    characterActions: bindActionCreators(CharacterActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch),
  }
}

function AddInvoicePage (props) {
  const history = useHistory()
  const defaultFormValues = {invoiceId: '', invoiceTime: '', invoiceDate: ''}
  const {form, bindings, setShowAllErrors, initialize} = useForm(invoiceClaimSchema, defaultFormValues)
  const [result, setResult] = useState(null)

  const save = function () {
    if (isEmpty(form.fieldErrors)) {
      const data = form.values
      props.characterActions.addInvoice(data, (result) => {
        // TODO: notify
        initialize(defaultFormValues)
        setResult(result)
      })
    } else {
      setShowAllErrors(true)
    }
  }

  useEffect(function () {
    // reset form error if any
    props.appActions.stopSubmit('xp')
  }, [props.appActions])

  return (
    <div className="container">
      <h1>Enregistrer une facture</h1>
      {!result &&
        <form>
          <FormError error={props.formError} />
          <Field form={form} required name="invoiceId" label="No de facture" control={Input} type="number" bindings={bindings} />
          <Field form={form} required name="invoiceDate" label="Date de la facture" control={Input} type="date" bindings={bindings} />
          <Field form={form} required name="invoiceTime" label="Heure et minutes" placeholder="hh:mm" control={Input} type="time" bindings={bindings} />

          <div className="text-right mb-4">
            <Button type="button" color="secondary" onClick={() => history.goBack()}>Retour</Button>
            <Button type="button" color="primary" className="ml-2" onClick={save}>Enregistrer</Button>
          </div>
        </form>
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  const props = {
    formError: getFormError(state, 'invoice')
  }
  return props
}

const ConnectedAddInvoicePage = connect(mapStateToProps, mapDispatchToProps)(AddInvoicePage)

export default ConnectedAddInvoicePage
