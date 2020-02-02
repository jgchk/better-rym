import $ from 'jquery'
import { importers } from './api'

const add_release_url = 'https://rateyourmusic.com/releases/ac'

export function check_add_release_page() {
  if (is_add_release_page()) {
    modify_release_page()
    return true
  } else {
    return false
  }
}

function is_add_release_page() {
  return window.location.href.startsWith(add_release_url)
}

function modify_release_page() {
  const $step1_header = $('#release_ac > div.submit_step_header').first()
  const $step0_header = $(`
    <div class="submit_step_header">
      Step 0: 
      <span class="submit_step_header_title">
        Import from source
      </span>
    </div>`)
  $step1_header.before($step0_header)

  const $box = $(`
    <div class="submit_step_box">
      <i>(Optional)</i> Paste a link to auto-fill most of the fields below
    </div>`)

  const $field_header = $(`
    <div class="submit_field_header">
      0.1 
      <a href="" target="blank" title="" class="">
        Import source
      </a>
    </div>`)
  $box.append($field_header)

  const $field_content = $('<div class="submit_field_content">')

  const $field_description = $(`
    <div class="submit_field_description">
      Always make sure to double check every box. This tool isn't perfect!
    </div>`)
  $field_content.append($field_description)

  const $linkbox = $('<div>')
  const $input = $('<input>')
  const $submit = $('<button>Submit</button>')
  $submit.on('click', () => import_link($input.val()))
  $linkbox.append($input)
  $linkbox.append($submit)
  $field_content.append($linkbox)

  $box.append($field_content)
  $step1_header.before($box)
}

async function import_link(url) {
  for (let importer_name of Object.keys(importers)) {
    const importer = importers[importer_name]
    console.log(importer_name, importer.test(url))
    if (importer.test(url)) {
      const info = await importer.info(url)
      fill_info(info)
      break
    }
  }
}

function fill_info(info) {
  console.log(info)
  fill_type(info.type)
  fill_date(info.date)
  fill_title(info.title)
  fill_format(info.format)
  fill_attributes(info.attributes)
  fill_tracks(info.tracks)
  fill_source(info.source)
}

function fill_type(info_type) {
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

  const type = types[info_type]
  if (!type) return

  const $radio_btn = $(`input[name=type][value=${type}]`)
  $radio_btn.prop('checked', true)
}

function fill_date(info_date) {
  if (!info_date) return
  const [year, month, day] = info_date.split('-')

  const $year = $('#year')
  const $month = $('#month')
  const $day = $('#day')

  $year.val(year)
  $month.val(month)
  $day.val(day)
}

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function fill_title(info_title) {
  const title = capitalize_title(info_title)
  const $title = $('#title')
  $title.val(title)
}

function capitalize_title(title) {
  const title_split = title.split(' ')
  if (title_split.length === 0) return

  const no_capitalize = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'yet', 'be', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'to', 'versus', 'vs.', 'vs', 'v.', 'v', 'et cetera', 'etc', 'etc.'])
  for (let i = 0; i < title_split.length; i++) {
    const word = title_split[i]
    if (no_capitalize.has(word)) {
      title_split[i] = word.toLowerCase()
    } else {
      title_split[i] = word.capitalize()
    }
  }

  // always capitalize first and last word
  title_split[0] = title_split[0].capitalize()
  title_split[title_split.length - 1] = title_split[title_split.length - 1].capitalize()
  
  return title_split.join(' ')
}

function fill_format(info_format) {
  const formats = {
    "digital file": 58,
    "lossless digital": 59
  }

  const format = formats[info_format]
  if (!format) return

  const $radio_btn = $(`input[name=format][value=${format}]`)
  $radio_btn.prop('checked', true)
}

function fill_attributes(info_attributes) {
  const attributes = {
    downloadable: 'attrib122',
    streaming: 'attrib123'
  }

  info_attributes.forEach(info_attribute => {
    const attribute = attributes[info_attribute]
    const $checkbox = $(`#${attribute}`)
    $checkbox.prop('checked', true)
  })
}

function fill_tracks(info_tracks) {
  const track_strings = info_tracks.map((info_track, i) => {
    const track_num = i + 1
    const title = capitalize_title(info_track.title)
    const length = info_track.length
    return `${track_num}|${title}|${length}`
  })

  const $advanced_btn = $('#goAdvancedBtn')
  $advanced_btn.click()

  const tracks_string = track_strings.join('\n')
  const $tracks = $('#track_advanced')
  $tracks.val(tracks_string)

  const $simple_btn = $('#goSimpleBtn')
  $simple_btn.click()
}

function fill_source(info_source) {
  const $source = $('#notes')
  $source.val(info_source)
}
