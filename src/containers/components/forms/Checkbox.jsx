import React from 'react'
import PropTypes from 'prop-types'

function Checkbox (props) {
  const { text, value, disabled, className, onChange, name } = props

  const handleChange = function (event) {
    const evt = {
      target: {
        value: !value,
        name: name
      }
    }
    onChange(evt)
  }
  const doNothing = function () {}

  const checked = value === true
  return (
    <div className={'form-check ' + (className || '')}>
      <input
        className="form-check-input"
        type="checkbox" tabIndex="0"
        checked={checked} disabled={disabled}
        onChange={doNothing}
        name={name}
      />
      <label className="form-check-label" onClick={handleChange}>
        {text}
      </label>
    </div>
  )
}

Checkbox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  name: PropTypes.string,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string
}

export default Checkbox
