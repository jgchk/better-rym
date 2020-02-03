import $ from 'jquery'
import { importers } from './api'

const addReleaseUrl = 'https://rateyourmusic.com/releases/ac'

export function checkAddReleasePage () {
  if (isAddReleasePage()) {
    modifyReleasePage()
    return true
  } else {
    return false
  }
}

function isAddReleasePage () {
  return window.location.href.startsWith(addReleaseUrl)
}

function modifyReleasePage () {
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

  const $linkbox = $('<div>')
  const $input = $('<input style="width: 400px;">')
  const $submit = $('<button id="importSourceBtn" style="height: 22px; margin-left: 2px; padding-left: 2px; padding-right: 4px; cursor: pointer;">Submit</button>')
  $submit.on('click', () => importLink($input.val()))
  $linkbox.append($input)
  $linkbox.append($submit)
  $fieldContent.append($linkbox)

  $box.append($fieldContent)
  $step1Header.before($box)
}

async function importLink (url) {
  for (const importerName of Object.keys(importers)) {
    const importer = importers[importerName]
    if (importer.test(url)) {
      const info = await importer.info(url)
      fillInfo(info)
      break
    }
  }
}

function fillInfo (info) {
  fillType(info.type)
  fillDate(info.date)
  fillTitle(info.title)
  fillFormat(info.format)
  fillAttributes(info.attributes)
  fillTracks(info.tracks)
  fillSource(info.source)
}

function fillType (infoType) {
  const types = {
    album: 's',
    compilation: 'c',
    ep: 'e',
    single: 'i',
    mixtape: 'm',
    mix: 'j',
    bootleg: 'b',
    video: 'd'
  }

  const type = types[infoType]
  if (!type) return

  const $radioBtn = $(`input[name=type][value=${type}]`)
  $radioBtn.prop('checked', true)
}

function fillDate (infoDate) {
  if (!infoDate) return
  const [year, month, day] = infoDate.split('-')

  const $year = $('#year')
  const $month = $('#month')
  const $day = $('#day')

  $year.val(year)
  $month.val(month)
  $day.val(day)
}

String.prototype.capitalize = function () {
  return this.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase() })
}

function fillTitle (infoTitle) {
  const title = capitalizeTitle(infoTitle)
  const $title = $('#title')
  $title.val(title)
}

function capitalizeTitle (title) {
  const titleSplit = title.split(' ')
  if (titleSplit.length === 0) return

  const noCapitalize = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'yet', 'be', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'to', 'versus', 'vs.', 'vs', 'v.', 'v', 'et cetera', 'etc', 'etc.'])
  for (let i = 0; i < titleSplit.length; i++) {
    const word = titleSplit[i]
    if (noCapitalize.has(word)) {
      titleSplit[i] = word.toLowerCase()
    } else {
      titleSplit[i] = word.capitalize()
    }
  }

  // always capitalize first and last word
  titleSplit[0] = titleSplit[0].capitalize()
  titleSplit[titleSplit.length - 1] = titleSplit[titleSplit.length - 1].capitalize()

  return titleSplit.join(' ')
}

function fillFormat (infoFormat) {
  const formats = {
    'digital file': 58,
    'lossless digital': 59
  }

  const format = formats[infoFormat]
  if (!format) return

  const $radioBtn = $(`input[name=format][value=${format}]`)
  $radioBtn.prop('checked', true)
}

function fillAttributes (infoAttributes) {
  const attributes = {
    downloadable: 'attrib122',
    streaming: 'attrib123'
  }

  infoAttributes.forEach(infoAttribute => {
    const attribute = attributes[infoAttribute]
    const $checkbox = $(`#${attribute}`)
    $checkbox.prop('checked', true)
  })
}

function fillTracks (infoTracks) {
  const trackStrings = infoTracks.map((infoTrack, i) => {
    const trackNum = i + 1
    const title = capitalizeTitle(infoTrack.title)
    const length = infoTrack.length
    return `${trackNum}|${title}|${length}`
  })

  const $advancedBtn = $('#goAdvancedBtn')
  $advancedBtn.click()

  const tracksString = trackStrings.join('\n')
  const $tracks = $('#track_advanced')
  $tracks.val(tracksString)

  const $simpleBtn = $('#goSimpleBtn')
  $simpleBtn.click()
}

function fillSource (infoSource) {
  const $source = $('#notes')
  $source.val(infoSource)
}
