import {some} from 'lodash'
import {getFloatTime} from './utils'

/* schema de quest
"_id" : "quete1", 
  "name" : "Terrassez le minotaure", // nom de la quête, apparaîtra à l'interface
  "description" : "Venez manger le minotaure", // description, apparaîtra à l'interface
  "xpEffect" : // effets sur l'xp d'une quête. Ils sont calculés indépendemment les uns des autres et additionnés à la fin
    {
      "add" : 100,   // optionnel, ajouter X. 
      "multiply" : 2 // optionnel, ajouter (baseCost * multiplier)
    }, 
    "goldEffect" : { // effets sur l'or
       "add" : 50, 
       "multiply" : 1
     }, 
    "validFrom" : ISODate("2020-01-17T00:00:00Z"), // période d'effectivité, comparer Invoice.effectiveDate
    "validUntil" : ISODate("2020-10-17T00:00:00Z"), 
    "successConditions" : { // condition à remplir pour bénéficier des avantages de la quête. Voir invoiceMatchesQuest pour les conditions
      "minCost" : 5, 
      "contains" : [ "Punch 1" ]
     }
   }

*/
function invoiceMatchesQuest(invoice, quest) {
  const c = quest.successConditions
  let matches = invoice.effectiveDate >= quest.validFrom && invoice.effectiveDate < quest.validUntil;

  if (matches && c.daysOfWeek) {
    matches = some(c.daysOfWeek, day => day === invoice.effectiveDate.getDay())
  }
  if (matches && c.beforeTimeOfDay) {
    const invoiceTime = getFloatTime(invoice.time)
    matches = invoiceTime <= c.beforeTimeOfDay
  }
  if (matches && c.afterTimeOfDay) {
    const invoiceTime = getFloatTime(invoice.time)
    matches = invoiceTime >= c.afterTimeOfDay
  }
  if (matches && c.minSubTotal) {
    matches = invoice.subTotal >= c.minSubTotal
  }
  if (matches && c.paymentMethods) {
    matches = some(c.paymentMethods, m => m === invoice.paymentMethod)
  }
  if (matches && c.contains) {
    matches = some(c.contains, condition => some(invoice.items, item => condition.item === item.item && condition.minQty <= item.qty ))
  }
 
  return matches
}

// returns the first matching quest for the invoice
export function findMatchingQuest(invoice, quests) {
  for (let i = 0; i < quests.length; i++) {
    if (invoiceMatchesQuest(invoice, quests[i]))
      return quests[i]
  }
  return null
}