import {addAwardToInvoice, computeGainedGoldFromNewInvoice, GOLD_LIMIT_PER_DAY} from '../invoice-award'

const BASE_INVOICE = {
  time: '05:00:00',
  date: new Date('2020-02-16T00:00:00.000Z'),
  id: '259192-1',
  subTotal: parseFloat('22.95'),
  total: parseFloat('26.39'),
  server: 'Astrid',
  paymentMethod: 'ARGENT',
  items: [
    {item: 'BRUNCH COMPLET', qty: 1.0}
  ]
}

const TODAY = new Date(new Date().toISOString().slice(0, 10));
const TOMORROW = new Date(TODAY)
TOMORROW.setDate(TODAY.getDate() + 1)

describe('addAwardToInvoice', () => {
  it('gives 100 base xp + 20 per full 10$ in subTotal', () => {
    const invoice = {...BASE_INVOICE};
    invoice.subTotal = parseFloat('26.55')

    // test
    addAwardToInvoice(invoice, null)

    // assert
    const award = invoice.award
    expect(award.baseXp).toEqual(140)
    expect(award.totalXp).toEqual(140)
  })

  
  it('gives 40 base gold + per full 10$ in subTotal', () => {
    const invoice = {...BASE_INVOICE};
    invoice.subTotal = parseFloat('26.55')

    // test
    addAwardToInvoice(invoice, null)

    // assert
    const award = invoice.award
    expect(award.baseGold).toEqual(80)
    expect(award.totalGold).toEqual(80)
  })

  it('sets bonus Xp and Gold to 0 when given no quest', () => {
    const invoice = {...BASE_INVOICE};

    // test
    addAwardToInvoice(invoice, null)

    // assert
    const award = invoice.award
    expect(award.bonusXp).toEqual(0)
    expect(award.bonusGold).toEqual(0)
    expect(award.questId).toEqual(null)
  })

  it('sets totals to base values when given no quest', () => {
    const invoice = {...BASE_INVOICE};

    // test
    addAwardToInvoice(invoice, null)

    // assert
    const award = invoice.award
    expect(award.totalXp).toEqual(award.baseXp)
    expect(award.totalGold).toEqual(award.baseGold)
  })

  it('sets questId to id of given matching quest', () => {
    const invoice = {...BASE_INVOICE};
    const matchingQuest = {
      id: '24323',
      xpEffect: { add: 100 },
      goldEffect: { add: 50 },
    }
    // test
    addAwardToInvoice(invoice, matchingQuest)

    // assert
    expect(invoice.award.questId).toEqual(matchingQuest.id)
  })

  it('handles quest add Effect correctly', () => {
    const invoice = {...BASE_INVOICE, subTotal: 26.55 }
    const matchingQuest = {
      id: '24323',
      xpEffect: { add: 100 },
      goldEffect: { add: 50 },
    }

    // test
    addAwardToInvoice(invoice, matchingQuest)

    // assert
    const award = invoice.award
    expect(award.bonusXp).toEqual(100)
    expect(award.bonusGold).toEqual(50)
    expect(award.totalXp).toEqual(award.baseXp + award.bonusXp)
    expect(award.totalGold).toEqual(award.baseGold + award.bonusGold)
  })

  it('handles quest multiply Effect correctly', () => {
    const invoice = {...BASE_INVOICE, subTotal: 26.55 }
    const matchingQuest = {
      id: '24323',
      xpEffect: { multiply: 0.5 },
      goldEffect: { multiply: 2 },
    }

    // test
    addAwardToInvoice(invoice, matchingQuest)

    // assert
    const award = invoice.award
    expect(award.baseXp).toEqual(140)
    expect(award.bonusXp).toEqual(70)
    expect(award.totalXp).toEqual(210)

    expect(award.baseGold).toEqual(80)
    expect(award.bonusGold).toEqual(160)
    expect(award.totalGold).toEqual(240)
  })

  it('combines add and multiply Effects correctly', () => {
    const invoice = {...BASE_INVOICE, subTotal: 26.55 }
    const matchingQuest = {
      id: '24323',
      xpEffect: { add: 50, multiply: 0.5 },
      goldEffect: { add: 100, multiply: 2 },
    }

    // test
    addAwardToInvoice(invoice, matchingQuest)

    // assert
    const award = invoice.award
    expect(award.baseXp).toEqual(140)
    expect(award.bonusXp).toEqual(120)
    expect(award.totalXp).toEqual(260)

    expect(award.baseGold).toEqual(80)
    expect(award.bonusGold).toEqual(260)
    expect(award.totalGold).toEqual(340)
  })
})

describe('computeGainedGoldFromNewInvoice', () => {
  it('returns full gold award when limit is not reached', () => {
    const award = {totalGold: 500}
    const previouslyClaimedInvoices = []
    // test
    const goldGained = computeGainedGoldFromNewInvoice(previouslyClaimedInvoices, award)

    // assert
    expect(goldGained).toEqual(award.totalGold)
  })

  it('returns limit when invoice awards more than limit ', () => {
    const award = {totalGold: GOLD_LIMIT_PER_DAY + 500}
    const previouslyClaimedInvoices = []
    // test
    const goldGained = computeGainedGoldFromNewInvoice(previouslyClaimedInvoices, award)

    // assert
    expect(goldGained).toEqual(GOLD_LIMIT_PER_DAY)
  })

  it('returns the different with limit other invoices have given gold ', () => {
    const award = {totalGold: 500}
    const previouslyClaimedInvoices = [{
      award: {totalGold: GOLD_LIMIT_PER_DAY - 200 }
    }]
    // test
    const goldGained = computeGainedGoldFromNewInvoice(previouslyClaimedInvoices, award)

    // assert
    expect(goldGained).toEqual(200)
  })
})