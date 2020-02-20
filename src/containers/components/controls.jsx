import React from 'react'
import PropTypes from 'prop-types'
import {Button} from 'reactstrap'

export const Icon = ({name, className, ...otherProps}) => (
  <i className={`icon-${name} ${className}`} {...otherProps} />
)

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
}

export function ClickablePill (props) {
  const {label, value, onClick, className} = props

  return (
    <Button outline color="primary" className={className} onClick={evt => onClick(value)} value={value}>{label}</Button>
  )
}

ClickablePill.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func.isRequired
}

export function PillsOptionList (props) {
  const styles = props.horizontal ? "mb-2 mr-2" : "w-100 mb-2"
  return (
    <ul className="list-group list-unstyled">
      {props.options.map(option => (
        <li key={option.id}>
          <ClickablePill
            className={styles}
            label={option.label}
            value={option.value}
            onClick={props.onItemSelected}
          />
        </li>
      ))}
    </ul>
  )
}

PillsOptionList.propTypes = {
  options: PropTypes.array.isRequired,
  horizontal: PropTypes.bool,
  vertical: PropTypes.bool,
  onItemSelected: PropTypes.func.isRequired
}

export function InputWithSuffix ({suffix, type, ...otherProps}) {
  const inputType = type || 'text'
  return (
    <div className="input-group">
      <input
        type={inputType}
        className="form-control border"
        {...otherProps}
      />
      <span className="input-group-append">
        <div className="input-group-text bg-transparent">
          {suffix}
        </div>
      </span>
    </div>
  )
}
