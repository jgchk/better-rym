// eslint-disable-next-line import/prefer-default-export
export function arraysEqual(a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false
  return a.every((val, i) => val === b[i])
}
