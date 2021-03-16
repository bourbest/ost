import fs from 'fs'
import {forEach} from 'lodash'
import {parseInvoiceFileContent} from './invoice-parser'
import {QuestRepository, InvoiceRepository} from '../../server/api/repository'
import {initializeContext, cleanupContext} from '../common/context'
import {addAwardToInvoice} from '../../entities/invoice-award'
const args = process.argv.slice(2)

if (args.length !== 1) {
  throw new Error('Vous devez spécifier le nom du fichier contenant les factures\n\rexemple : "node ./invoice-loader monficher.tsv')
}

function loadInvoicesFromFile (context) {
  const fileContent = fs.readFileSync(args[0], 'utf8')
  context.invoices = parseInvoiceFileContent(fileContent)
  console.log(`${context.invoices.length} factures chargées en mémoire`)
  return context    
}

function loadQuests (context) {
  const questRepo = new QuestRepository(context.db)
  return questRepo.findAll()
    .then(quests => {
      context.quests = quests
      return context
    })
}

function applyQuestsToInvoices (context) {
  forEach(context.invoices, invoice => {
    addAwardToInvoice(invoice, context.quests)
  })
  return context
}

function saveInvoiceToDb (context) {
  const invoiceRepo = new InvoiceRepository(context.db)
  return invoiceRepo.insertMany(context.invoices)
    .then( () => {
      console.log('invoices loaded to database')
      return context
    })
}

initializeContext()
  .then(loadInvoicesFromFile)
  .then(loadQuests)
  .then(applyQuestsToInvoices)
  .then(saveInvoiceToDb)
  .then(cleanupContext)