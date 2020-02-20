import React from 'react'
import {get, isObject} from 'lodash'

const sapinErrors = {
  sapin: {
  "required": "Requis",
  "invalidNumber": "Nombre invalide",
  "invalidInteger": "Nombre entier invalide",
  "valueNotInRange": "La valeur doit être comprise entre {{minValue}} et {{maxValue}}",
  "invalidEmail": "Courriel invalide",
  "invalidDate" : "Date invalide",
  "valueShouldEqualField": "Les valeurs ne sont pas égales",
  "valueShouldBeGteField": "Doit être supérieur ou égale à {{otherFieldLabel}}"
  }
}

const translate = (error) => {
  let message = ''
  if (isObject(error)) {
    message = get(sapinErrors, error.error, error.error)
    message = message.replace('{{otherFieldValue}}', error.params.otherFieldLabel)
  } else {
    message = get(sapinErrors, error, error) // will set it back to error is this is a text rather than a key
  }
  return message
}

export default function Field ({name, control, required, label, form, bindings, ...otherProps}) {
  const Control = control // avoid warning
  const error = get(form.fieldErrors, name, null)
  const value = get(form.values, name, '')
  const isDirty = get(form.touchedFields, name, false) || form.submitted

  return (
    <div className="form-group">
      <label>{label} {required && <span className="danger">*</span>}</label>
      <Control name={name} required={required} value={value} {...otherProps} {...bindings} />
      {error && isDirty && <div className="text-danger">{translate(error)}</div>} 
    </div>
  )
}

