import apis from './api'
import '../res/css/release.css'

const releaseUrl = 'https://rateyourmusic.com/release'
const spinnerClass = 'spinner'

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
  showStreamLinksBox(true)
  showLoading(true)

  const info = getReleaseInfo()
  const missingSources = getMissingSources()
  const promises = missingSources.map(source => searchSource(source, info.title, info.artist, info.type))
  await Promise.all(promises)

  showLoading(false)
  const $streamLinkButtons = $('.ui_stream_link_btn')
  if ($streamLinkButtons.length === 0) { // only remove if there are no buttons inside
    showStreamLinksBox(false)
  }
}

function showStreamLinksBox (show) {
  const $streamLinks = $('.ui_stream_links')
  if (show) {
    if (!$streamLinks.length) {
      const $streamLinksBox = $(`
      <div class="ui_stream_links promoted" style="width:1398px;margin:0 auto;margin-top:1em;max-width:350px;">
            <span class="ui_stream_label">Listen:</span>
            <div style="clear:both;"></div></div>`)
      $('div.hide-for-small > div[style^="margin-top:8px;"]').after($streamLinksBox)
    }
  } else {
    $streamLinks.remove()
  }
}

function showLoading (show) {
  if (show) {
    const $spinContainer = $('<div>')
    $spinContainer.addClass([spinnerClass, 'ui_stream_link_btn', 'brym'])
    const $spinner = $('<div>')
    $spinner.addClass(`${spinnerClass}-icon`)
    $spinContainer.append($spinner)
    $('.ui_stream_links').find('div[style^="clear:both;"]').before($spinContainer)
  } else {
    $(`.ui_stream_links .${spinnerClass}`).remove()
  }
}

async function searchSource (source, title, artist, type) {
  const api = apis[source]
  const searchResult = await api.search(title, artist, type)
  if (searchResult) {
    const $button = $(`<a target="_blank" rel="noopener nofollow" title="${source}" class="ui_stream_link_btn ui_stream_link_btn_${source.toLowerCase()}" href="${searchResult.source}"><i class="fa fa-${source.toLowerCase()}"></i></a>`)
    $button.addClass('brym')
    $('.ui_stream_links').find(`.${spinnerClass}`).before($button)
    return true
  } else {
    return false
  }
}

function getReleaseInfo () {
  const title = $('meta[itemprop=name]').attr('content')

  const regexComment = /<!--\s*<meta\s*content="(.*)"\s*itemprop="byArtist"\s*\/>\s*-->/i
  const targetElement = regexComment.exec($('div.release_page').html())
  const artist = targetElement[1]

  const type = $('table.album_info_outer > tbody > tr > td > table > tbody > tr:nth-child(2) > td').text().toLowerCase()

  return { title, artist, type }
}

function getMissingSources () {
  const existingSources = getExistingSources()
  const apiSources = Object.keys(apis).filter(api => !!apis[api].search)
  return apiSources.filter(apiSource => !existingSources.includes(apiSource.toLowerCase()))
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
