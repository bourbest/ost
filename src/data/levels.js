// make sure this array is sorted by minXp
export const LEVELS = [
  {id: 'level0', value: 0, label: 'Niveau 0', description: '', minXp: 0},
  {id: 'level1', value: 1, label: 'Niveau 1', description: '', minXp: 500},
  {id: 'level2', value: 2, label: 'Niveau 2', description: '', minXp: 1500},
  {id: 'level3', value: 3, label: 'Niveau 3', description: '', minXp: 3600},
  {id: 'level4', value: 4, label: 'Niveau 4', description: '', minXp: 6000},
  {id: 'level5', value: 5, label: 'Niveau 5', description: '', minXp: 10000},
  {id: 'level6', value: 6, label: 'Niveau 6', description: '', minXp: 15000},
  {id: 'level7', value: 7, label: 'Niveau 7', description: '', minXp: 21000},
  {id: 'level8', value: 8, label: 'Niveau 8', description: '', minXp: 28000},
  {id: 'level9', value: 9, label: 'Niveau 9', description: '', minXp: 36000},
  {id: 'level10', value: 10, label: 'Niveau 10', description: '', minXp: 45000},
  {id: 'level11', value: 11, label: 'Niveau 11', description: '', minXp: 60000},
  {id: 'level12', value: 12, label: 'Niveau 12', description: '', minXp: 80000}
]

export function getLevel (xp) {
  let level = LEVELS[0]
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) {
      level = LEVELS[i]
    }
  }
  return level
}