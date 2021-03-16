import {keyBy, forEach} from 'lodash'
import {InvoiceClaimRepository, InvoiceRepository, CharacterRepository} from '../../server/api/repository'
import {validateClaim} from '../../entities/invoice-claim'
import {computeGainedGoldFromNewInvoice} from '../../entities/invoice-award'

function formatUserClaimsId (claim) {
  return `${claim.ownerId}-${claim.invoiceEffectiveDate.toISOString().slice(0, 10)}`
}

export function loadInvoicesAndClaims (context) {
  console.log('loading invoices and claims')
  const invoiceRepo = new InvoiceRepository(context.db)
  const claimRepo = new InvoiceClaimRepository(context.db)

  return Promise.all([
    invoiceRepo.findInvoicesWithPendingClaims(),
    invoiceRepo.findYoungestInvoice(),
    claimRepo.findAll({status: 'pending'}, {sortby: 'createdOn'})
  ]).then(([invoices, youngestInvoice, claims]) => {
    context.invoicesById = keyBy(invoices, 'id')
    context.youngestDate = youngestInvoice.date,
    context.claims = claims
    return context
  })
}

export function loadClaimedUserInvoicesForEachClaim (context) {
  const invoiceRepo = new InvoiceRepository(context.db)
  const promises = []
  const ret = {}

  console.log('loading user invoices for each pending claims they have')
  forEach(context.claims, claim => {
    const key = formatUserClaimsId(claim)
    if (!ret[key]) {
      const promise = invoiceRepo.findUserClaimedInvoicesForDate(claim.ownerId, claim.invoiceEffectiveDate)
        .then(invoices => {
          ret[key] = invoices
        })
      promises.push(promise)
    }
  })
  return Promise.all(promises)
    .then( () => {
      context.usersInvoicesByDate = ret
      return context
    })
}

export function validateClaimsAndComputeGains(context) {
  const gainsPerCharId = {}
  const {usersInvoicesByDate, invoicesById, youngestDate} = context
  console.log(`validating ${context.claims.length} claims and computing gains`)
  forEach(context.claims, claim => {
    const key = formatUserClaimsId(claim)
    const userInvoicesForDay = usersInvoicesByDate[key]

    if (validateClaim(invoicesById, claim, youngestDate, userInvoicesForDay)) {
      // add the invoice to the user's invoice for that day in case he has many claims for that day
      const invoice = invoicesById[claim.invoiceId]
      gainsPerCharId[claim.ownerId] = gainsPerCharId[claim.ownerId] || {xp: 0, gold: 0, charId: claim.ownerId}
      gainsPerCharId[claim.ownerId].xp += invoice.award.totalXp
      gainsPerCharId[claim.ownerId].gold += computeGainedGoldFromNewInvoice(userInvoicesForDay, invoice.award)
      userInvoicesForDay.push(invoice)
    }
  })
  context.gainsPerCharId = gainsPerCharId
  return context
}

export function saveClaimsAndGains(context) {
  const transactionTime = new Date()
  const characterRepo = new CharacterRepository(context.db)
  const claimRepo = new InvoiceClaimRepository(context.db)
  const invoiceRepo = new InvoiceRepository(context.db)

  const promises = []
  forEach(context.claims, claim => {
    if (claim.status !== 'pending') {
      claim.modifiedOn = transactionTime
      promises.push(claimRepo.update(claim))

      if (claim.status === 'approved') {
        const invoice = context.invoicesById[claim.invoiceId]
        invoice.modifiedOn = transactionTime
        promises.push(invoiceRepo.update(invoice))
      }
    }
  })

  forEach(context.gainsPerCharId, userGain => {
    if (userGain.xp > 0 || userGain.gold > 0) {
      promises.push(characterRepo.addXpAndGold(userGain.userId, userGain.xp, userGain.gold, transactionTime))
    }
  })

  if (promises.length) {
    console.log(`Saving ${promises.length} entities to database`)
  }

  return Promise.all(promises)
    .then( () => context)
}