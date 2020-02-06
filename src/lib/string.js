import dice from 'string-similarity'

export function capitalize (str) {
  return str.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase() })
}

export function getMostSimilar (mainString, targetStrings, thresholdSimilarity = 0, key) {
  return targetStrings.reduce((a, b) => {
    const similarityA = (a && dice.compareTwoStrings(mainString.toLowerCase(), (key ? key(a) : a).toLowerCase())) || 0
    const similarityB = (b && dice.compareTwoStrings(mainString.toLowerCase(), (key ? key(b) : b).toLowerCase())) || 0

    const maxSimilarity = similarityA >= similarityB ? similarityA : similarityB
    if (maxSimilarity < thresholdSimilarity) return null
    return maxSimilarity === similarityA ? a : b
  })
}
