export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = []
  for (let index = 0; index < array.length; index += size) {
    const chunk = array.slice(index, index + size)
    result.push(chunk)
  }
  return result
}

export const findLastIndex = <T>(
  array: Array<T>,
  predicate: (value: T, index: number, object: T[]) => boolean
): number => {
  let l = array.length
  while (l--) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (predicate(array[l]!, l, array)) return l
  }
  return -1
}

export const asArray = <T>(item: T | undefined): T[] | undefined =>
  item !== undefined ? [item] : undefined

export const uniqueBy =
  <T, O>(function_: (item: T) => O) =>
  (items: T[]): T[] => {
    const set = new Set()
    const result = []

    for (const item of items) {
      const appliedItem = function_(item)
      if (!set.has(appliedItem)) {
        set.add(appliedItem)
        result.push(item)
      }
    }

    return result
  }

export const equals = <T>(a: T[], b: T[]): boolean =>
  Array.isArray(a) &&
  Array.isArray(b) &&
  a.length === b.length &&
  a.every((value, index) => JSON.stringify(value) === JSON.stringify(b[index]))

export function isTuple<T>(array: T[], minLength: 1): array is [T]
export function isTuple<T>(array: T[], minLength: 2): array is [T, T]
export function isTuple<T>(array: T[], minLength: 3): array is [T, T, T]
export function isTuple<T>(array: T[], minLength: 4): array is [T, T, T, T]
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isTuple<T>(array: T[], minLength: number) {
  return array.length >= minLength
}
