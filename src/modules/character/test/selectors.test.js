import {canBuyPerkById} from '../selectors'
import {LEVELS} from '../../../data/levels'

describe('character selectors', () => {
  describe('canBuyPerkById', () => {
    it('returns true when level matches and enough gold', () => {
      const perksById = {
        test1: { cost: 400, levelRequired: 1},
        test2: { cost: 100, levelRequired: 1},
        test3: { cost: 500, levelRequired: 2},
        test4: { cost: 600, levelRequired: 2},
        test5: { cost: 100, levelRequired: 2}
      }

      const characterInfo = {
        availableGold : 100,
        xp: LEVELS[1].minXp // level 1
      }

      const state = {
        app: { perksById },
        character: { characterInfo }
      }

      const ret = canBuyPerkById(state)

      const expected = {
        test1: false, // not enough gold
        test2: true,
        test3: false, // level
        test4: false,
        test5: false // level
      }

      expect(ret).toEqual(expected)
    })
  })
})