import {getPerksByLevel} from '../selectors'

describe('app selectors', () => {
  describe('getPerksByLevel', () => {
    it('returns an object with an entry for each level.id linked to an array of perks ordered by cost', () => {
      const perksById = {
        test1: { cost: 400, levelRequired: 1},
        test2: { cost: 100, levelRequired: 1},
        test3: { cost: 500, levelRequired: 2},
        test4: { cost: 600, levelRequired: 2},
        test5: { cost: 100, levelRequired: 2}
      }

      const state = {
        app: { perksById }
      }

      const ret = getPerksByLevel(state)

      const expected = {
        level0: [],
        level1: [perksById.test2, perksById.test1],
        level2: [perksById.test5, perksById.test3, perksById.test4],
        level3: [],
        level4: [],
        level5: [],
        level6: [],
        level7: [],
        level8: [],
        level9: [],
        level10: [],
        level11: [],
        level12: []
      }

      expect(ret).toEqual(expected)
    })
  })
})