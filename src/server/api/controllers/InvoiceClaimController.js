import {InvoiceClaimRepository} from '../repository'
import {entityFromBody} from '../middlewares/entityFromBody'
import {invoiceClaimSchema} from '../../../modules/character/character-schema'
import shortid from 'shortid'

import {Schema} from '../../../sapin'
import {parseFilters} from '../middlewares/'
import {makeFindAllHandler} from './StandardController'
import {computeEffectiveDate} from '../../../entities/invoice'

const filterSchema = new Schema({})

function formatTime (time) {
  const regex = /^([0-9]{1,2})[\:\.hH]([0-5][0-9])$/g
  const match = regex.exec(time)
  let ret = ''
  if (match[1].length < 2) {
    ret = '0'
  }
  ret = ret + match[1] + ':' + match[2]
  return ret
}

function createClaim (req, res, next) {
  const repo = new InvoiceClaimRepository(req.database)
  const claim = req.entity
  claim.id = shortid.generate()
  claim.ownerId = req.user.id
  claim.status = 'pending'
  const now = new Date()
  claim.createdOn = now
  claim.modifiedOn = now
  claim.invoiceEffectiveDate = computeEffectiveDate(claim.invoiceDate, claim.invoiceTime)
  claim.invoiceTime = formatTime(claim.invoiceTime)

  return repo.insert(claim)
    .then(function () {
      res.result = claim
      next()
    })
    .catch(next)
}


export default {
  createClaim: [
    entityFromBody(invoiceClaimSchema),
    createClaim
  ],
  getMyClaims: [
    parseFilters(filterSchema, true), 
    makeFindAllHandler(InvoiceClaimRepository)
  ]  
}
