import {sumBy} from 'lodash'
export const GOLD_LIMIT_PER_DAY = 1000

function setInvoiceBaseXpAndGold(invoice) {
  invoice.award.baseXp = Math.floor(invoice.subTotal / 10) * 20 + 100
  invoice.award.baseGold = Math.floor(invoice.subTotal / 10) * 40
}

// return the value of the effect on the base value
function computeEffect(baseValue, effect) {
  let ret = 0
  if (effect) {
    if (effect.add) {
      ret += effect.add
    }
    if (effect.multiply) {
      const x = baseValue * effect.multiply
      ret += parseInt(Math.floor(baseValue * effect.multiply), 10)
    }
  }
  return ret
}

// add the questEffect structure and values to the invoice
function addQuestEffectToInvoice(invoice, quest) {
  invoice.award = {...invoice.award, 
    questId: quest.id,
    bonusXp: computeEffect(invoice.award.baseXp, quest.xpEffect),
    bonusGold: computeEffect(invoice.award.baseGold, quest.goldEffect)
  }
}

// compute the totalXp and totalGold values
function computeTotalXpAndGold(invoice) {
  const award = invoice.award
  award.totalXp = award.baseXp + award.bonusXp
  award.totalGold = award.baseGold + award.bonusGold
}

export function addAwardToInvoice(invoice, applicableQuest) {
  invoice.award = {
    questId: null,
    baseXp: 0,
    bonusXp: 0,
    totalXp: 0,
    baseGold: 0,
    bonusGold: 0,
    totalGold: 0
  }
  setInvoiceBaseXpAndGold(invoice)
  if (applicableQuest) {
    addQuestEffectToInvoice(invoice, applicableQuest)
  }
  computeTotalXpAndGold(invoice)
}

export function computeGainedGoldFromNewInvoice (previouslyClaimedInvoices, newInvoiceAward) {
  const goldGained = sumBy(previouslyClaimedInvoices, 'award.totalGold' )
  const availableGain = goldGained < 1000 ? 1000 - goldGained : 0
  return newInvoiceAward.totalGold > availableGain ? availableGain : newInvoiceAward.totalGold
}