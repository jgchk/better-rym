import resolve, { sources, test } from '../api/resolve'
import { capitalize } from '../lib/string'
import { inPath } from '../lib/path'
import '../../res/css/add-release.css'

const spinnerClass = 'spinner'
const importSourceId = 'import-source'

function isAddReleasePage() {
  return inPath('releases', 'ac')
}

function showLoading(show) {
  if (show) {
    const addReleaseClass = 'add-release'
    const $spinContainer = $('<div>')
    $spinContainer.addClass([spinnerClass, addReleaseClass])
    const $spinner = $('<div>')
    $spinner.addClass([`${spinnerClass}-icon`, addReleaseClass])
    $spinContainer.append($spinner)
    $(`#${importSourceId}`).append($spinContainer)
  } else {
    $(`#${importSourceId} .${spinnerClass}`).remove()
  }
}

function fillType(infoType) {
  const types = {
    album: 's',
    compilation: 'c',
    ep: 'e',
    single: 'i',
    mixtape: 'm',
    mix: 'j',
    bootleg: 'b',
    video: 'd',
  }

  const type = types[infoType]
  if (!type) return

  const $radioBtn = $(`input[name=type][value=${type}]`)
  $radioBtn.prop('checked', true)
}

function fillDate(infoDate) {
  if (!infoDate) return
  const date = new Date(infoDate)
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()

  const $year = $('#year')
  const $month = $('#month')
  const $day = $('#day')

  const pad = num => String(num).padStart(2, '0')
  $year.val(year)
  $month.val(pad(month))
  $day.val(pad(day))
}

