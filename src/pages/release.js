import search from '../api/search'
import getHistoryLinks from '../api/history'
import { inPath } from '../lib/path'
import { sources, source } from '../settings'
import '../../res/styles/release.less'

const spinnerClass = 'spinner'

function addSourceButton(src, link) {
  const $button = $(
    `<a target="_blank" rel="noopener nofollow" title="${src}" class="ui_stream_link_btn ui_stream_link_btn_${src.toLowerCase()}" href="${link}"><i class="fa fa-${src.toLowerCase()}"></i></a>`
  )
  $button.addClass('brym')
  $('.ui_stream_links')
    .find(`.${spinnerClass}`)
    .before($button)
}

function addSourceButtons(response) {
  const responseSources = Object.keys(response)
  const displaySources = sources().filter(src =>
    responseSources.includes(src.toLowerCase())
  )
  displaySources.forEach(src => {
    const results = response[src.toLowerCase()]
    const link = typeof results === 'string' ? results : results[0].link
    addSourceButton(src, link)
  })
}

function getExistingSources() {
  const $streamSources = $('.ui_stream_link_btn')
  const existingSources = $streamSources.map((_, el) => {
    const regex = /ui_stream_link_btn_(\S+)/
    const match = regex.exec(el.classList.toString())
    return match ? match[1] : null
  })
  return Array.from(new Set(existingSources)) // remove duplicates
}

function getReleaseInfo() {
  const title = $('meta[itemprop=name]').attr('content')

  const regexComment = /<!--\s*<meta\s*content="(.*)"\s*itemprop="byArtist"\s*\/>\s*-->/i
  const targetElement = regexComment.exec($('div.release_page').html())
  const artist = targetElement[1]

  const type = $(
    'table.album_info_outer > tbody > tr > td > table > tbody > tr:nth-child(2) > td'
  )
    .text()
    .toLowerCase()

  return { title, artist, type }
}

function showLoading(show) {
  if (show) {
    const releaseClass = 'release'
    const $spinContainer = $('<div>')
    $spinContainer.addClass([
      spinnerClass,
      releaseClass,
      'ui_stream_link_btn',
      'brym',
    ])
    const $spinner = $('<div>')
    $spinner.addClass([`${spinnerClass}-icon`, releaseClass])
    $spinContainer.append($spinner)
    $('.ui_stream_links')
      .find('div[style^="clear:both;"]')
      .before($spinContainer)
  } else {
    $(`.ui_stream_links .${spinnerClass}`).remove()
  }
}

function showStreamLinksBox(show) {
  const $streamLinks = $('.ui_stream_links')
  if (show) {
    if ($streamLinks.length === 0) {
      const $streamLinksBox = $(`
      <div class="ui_stream_links promoted" style="width:1398px;margin:0 auto;margin-top:1em;max-width:350px;">
            <span class="ui_stream_label">Listen:</span>
            <div style="clear:both;"></div></div>`)
      $('div.hide-for-small > div[style^="margin-top:8px;"]').after(
        $streamLinksBox
      )
    }
  } else {
    $streamLinks.remove()
  }
}

async function modifyReleasePage() {
  showStreamLinksBox(true)
  showLoading(true)

  const info = getReleaseInfo()
  const enabledSources = sources()
    .filter(src => source(src))
    .map(src => src.toLowerCase())
  const existingSources = getExistingSources()
  const searchSources = enabledSources.filter(
    src => !existingSources.includes(src)
  )

  const historyButton = $("a[href^='/admin/corq']")
  const historyUrl = historyButton.attr('href')

  if (searchSources.length > 0) {
    const historyResults = await getHistoryLinks(historyUrl, searchSources)
    const remainingSources = searchSources.filter(
      src => !(src in historyResults)
    )
    const searchResults = await search(
      info.title,
      info.artist,
      remainingSources
    )
    const results = { ...searchResults, ...historyResults } // prefer history results over search
    console.log('results', results)
    addSourceButtons(results)
  }

  showLoading(false)
  const $streamLinkButtons = $('.ui_stream_link_btn')
  if ($streamLinkButtons.length === 0) {
    // only remove if there are no buttons inside
    showStreamLinksBox(false)
  }
}

function isReleasePage() {
  return inPath('release')
}

export default function checkReleasePage() {
  if (isReleasePage()) {
    modifyReleasePage()
    return true
  }
  return false
}
