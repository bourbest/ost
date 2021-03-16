import {forEach, values} from 'lodash'
import {createBaseRepository, convertFromDatabase} from './MongoRepository'

const InvoiceRepository = createBaseRepository('Invoice')

InvoiceRepository.prototype.findYoungestInvoice = function () {
  const filters = {}
  const options = {sort: {date: -1}}

  return this.collection.findOne(filters, options)
    .then(this.convertFromDatabase)
}

const getInvoicesFromAggregateResponse = results => {
  const invoices = {}
  forEach(results, result => {
    if (result.invoice && result.invoice.length) {
      const invoice = convertFromDatabase(result.invoice[0])
       // store them by id to avoid duplicates since more than one claim can be made to a single invoice
      invoices[invoice.id] = invoice
    }
  })
  return values(invoices)
}

InvoiceRepository.prototype.findInvoicesWithPendingClaims = function () {
  const claimsCollection = this.db.collection('InvoiceClaim')
  const match = {
    $match : { 
      status: 'pending'
    }
  }
  const lookup = {
    $lookup: {
      from: 'Invoice',
      localField: 'invoiceId',
      foreignField: '_id',
      as: 'invoice'
  }}
  return claimsCollection
    .aggregate([match, lookup])
    .toArray()
    .then(getInvoicesFromAggregateResponse)
}

InvoiceRepository.prototype.findUserClaimedInvoicesForDate = function (ownerId, invoiceDate) {
  const claimsCollection = this.db.collection('InvoiceClaim')
  const match = {
    $match : { 
      status: 'approved',
      ownerId,
      invoiceDate
    }
  }
  const lookup = {
    $lookup: {
      from: 'Invoice',
      localField: 'invoiceId',
      foreignField: '_id',
      as: 'invoice'
  }}
  return claimsCollection
    .aggregate([match, lookup])
    .toArray()
    .then(getInvoicesFromAggregateResponse)
}
export default InvoiceRepository