function capitalizeTitle(title) {
  let titleSplit = title.split(' ')
  if (titleSplit.length === 0) return ''

  const noInclude = ['ep', 'lp']
  titleSplit = titleSplit.filter(
    token => !noInclude.includes(token.toLowerCase())
  )

  const noCapitalize = [
    'a',
    'an',
    'the',
    'and',
    'but',
    'or',
    'nor',
    'for',
    'yet',
    'be',
    'as',
    'at',
    'by',
    'for',
    'in',
    'of',
    'on',
    'to',
    'versus',
    'vs.',
    'vs',
    'v.',
    'v',
    'et cetera',
    'etc',
    'etc.',
  ]
  const romanNumeral = /^[I|V|X|L|C|D|M]+$/
  const surroundRegex = /([(["']*)([^)\]]+)([)\]"']*)/
  titleSplit = titleSplit.map((token, i) => {
    const [, prefix, , suffix] = token.match(surroundRegex)
    let [, , word] = token.match(surroundRegex)
    if (romanNumeral.test(word)) {
      word = word.toUpperCase()
    } else if (prefix === '[' || suffix === ']') {
      word = word.toLowerCase() // bracket editorial text should remain lowercase
    } else if (i === 0 || i === titleSplit.length) {
      word = capitalize(word) // always capitalize first and last word
    } else if (noCapitalize.includes(word.toLowerCase())) {
      word = word.toLowerCase()
    } else {
      word = capitalize(word)
    }
    return prefix + word + suffix
  })

  return titleSplit.join(' ')
}

function fillTitle(infoTitle) {
  const title = capitalizeTitle(infoTitle)
  const $title = $('#title')
  $title.val(title)
}

function fillFormat(infoFormat) {
  const formats = {
    'digital file': 58,
    'lossless digital': 59,
    'blu-ray': 88,
    cd: 60,
    'cd-r': 32,
    dualdisc: 54,
    dvd: 78,
    'dvd-a': 77,
    'dvd-r': 100,
    hdad: 62,
    hdcd: 83,
    laserdisc: 89,
    minidisc: 48,
    sacd: 76,
    umd: 81,
    vcd: 79,
    vinyl: 95,
    shellac: 96,
    '8 track': 21,
    '4 track': 103,
    acetate: 80,
    beta: 41,
    cassette: 66,
    dat: 104,
    dcc: 105,
    microcassette: 101,
    playtape: 102,
    'reel-to-reel': 92,
    vhs: 40,
    'phonograph cylinder': 91,
  }

  const format = formats[infoFormat]
  if (!format) return

  const $radioBtn = $(`input[name=format][value=${format}]`)
  $radioBtn.prop('checked', true)
}

function fillAttributes(infoAttributes) {
  const attributes = {
    downloadable: 'attrib122',
    streaming: 'attrib123',
  }

  infoAttributes.forEach(infoAttribute => {
    const attribute = attributes[infoAttribute]
    const $checkbox = $(`#${attribute}`)
    $checkbox.prop('checked', true)
  })
}

function fillTracks(infoTracks) {
  if (!infoTracks) return
  const trackStrings = infoTracks.map((infoTrack, i) => {
    const trackNum = infoTrack.position || i + 1
    const title = capitalizeTitle(infoTrack.title)
    const { duration } = infoTrack
    return `${trackNum}|${title}|${duration}`
  })

  const $advancedBtn = $('#goAdvancedBtn')
  $advancedBtn.click()

  const tracksString = trackStrings.join('\n')
  const $tracks = $('#track_advanced')
  $tracks.val(tracksString)

  const $simpleBtn = $('#goSimpleBtn')
  $simpleBtn.click()
}

function fillSource(infoSource) {
  const $source = $('#notes')
  $source.val(infoSource)
}

function fillInfo(info) {
  fillType(info.type)
  fillDate(info.date)
  fillTitle(info.title)
  fillFormat(info.format)
  fillAttributes(info.attributes)
  fillTracks(info.tracks)
  fillSource(info.link)
}

async function importLink(url) {
  showLoading(true)
  const result = await resolve(url)
  console.log(result)
  const info = Object.values(result)[0]
  console.log(info)
  fillInfo(info)
  showLoading(false)
}

function modifyAddReleasePage() {
  const $step1Header = $('#release_ac > div.submit_step_header').first()
  const $step0Header = $(`
    <div class="submit_step_header">
      Step 0: 
      <span class="submit_step_header_title">
        Import from source
      </span>
    </div>`)
  $step1Header.before($step0Header)

  const $box = $(`
    <div class="submit_step_box">
      <i>(Optional)</i> Paste a link to auto-fill most of the fields below
    </div>`)

  const $fieldHeader = $(`
    <div class="submit_field_header">
      0.1 
      <a href="" target="blank" title="" class="">
        Import source
      </a>
    </div>`)
  $box.append($fieldHeader)

  const $fieldContent = $('<div class="submit_field_content">')

  const $fieldDescription = $(`
    <div class="submit_field_description">
      Always make sure to double check every box. This tool isn't perfect!
    </div>`)
  $fieldContent.append($fieldDescription)

  const $linkbox = $(`<div id="${importSourceId}">`)
  const $input = $('<input id="import-source-input">')
  $input.on('input', () => {
    const source = test($input.val())
    $('.source-box').removeClass('active')
    $(`.source-box.${source.toLowerCase()}`).addClass('active')
  })
  const $submit = $('<button id="import-source-btn">Fill</button>')
  $submit.on('click', () => importLink($input.val()))
  $linkbox.append($input)
  $linkbox.append($submit)
  $fieldContent.append($linkbox)

  const $sources = $('<div id="sources">')
  Object.entries(sources).forEach(([name, { icon }]) => {
    const $sourceBox = $('<div class="source-box">')
    $sourceBox.addClass(['source-box', name.toLowerCase()])
    const $sourceIcon = $(icon)
    $sourceIcon.addClass('source-icon')
    $sourceBox.append($sourceIcon)
    $sources.append($sourceBox)
  })
  $fieldContent.append($sources)

  $box.append($fieldContent)
  $step1Header.before($box)
}

export default function checkAddReleasePage() {
  if (isAddReleasePage()) {
    modifyAddReleasePage()
    return true
  }
  return false
}
