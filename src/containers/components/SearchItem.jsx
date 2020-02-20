import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {debounce, filter} from 'lodash'
import {compareStrings} from '../../data/string_utils'
import SearchBox from './SearchBox'
import {ClickablePill} from './controls'

const filterList = debounce(function (filterValue, originalList, setFilteredList) {
  const filteredList = filter(originalList, item => {
    const label = item.label.substring(0, filterValue.length)
    return compareStrings(filterValue, label) === 0
  })
  filteredList.sort((l, r) => compareStrings(l.label, r.label)) 
  setFilteredList(filteredList)
}, 200)

export default function SearchItem (props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredList, setFilteredList] = useState([])

  const handleSearchTermChange = function (newSearchTerm) {
    setSearchTerm(newSearchTerm)
    filterList(newSearchTerm, props.items, setFilteredList)
  }

  const hasExactMatch = filteredList.length > 0 && compareStrings(filteredList[0].label, searchTerm) === 0
  return (
    <div>
      <div className="row mb-4">
        <div className="col-lg-10 mb-2">
          <SearchBox value={searchTerm} onChange={handleSearchTermChange} placeholder={`Search or name a new ${props.itemLabel}...`} />
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          {props.canCreate && !hasExactMatch && searchTerm.length > 1 &&
            <ClickablePill className="mb-2 mr-2" label={`Create "${searchTerm}"`} onClick={() => props.onItemCreated(searchTerm)} />
          }
          {filteredList.map(item => (
            <ClickablePill key={item.id} className="mb-2 mr-2" label={item.label} id={item.id} onClick={props.onItemSelected} />
          ))}
        </div>
      </div>
    </div>
  )
}

SearchItem.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  itemLabel: PropTypes.string.isRequired,
  canCreate: PropTypes.bool,
  onItemCreated: PropTypes.func,
  onItemSelected: PropTypes.func.isRequired
}
