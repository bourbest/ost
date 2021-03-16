import {computeEffectiveDate} from '../invoice'

describe('computeEffectiveDate', () => {
  it('returns effective date on previous date when hour is less than 6 am', () => {
    const date = new Date('2020-02-16T00:00:00.000Z')
    const time = '05:00:00'

    // test
    const effectiveDate = computeEffectiveDate(date, time)

    // assert
    expect(effectiveDate).toEqual(new Date('2020-02-15T00:00:00.000Z'))
  })

  it('does not alter the given date', () => {
    const date = new Date('2020-02-16T00:00:00.000Z')
    const time = '05:00:00'

    // test
    computeEffectiveDate(date, time)

    // assert
    expect(date).toEqual(new Date('2020-02-16T00:00:00.000Z'))
  })

  it('sets effective date on same day when hour is more than 6 am', () => {
    const date = new Date('2020-02-16T00:00:00.000Z')
    const time = '07:00:00'

    // test
    const effectiveDate = computeEffectiveDate(date, time)

    // assert
    expect(effectiveDate).toEqual(new Date('2020-02-16T00:00:00.000Z'))
  })
})