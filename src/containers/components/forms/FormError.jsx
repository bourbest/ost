import React from 'react'

export default function FormError (props) {
  if (props.error) {
    return <div className="text-danger">{props.error}</div>
  }
  return null
}