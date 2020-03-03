import React from 'react'
import PropTypes from 'prop-types'
import {Button} from 'reactstrap'

const cardStyle = {
  maxWidth: '150px',
  minWidth: '150px',
  width: '150px'
}

export default function PerkCard (props) {
  const {perk, bought, buttonLabel, disableButton, onButtonClick, className} = props
  const {id, name, description} = perk
  return (
    <div className={`card ${className}`} style={cardStyle}>
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>
        {bought &&
          <p className="card-text text-muted text-center">{bought} en main</p>
        }
      </div>
      {buttonLabel &&
        <div className="card-footer text-center">
          <Button color="primary" disabled={disableButton} value={id} onClick={onButtonClick}>{buttonLabel}</Button>
        </div>
      }
    </div>
  )
}

PerkCard.propTypes = {
  perk: PropTypes.object.isRequired,
  bought: PropTypes.number,
  buttonLabel: PropTypes.string,
  disableButton: PropTypes.bool,
  onButtonClick: PropTypes.func,
  className: PropTypes.string
}