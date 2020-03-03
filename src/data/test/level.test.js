import {getLevel, LEVELS} from '../levels'

describe('getLevel', () => {
  it('returns level 0 when xp = 0', () => {
    const level = getLevel(0)
    expect(level).toEqual(LEVELS[0])
  })

  it('returns the right level when xp equals min for that level', () => {
    const level = getLevel(LEVELS[3].minXp)
    expect(level).toEqual(LEVELS[3])
  })

  it('returns the last level when xp is higher than required', () => {
    const level = getLevel(100000000)
    expect(level).toEqual(LEVELS[LEVELS.length - 1])
  })
})