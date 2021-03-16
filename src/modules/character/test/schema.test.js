import {isTime} from '../character-schema'

describe('validator functions', () => {
  describe('isTime', () => {
    it('returns null (no error) when value is empty', () => {
      const params = { value: ''}
      const ret = isTime(params)
      expect(ret).toEqual(null)
    })

    it('returns null (no error) when time is with format h:mm', () => {
      const params = { value: '5:55'}
      const ret = isTime(params)
      expect(ret).toEqual(null)
    })
  })
})