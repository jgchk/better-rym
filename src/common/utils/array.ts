export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = []
  for (let index = 0; index < array.length; index += size) {
    const chunk = array.slice(index, index + size)
    result.push(chunk)
  }
  return result
}
