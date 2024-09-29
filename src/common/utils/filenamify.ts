function filenameReservedRegex() {
  // eslint-disable-next-line no-control-regex
  return /[<>:"/\\|?*\u0000-\u001F]/g
}

function windowsReservedNameRegex() {
  return /^(con|prn|aux|nul|com\d|lpt\d)$/i
}

// Doesn't make sense to have longer filenames
const MAX_FILENAME_LENGTH = 100

const reRelativePath = /^\.+(\\|\/)|^\.+$/
const reTrailingPeriods = /\.+$/

export default function filenamify(
  string: string,
  options: { replacement?: string; maxLength?: number } = {},
) {
  const reControlChars = /[\u0000-\u001F\u0080-\u009F]/g // eslint-disable-line no-control-regex
  const reRepeatedReservedCharacters = /([<>:"/\\|?*\u0000-\u001F]){2,}/g // eslint-disable-line no-control-regex

  if (typeof string !== 'string') {
    throw new TypeError('Expected a string')
  }

  const replacement = options.replacement ?? '!'

  if (
    filenameReservedRegex().test(replacement) &&
    reControlChars.test(replacement)
  ) {
    throw new Error(
      'Replacement string cannot contain reserved filename characters',
    )
  }

  if (replacement.length > 0) {
    string = string.replace(reRepeatedReservedCharacters, '$1')
  }

  string = string.normalize('NFD')
  string = string.replace(reRelativePath, replacement)
  string = string.replace(filenameReservedRegex(), replacement)
  string = string.replace(reControlChars, replacement)
  string = string.replace(reTrailingPeriods, '')

  if (replacement.length > 0) {
    const startedWithDot = string.startsWith('.')

    // We removed the whole filename
    if (!startedWithDot && string.startsWith('.')) {
      string = replacement + string
    }

    // We removed the whole extension
    if (string.endsWith('.')) {
      string += replacement
    }
  }

  string = windowsReservedNameRegex().test(string)
    ? string + replacement
    : string
  const allowedLength =
    typeof options.maxLength === 'number'
      ? options.maxLength
      : MAX_FILENAME_LENGTH
  if (string.length > allowedLength) {
    const extensionIndex = string.lastIndexOf('.')
    if (extensionIndex === -1) {
      string = string.slice(0, allowedLength)
    } else {
      const filename = string.slice(0, extensionIndex)
      const extension = string.slice(extensionIndex)
      string =
        filename.slice(0, Math.max(1, allowedLength - extension.length)) +
        extension
    }
  }

  return string
}
