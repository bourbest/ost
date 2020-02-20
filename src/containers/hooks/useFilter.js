import {useMemo} from 'react'
import {filter} from 'lodash'
import {compareStrings} from '../../data/string_utils'

export function useFilter (list, filterValue, property = 'name') {
  return useMemo( () => {
    const filteredList = filter(list, item => {
      const name = (item[property] || '').substring(0, filterValue.length)
      return compareStrings(filterValue, name) === 0
    })
    filteredList.sort((l, r) => compareStrings(l[property], r[property])) 
    return filteredList
  }, [list, filterValue, property])
}

