import {useEffect} from 'react'

function toggleModal() {
  let backdrop = document.getElementById('backdrop')
  if (backdrop) {
    document.body.removeChild(backdrop)
  } else {
    backdrop = document.createElement('div')
    backdrop.className = 'modal-backdrop fade show'
    backdrop.id = 'backdrop'
    document.body.appendChild(backdrop)
  }

  document.body.classList.toggle('modal-open')
  return toggleModal
}

export function useModal () {
  useEffect( toggleModal, [])
}