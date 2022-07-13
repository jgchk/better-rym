export const CAPITALIZATION_TYPES = [
  'title-case',
  'sentence-case',
  'as-is',
] as const
export type CapitalizationType = typeof CAPITALIZATION_TYPES[number]

const upperCaseFirst = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1)

const capitalCase = (text: string): string =>
  text.replace(/[^\s"()/[\]{}“”-]+/g, (match) => upperCaseFirst(match))

const capitalizeRomanNumerals = (text: string): string =>
  text.replace(
    /\b(?!mi)(?<!['’])(?=[cdilmvx])m*(c[dm]|d?c*)(x[cl]|l?x*)(i[vx]|v?i*)(?=\s|$)/gi,
    (match) => match.toUpperCase()
  )

const lowercaseWords = (text: string): string =>
  text.replace(
    /\b(versus|the|and|but|nor|for|yet|an|or|as|at|by|in|of|on|to|vs|a|v|n|o)\b/gi,
    (match) => match.toLowerCase()
  )

const capitalizeFirstWord = (text: string): string =>
  text.replace(/(?:^|(?:[!()./:?[\]{}]\s*))([\w']+)/g, (match) =>
    capitalCase(match)
  )

const capitalizeLastWord = (text: string): string =>
  text.replace(
    /([^\s"()/[\]{}“”-]+)(?:$|(?:\s*(?<!vs?)[!()./:?[\]{}]))/g,
    (match) => upperCaseFirst(match)
  )

const forceLowercaseWords = (text: string): string =>
  text.replace(/\betc\b/gi, (match) => match.toLowerCase())

const spaceSlashes = (text: string): string =>
  text.replace(/\s*\/\s*/, ' / ').replace(/\s*\\\s*/, ' \\ ')

const formatMixText = (text: string) => {
  const regex = /\s*-\s*(.*)\b((?:[Rr]emix|[Mm]ix|[Vv]ersion)(?:e?s)?)/
  const match = regex.exec(text)
  if (!match) return text

  const artistText = match[1]?.trim() ?? ''
  const mixType = match[2]?.trim() ?? ''

  const parenthesizedText = [artistText, mixType]
    .filter((s) => s.length > 0)
    .join(' ')

  return text.replace(regex, ` (${parenthesizedText})`)
}

export const capitalize = (
  text: string,
  capitalization: CapitalizationType
): string => {
  if (capitalization === 'as-is') {
    return text
  }

  if (capitalization === 'sentence-case') {
    let output = upperCaseFirst(text.toLowerCase())
    output = lowercaseWords(output)
    output = capitalizeRomanNumerals(output)
    output = formatMixText(output)
    output = spaceSlashes(output)
    output = capitalizeFirstWord(output)
    output = forceLowercaseWords(output)
    return output
  }

  const log = text === 'birds v. worms'

  // title-case
  let output = capitalCase(text.toLowerCase())
  if (log) console.log(1, output)
  output = lowercaseWords(output)
  if (log) console.log(2, output)
  output = capitalizeRomanNumerals(output)
  if (log) console.log(3, output)
  output = spaceSlashes(output)
  if (log) console.log(4, output)
  output = formatMixText(output)
  if (log) console.log(5, output)
  output = capitalizeFirstWord(output)
  if (log) console.log(6, output)
  output = capitalizeLastWord(output)
  if (log) console.log(7, output)
  output = forceLowercaseWords(output)
  if (log) console.log(8, output)
  return output
}
