import {date, string, required, isEmptyValue, Schema } from '../../sapin'

export function isTime ({value}) {
  let err = null
  if (!isEmptyValue(value)) {
    const regex = /^([0-9]{1,2})[:.hH][0-5][0-9]$/g
    const match = regex.exec(value)
    let isValid = match !== null
    if (isValid) {
      const hours = parseInt(match[1])
      isValid = hours < 24
    }
    if (!isValid)
      err = {error: 'Heure invalide. Respectez le format hh:mm', params: {value}}
  }
  return err
}

function isInvoiceId ({value}) {
  let err = null
  if (!isEmptyValue(value)) {
    const regex = /^[0-9]{6,9}\-[0-9]{1,3}$/g
    const match = value.match(regex)
    if (!match)
      err = {error: 'Numéro de facture invalide.', params: {value}}
  }
  return err
}

export const invoiceClaimSchema = new Schema({
  id: string,
  invoiceId: string([required, isInvoiceId]),
  invoiceDate: date(required),
  invoiceTime: string([required, isTime])
})

export const useScrollSchema = new Schema({
  id: string(required)
})

export const usePerkSchema = new Schema({
  characterPerkId: string(required),
  staffCode: string(required)
})