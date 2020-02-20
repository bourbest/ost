import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

export default function Toast ({ id, delay = 2000, message, onHide }) {
  useEffect(
    () => {
      const timeout = setTimeout(() => {
        onHide && onHide(id)
      }, delay)

      return () => {
        clearTimeout(timeout)
      }
    },
    [id, delay, onHide]
  )
  return (
    <div className="toast show fade w-100 mr-1 mb-1" style={{position: 'absolute', bottom: 0, right: 0}}>
      <div className="toast-body">
        {message}
        <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onClick={() => onHide(id)}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  )
}

Toast.propTypes = {
  id: PropTypes.any,
  delay: PropTypes.number,
  message: PropTypes.string.isRequired,
  onHide: PropTypes.func
}