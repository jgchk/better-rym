import $ from 'jquery'
import apis from './api'
import '../res/css/release.css'

const releaseUrl = 'https://rateyourmusic.com/release'

export default function checkReleasePage () {
  if (isReleasePage()) {
    modifyReleasePage()
    return true
  } else {
    return false
  }
}

function isReleasePage () {
  return window.location.href.startsWith(releaseUrl)
}

async function modifyReleasePage () {
  const info = getReleaseInfo()

  const missingSources = getMissingSources()
  for (const missingSource of missingSources) {
    const api = apis[missingSource]
    const searchResult = await api.search(info.title, info.artist, info.type)
    if (!searchResult) continue
    makeSureStreamLinksBoxExists()
    const $button = $(`<a target="_blank" rel="noopener nofollow" title="Spotify" class="ui_stream_link_btn ui_stream_link_btn_${missingSource}" href="${searchResult.source}"><i class="fa fa-${missingSource}"></i></a>`)
    $button.addClass('brym')
    $('.ui_stream_links').find('div[style^="clear:both;"]').before($button)
  }
}

function makeSureStreamLinksBoxExists() {
  const $streamLinks = $('.ui_stream_links')
  if (!$streamLinks.length) {
    const $streamLinksBox = $(`
      <div class="ui_stream_links promoted" style="width:1398px;margin:0 auto;margin-top:1em;max-width:350px;">
            <span class="ui_stream_label">Listen:</span>
            <div style="clear:both;"></div></div>`)
    $('div.hide-for-small > div[style^="margin-top:8px;"]').after($streamLinksBox)
  }
}

function getReleaseInfo() {
  const title = $('meta[itemprop=name]').attr('content')

  const regexComment = /<!--\s*<meta\s*content="(.*)"\s*itemprop="byArtist"\s*\/>\s*-->/i
  const targetElement = regexComment.exec($('div.release_page').html());
  const artist = targetElement[1]

  const type = $('table.album_info_outer > tbody > tr > td > table > tbody > tr:nth-child(2) > td').text().toLowerCase()

  return { title, artist, type }
}

function getMissingSources() {
  const existingSources = getExistingSources()
  const apiSources = Object.keys(apis)
  return apiSources.filter(apiSource => !existingSources.includes(apiSource))
}

function getExistingSources () {
  const $streamSources = $('.ui_stream_link_btn')
  const existingSources = Array.from(
    new Set(Array.from( // filter duplicates
      $streamSources.map((_, el) => Array.from(el.classList)
        .filter(value => value !== 'ui_stream_link_btn')[0]
        .replace('ui_stream_link_btn_', '')) // extract streaming platform name from button class name
    ))
  )
  return existingSources
}
