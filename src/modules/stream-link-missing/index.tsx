import './styles.css'

import { waitForDocumentReady } from '../../common/utils/dom'
import { isDefined } from '../../common/utils/types'
import { getDisplayType, setDisplayType } from './settings'
import {
  DisplayType,
  displayTypes,
  Row,
  State,
  StreamLinkName,
  streamLinkNames,
} from './types'

const initializeState = async (): Promise<State> => {
  const rows: Row[] = [
    ...document.querySelectorAll('.mbgen tr:not(:first-of-type)'),
  ]
    .map((row) => {
      const mediaLinksElement = row.querySelector('td:nth-child(2)')
      if (!mediaLinksElement) return

      const availableMediaLinks = streamLinkNames.filter((serviceId) =>
        row.querySelector(`.ui_media_link_btn_${serviceId}`)
      )
      const missingMediaLinks = streamLinkNames.filter(
        (serviceId) => !availableMediaLinks.includes(serviceId)
      )

      const artistTitle =
        row.querySelector('td:nth-child(1)')?.textContent ?? ''

      return {
        parentElement: row,
        mediaLinksElement,
        availableMediaLinks,
        missingMediaLinks,
        artistTitle,
      }
    })
    .filter(isDefined)
  const displayType = await getDisplayType()
  return { rows, filters: { displayType, links: [], artistTitle: '' } }
}

const render = (state: State) => {
  for (const row of state.rows) {
    row.mediaLinksElement.innerHTML = (
      state.filters.displayType === 'available'
        ? row.availableMediaLinks
        : row.missingMediaLinks
    )
      .map(
        (serviceId) =>
          `<span class="ui_media_link_btn ui_media_link_btn_${serviceId}" style="cursor:default;"></span>`
      )
      .join('')

    const showLinkFilter =
      state.filters.links.length === 0 ||
      state.filters.links.some((serviceId) =>
        row.missingMediaLinks.includes(serviceId)
      )
    const showArtistTitleFilter =
      state.filters.artistTitle.length === 0 ||
      row.artistTitle
        .toLowerCase()
        .includes(state.filters.artistTitle.toLowerCase())
    ;(row.parentElement as HTMLElement).style.display =
      showLinkFilter && showArtistTitleFilter ? '' : 'none'
  }
}

const main = async () => {
  await waitForDocumentReady()

  const state = await initializeState()

  const table = document.querySelector('.mbgen')
  if (!table) return

  const header = table.querySelector('tr th:nth-child(2)')
  if (!header) return
  header.textContent = 'Media links'

  const select = document.createElement('select')
  select.innerHTML = displayTypes
    .map(
      (displayType) => `<option value='${displayType}'>${displayType}</option>`
    )
    .join('')

  select.value = state.filters.displayType
  select.addEventListener('change', (event) => {
    const displayType = (event.target as HTMLSelectElement).value as DisplayType
    state.filters.displayType = displayType
    render(state)
    void setDisplayType(displayType)
  })

  header.append(select)

  const fieldset = document.createElement('fieldset')
  fieldset.innerHTML = '<legend>Filters</legend>'
  fieldset.className = 'brym'
  table.before(fieldset)

  const linksFilterElement = document.createElement('div')
  linksFilterElement.innerHTML = `<label>Missing media links</label>`
  linksFilterElement.append(
    makeSelector((selected) => {
      state.filters.links = [...selected]
      render(state)
    })
  )
  fieldset.append(linksFilterElement)

  const artistTitleFilterContainer = document.createElement('div')
  artistTitleFilterContainer.innerHTML = '<label>Artist/Title<label>'
  const artistTitleFilterElement = document.createElement('input')
  artistTitleFilterElement.addEventListener('input', (event) => {
    state.filters.artistTitle = (event.target as HTMLInputElement).value
    render(state)
  })
  artistTitleFilterContainer.append(artistTitleFilterElement)
  fieldset.append(artistTitleFilterContainer)

  render(state)
}

const makeSelector = (onChange: (selected: Set<StreamLinkName>) => void) => {
  const div = document.createElement('div')

  const selectedNames: Set<StreamLinkName> = new Set()

  const toggleSelected = (streamLinkName: StreamLinkName) => {
    const isSelected = selectedNames.has(streamLinkName)
    if (isSelected) {
      selectedNames.delete(streamLinkName)
    } else {
      selectedNames.add(streamLinkName)
    }
    return !isSelected
  }

  for (const streamLinkName of streamLinkNames) {
    const streamLinkButton = document.createElement('button')
    streamLinkButton.className = 'brym selector-button'
    streamLinkButton.innerHTML = `<span class="ui_media_link_btn ui_media_link_btn_${streamLinkName}"></span>`
    streamLinkButton.addEventListener('click', () => {
      const selected = toggleSelected(streamLinkName)
      if (selected) {
        streamLinkButton.classList.add('selected')
      } else {
        streamLinkButton.classList.remove('selected')
      }
      onChange(selectedNames)
    })
    div.append(streamLinkButton)
  }

  return div
}

void main()
