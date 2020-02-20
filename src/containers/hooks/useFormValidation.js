import {useMemo} from 'react'
import {validate} from '../../sapin'
import {useDebounce} from './useDebounce'
export function useFormValidation (formValues, schema) {
  const values = useDebounce(formValues, 500)
  return useMemo( () => {
    return validate(values, schema)
  }, [values, schema])
}