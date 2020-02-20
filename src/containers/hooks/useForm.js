import {useState, useMemo, useCallback} from 'react'
import {set} from 'lodash'
import {useFormValidation} from './useFormValidation'

export function useForm (formSchema, defaultFormValues) {
  const [formValues, setFormValues] = useState(defaultFormValues)
  const fieldErrors = useFormValidation(formValues, formSchema)
  const [touchedFields, setTouchedFields] = useState({})
  const [showAllErrors, setShowAllErrors] = useState(false)
  
  const bindings = {}
  bindings.onChange = useCallback(function (event) {
    const newValue = {...formValues}
    set(newValue, event.target.name, event.target.value)
    setFormValues(newValue)
  }, [formValues])

  bindings.onBlur = useCallback(function (event) {
    const newTouched = {...touchedFields}
    set(newTouched, event.target.name, true)
    setTouchedFields(newTouched)
  }, [touchedFields])

  const initialize = useCallback( function(values) {
    setFormValues(values)
    setTouchedFields({})
    setShowAllErrors(false)
  }, [])

  const form = useMemo( () => {
    return {
      values: formValues,
      fieldErrors,
      touchedFields,
      showAllErrors
    }
  }, [formValues, touchedFields, fieldErrors, showAllErrors])

  return {form, bindings, initialize, setShowAllErrors}
}