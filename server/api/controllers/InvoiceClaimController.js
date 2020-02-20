import {InvoiceClaimRepository} from '../repository'
import {entityFromBody} from '../middlewares/entityFromBody'
import {invoiceClaimSchema} from '../../../src/modules/character/character-schema'
import shortid from 'shortid'

import {Schema} from '../../../src/sapin'
import {parseFilters} from '../middlewares/'
import {makeFindAllHandler} from './StandardController'

const filterSchema = new Schema({})

function createClaim (req, res, next) {
  const repo = new InvoiceClaimRepository(req.database)
  const claim = req.entity
  claim.id = shortid.generate()
  claim.ownerId = req.user.id
  claim.status = 'pending'
  const now = new Date()
  claim.createdOn = now
  claim.modifiedOn = now

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
