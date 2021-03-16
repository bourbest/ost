import {forEach, omit} from 'lodash'
import {computeEffectiveDate} from '../../entities/invoice'

function getColumnIndexes (headerLine, columnsIdx, mapping) {
  const colNames = headerLine.split('\t')

  forEach(colNames, (name, idx) => {
    const mappedName = mapping[name]
    if (mappedName) {
      columnsIdx[mappedName] = idx
    }
  })

  const missingHeaders = []
  forEach(mapping, (colName, colNameInFile) => {
    if (columnsIdx[colName] === null) {
      missingHeaders.push(colNameInFile)
    }
  })

  if (missingHeaders.length > 0) {
    throw {message: 'Entête de fichier invalide, certains titres de colonne ont peut-être changé ou il en manque.', missingHeaders}
  }
  return columnsIdx
}

function parseInvoiceHeaders(headerLine) {
  const invoiceColumns = {
    date: null,
    id: null,
    subTotal: null,
    subTotalPromo: null,
    total: null,
    time: null,
    server: null,
    lineType: null
  }

  const mapping = {
    DateFact: 'date',
    NoFacture: 'id',
    SousTotal: 'subTotal',
    STPromo: 'subTotalPromo',
    Total: 'total',
    HeureFact: 'time',
    ServiPar: 'server',
    fachdr: 'lineType'
  }
  return getColumnIndexes(headerLine, invoiceColumns, mapping)
}

function parseInvoiceDetailsHeader (secondLine) { 
  const detailColumns = {
    qty: null,
    item: null,
    detailType: null
  }

  
  const mapping = {
    Quantite: 'qty',
    Item: 'item',
    Catg: 'detailType'
  }

  return getColumnIndexes(secondLine, detailColumns, mapping)
}

function createInvoice(values, columns) {
  const newInvoice = {
    items: []
  }
  forEach(columns, (valueIdx, propName) => {
    newInvoice[propName] = values[valueIdx]
  })
  return omit(newInvoice, 'lineType')
}

function createNewItem (values, columns) {
  const newItem = {}
  forEach(columns, (valueIdx, propName) => {
    newItem[propName] = values[valueIdx]
  })
  return omit(newItem, 'detailType')
}

export function parseInvoiceFileContent (fileContent) {
  const lines = fileContent.split('\n')
  const invoiceColumns = parseInvoiceHeaders(lines[0]);
  const detailColumns = parseInvoiceDetailsHeader(lines[1])
  const invoices = []
  let newInvoice = null
  for (let i = 2; i < lines.length; i++) {
    const lineValues = lines[i].split('\t')
    if (lineValues[invoiceColumns.lineType] === 'fac') {
      newInvoice = createInvoice(lineValues, invoiceColumns)
      invoices.push(newInvoice)
    } else {
      const detailType = lineValues[detailColumns.detailType]
      if (detailType === 'dtl') {
        newInvoice.items.push(createNewItem(lineValues, detailColumns))
      } else if (detailType === 'med') {
        newInvoice.paymentMethod = lineValues[detailColumns.item]
      }
    }
  }

  forEach(invoices, invoice => {
    invoice.subTotal = parseFloat(invoice.subTotal)
    invoice.subTotalPromo = parseFloat(invoice.subTotalPromo)
    invoice.total = parseFloat(invoice.total)
    invoice.date = new Date(invoice.date)
    invoice.time = invoice.time.slice(0, 5)
    invoice.effectiveDate = computeEffectiveDate(invoice.date, invoice.time)
    invoice.claimedBy = null
    forEach(invoice.items, item => {
      item.qty = parseFloat(item.qty)
    })
  })
  return invoices
}