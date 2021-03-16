export function getFloatTime(strTime) {
  const [hours, mins] = strTime.split(':')
  return parseFloat(hours) + (parseFloat(mins) / 60)
}