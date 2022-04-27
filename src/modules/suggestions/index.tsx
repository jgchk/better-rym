import { waitForDocumentReady } from '../../common/utils/dom'

const getSubscribeMessage = () =>
  document.querySelector<HTMLAnchorElement>(
    '#column_container_left a[href="/subscribe/"]'
  )

const getSuggestionsAnchor = () =>
  document.querySelector<HTMLAnchorElement>('a[name=suggestions]')

const getReleaseId = () => {
  const el = document.querySelector<HTMLInputElement>('input.album_shortcut')
  return el?.value.slice(6, -1)
}

const refreshSuggestions = (releaseId: string) => {
  const script = document.createElement('script')
  script.textContent = `
    RYMsuggestions.refresh($('#suggestions_release_${releaseId}'));
  `
  document.head.append(script)
  script.remove()
}

const main = async () => {
  await waitForDocumentReady()

  const notSubscribed = getSubscribeMessage()
  // we already get suggestions if we're subscribed
  if (!notSubscribed) return

  const suggestionsAnchor = getSuggestionsAnchor()
  if (!suggestionsAnchor) {
    console.error('BRYM: could not find suggestions insertion point')
    return
  }

  const releaseId = getReleaseId()
  if (!releaseId) {
    console.error('BRYM: could not find release id')
    return
  }

  const suggestionsElement = document.createElement('div')
  suggestionsElement.className = 'section_suggestions'

  suggestionsElement.innerHTML = `
    <div id="suggestions_refresh_release_${releaseId}" style="box-sizing:border-box" onclick="RYMsuggestions.refresh($('#suggestions_release_${releaseId}'));" class="page_object_section_suggestions_refresh">
      <i class="fa fa-sync"></i>  
    </div>
    <div class="release_page_header">
      <h2>Suggestions</h2>
    </div>
    <table class="color_bar" style="xborder:1px #333 solid; width:100%;height:1px;font-size:1px;padding:0;"><tbody><tr style="height:1px;padding:0;"></tr></tbody></table>
    <ul class="suggestions lazyload-complete" data-suggestions="true" id="suggestions_release_${releaseId}" data-object="release" data-assoc-id="${releaseId}"></ul>
  `

  suggestionsAnchor.after(suggestionsElement)

  // hide not subscribed message
  notSubscribed.style.display = 'none'

  refreshSuggestions(releaseId)
}

void main()
