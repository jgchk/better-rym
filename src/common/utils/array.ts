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
  item != undefined ? [item] : undefined
