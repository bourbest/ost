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
import {useScrollSchema} from '../../modules/character/character-schema'


const mapDispatchToProps = (dispatch) => {
  return {
    characterActions: bindActionCreators(CharacterActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch),
  }
}

function UseScrollPage (props) {
  const history = useHistory()
  const defaultFormValues = {id: ''}
  const {form, bindings, setShowAllErrors, initialize} = useForm(useScrollSchema, defaultFormValues)

  const save = function () {
    if (isEmpty(form.fieldErrors)) {
      const data = form.values
      props.characterActions.useScroll(data, (scroll) => {
        // TODO: notify instead of alert
        alert(`Vous gagnez ${scroll.xp} points d'expérience et ${scroll.gold} pièces d'or`)
        initialize(defaultFormValues)
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
      <h1>Utiliser un parchemin</h1>
      <form>
        <FormError error={props.formError} />
        <Field form={form} required name="id" label="Code du parchemin" control={Input} type="text" bindings={bindings} />

        <div className="text-right mb-4">
          <Button type="button" color="secondary" onClick={() => history.goBack()}>Retour</Button>
          <Button type="button" color="primary" className="ml-2" onClick={save}>Utiliser</Button>
        </div>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => {
  const props = {
    formError: getFormError(state, 'xp')
  }
  return props
}

const ConnectedUseScrollPage = connect(mapStateToProps, mapDispatchToProps)(UseScrollPage)

export default ConnectedUseScrollPage
