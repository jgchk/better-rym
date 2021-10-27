export const regexIndexOf = (
  string: string,
  regex: RegExp,
  startpos?: number
): number => {
  const indexOf = string.slice(Math.max(0, startpos || 0)).search(regex)
  return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf
}

export const regexLastIndexOf = (
  string: string,
  regex: RegExp,
  startpos?: number
): number => {
  regex = regex.global
    ? regex
    : new RegExp(
        regex.source,
        'g' + (regex.ignoreCase ? 'i' : '') + (regex.multiline ? 'm' : '')
      )
  if (typeof startpos == 'undefined') {
    startpos = string.length
  } else if (startpos < 0) {
    startpos = 0
  }
  const stringToWorkWith = string.slice(0, Math.max(0, startpos + 1))
  let lastIndexOf = -1
  let nextStop = 0
  let result
  while ((result = regex.exec(stringToWorkWith)) != null) {
    lastIndexOf = result.index
    regex.lastIndex = ++nextStop
  }
  return lastIndexOf
}
