import dice from 'string-similarity'

export function capitalize (str) {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase())
}

export function getMostSimilar (mainString, targetStrings, thresholdSimilarity = 0, key) {
  const safeSimilarity = (a, b) => (b && dice.compareTwoStrings(a.toLowerCase(), (key ? key(b) : b).toLowerCase())) || 0
  const mostSimilar = targetStrings.reduce((a, b) => {
    const similarityA = safeSimilarity(mainString, a)
    const similarityB = safeSimilarity(mainString, b)
    return similarityA >= similarityB ? a : b
  })

  const similarity = safeSimilarity(mainString, mostSimilar)
  return similarity >= thresholdSimilarity ? mostSimilar : null
}
