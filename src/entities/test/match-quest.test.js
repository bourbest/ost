import {findMatchingQuest} from '../match-quest'

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

describe('findMatchingQuest', () => {
  it('returns null when no quest matches', () => {
    const invoice = {...BASE_INVOICE, effectiveDate: new Date()}
    const ret = findMatchingQuest(invoice, [])
    expect(ret).toEqual(null)
  })

  it('returns quest matching date only criterion', () => {
    const invoice = {...BASE_INVOICE, effectiveDate: new Date()}
    const matchingQuest = {
      validFrom: TODAY, 
      validUntil: TOMORROW,
      successConditions: {}
    }

    const notMatchingQuest = {
      validFrom: new Date(TODAY.getDate() - 10), 
      validUntil: new Date(TODAY.getDate() - 1),
      successConditions: {}
    }

    const ret = findMatchingQuest(invoice, [notMatchingQuest, matchingQuest])
    expect(ret).toEqual(matchingQuest)
  })

  it('returns quest matching dayOfWeek only criterion', () => {
    const invoice = {...BASE_INVOICE, effectiveDate: new Date()}
    const matchingQuest = {
      validFrom: TODAY, 
      validUntil: TOMORROW,
      successConditions: {
        daysOfWeek: [invoice.effectiveDate.getDay()]
      }
    }

    const notMatchingQuest = {
      validFrom: TODAY, 
      validUntil: TOMORROW,
      successConditions: {
        daysOfWeek: [invoice.effectiveDate.getDay() + 1]
      }
    }

    const ret = findMatchingQuest(invoice, [notMatchingQuest, matchingQuest])
    expect(ret).toEqual(matchingQuest)
  })

  it('returns quest matching beforeTimeOfDay only criterion', () => {
    const invoice = {...BASE_INVOICE, effectiveDate: new Date(), time: '08:45'}
    const matchingQuest = {
      validFrom: TODAY, 
      validUntil: TOMORROW,
      successConditions: {
        beforeTimeOfDay: 9
      }
    }

    const notMatchingQuest = {
      validFrom: TODAY, 
      validUntil: TOMORROW,
      successConditions: {
        beforeTimeOfDay: 8
      }
    }

    const ret = findMatchingQuest(invoice, [notMatchingQuest, matchingQuest])
    expect(ret).toEqual(matchingQuest)
  })

  it('returns quest matching afterTimeOfDay only criterion', () => {
    const invoice = {...BASE_INVOICE, effectiveDate: new Date(), time: '11:45'}
    const matchingQuest = {
      validFrom: TODAY, 
      validUntil: TOMORROW,
      successConditions: {
        afterTimeOfDay: 11
      }
    }

    const notMatchingQuest = {
      validFrom: TODAY, 
      validUntil: TOMORROW,
      successConditions: {
        afterTimeOfDay: 12
      }
    }

    const ret = findMatchingQuest(invoice, [notMatchingQuest, matchingQuest])
    expect(ret).toEqual(matchingQuest)
  })

  it('returns quest matching paymentMethod criterion', () => {
    const invoice = {...BASE_INVOICE, effectiveDate: new Date(), paymentMethod: 'ARGENT'}
    const matchingQuest = {
      validFrom: TODAY, 
      validUntil: TOMORROW,
      successConditions: {
        paymentMethods: ['ARGENT']
      }
    }

    const notMatchingQuest = {
      validFrom: TODAY, 
      validUntil: TOMORROW,
      successConditions: {
        paymentMethods: ['PAIEMENT DIRECT']
      }
    }

    const ret = findMatchingQuest(invoice, [notMatchingQuest, matchingQuest])
    expect(ret).toEqual(matchingQuest)
  })

  it('returns quest matching min subTotal criterion', () => {
    const invoice = {...BASE_INVOICE, effectiveDate: new Date(), subTotal: 50.0}
    const matchingQuest = {
      validFrom: TODAY, 
      validUntil: TOMORROW,
      successConditions: {
        minSubTotal: 50
      }
    }

    const notMatchingQuest = {
      validFrom: TODAY, 
      validUntil: TOMORROW,
      successConditions: {
        minSubTotal: 50.01
      }
    }

    const ret = findMatchingQuest(invoice, [notMatchingQuest, matchingQuest])
    expect(ret).toEqual(matchingQuest)
  })

  it('returns quest matching item criterion', () => {
    const invoice = {...BASE_INVOICE, effectiveDate: new Date(), items: [{qty: 1, item: 'BRUNCH'}] }
    const matchingQuest = {
      validFrom: TODAY, 
      validUntil: TOMORROW,
      successConditions: {
        contains: [{item: 'BRUNCH', minQty: 1.0}]
      }
    }

    const notMatchingQuest = {
      validFrom: TODAY, 
      validUntil: TOMORROW,
      successConditions: {
        contains: [{item: 'BRUNCH', minQty: 1.01}]
      }
    }

    const ret = findMatchingQuest(invoice, [notMatchingQuest, matchingQuest])
    expect(ret).toEqual(matchingQuest)
  })
})