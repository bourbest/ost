import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {useModal} from '../../hooks/index'
import PerkCard from './PerkCard'
import {FormError, Input} from '../../components/forms'

function InputStaffCodeModal (props) {
  const {onCancel, onConfirm, perk, confirmError} = props
  const [staffCode, setStaffCode] = useState('')

  function handleChange (e) {
    setStaffCode(e.target.value)
  }

  function handleConfirm () {
    onConfirm(staffCode)
  }

  useModal()

  return (
    <div className="modal fade show d-block" tabindex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Autorisation requise</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onCancel}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Remettez votre appareil au serveur afin qu'il saississe son code.</p>
            <div className="d-flex flex-wrap mb-4" style={{justifyContent: 'space-around'}}>
              <PerkCard perk={perk} />
            </div>
            <from>
              {confirmError && <FormError error={confirmError} />}
              <Input name="code" onChange={handleChange} value={staffCode} placeholder="Code serveur" />
            </from>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={staffCode.length === 0}>Confirmer</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel} data-dismiss="modal">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  )
}

InputStaffCodeModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  perk: PropTypes.object.isRequired,
  confirmError: PropTypes.string
}

export default InputStaffCodeModal