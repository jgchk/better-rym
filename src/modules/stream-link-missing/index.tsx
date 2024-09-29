import { waitForDocumentReady } from '../../common/utils/dom'
import { isDefined } from '../../common/utils/types'
import { getDisplayType, setDisplayType } from './settings'
import type { DisplayType, Row, State, StreamLinkName } from './types'
import {
  displayTypes,
  filtersToQueryString,
  queryStringToFilters,
  streamLinkNames,
} from './types'

export async function main() {
  await waitForDocumentReady()

  const style = document.createElement('style')
  style.textContent = `
    .brym.selector-button {
      background: none;
      border: none;
      cursor: pointer;
      opacity: 0.25;
    
      &:hover {
        opacity: 0.3;
      }
    
      &.selected {
        opacity: 0.9;
    
        &:hover {
          opacity: 1;
        }
      }
    }
    
    fieldset.brym {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: fit-content;
      margin-bottom: 12px;
      background: var(--mono-f2);
      border: 1px solid var(--mono-e8);
      border-radius: 3px;
    
      label {
        display: block;
        margin-bottom: 2px;
      }
    }
  `
  document.head.append(style)

  let state = await initializeState()
  const applyStateHash = (state: State) => {
    const hash = filtersToQueryString(state.filters)
    window.location.hash = hash

    for (const node of document.querySelectorAll<HTMLAnchorElement>(
      'a.navlinknum, a.navlinkprev, a.navlinknext',
    )) {
      const url = new URL(node.href)
      url.hash = hash
      node.href = url.toString()
    }
  }
  const updateState = (
    updates: Partial<State> | ((state: State) => Partial<State>),
  ) => {
    const newState = {
      ...state,
      ...(typeof updates === 'function' ? updates(state) : updates),
    }
    applyStateHash(newState)
    state = newState
  }
  applyStateHash(state)

  const table = document.querySelector('.mbgen')
  if (!table) return

  const header = table.querySelector('tr th:nth-child(2)')
  if (!header) return
  header.textContent = 'Media links'

  const select = document.createElement('select')
  select.innerHTML = displayTypes
    .map(
      (displayType) => `<option value='${displayType}'>${displayType}</option>`,
    )
    .join('')

  select.value = state.displayType
  select.addEventListener('change', (event) => {
    const displayType = (event.target as HTMLSelectElement).value as DisplayType
    updateState({ displayType })
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
    makeSelector(new Set(state.filters.links), (selected) => {
      updateState((s) => ({ filters: { ...s.filters, links: [...selected] } }))
      render(state)
    }),
  )
  fieldset.append(linksFilterElement)

  const artistTitleFilterContainer = document.createElement('div')
  artistTitleFilterContainer.innerHTML = '<label>Artist/Title<label>'
  const artistTitleFilterElement = document.createElement('input')
  artistTitleFilterElement.value = state.filters.artistTitle
  artistTitleFilterElement.addEventListener('input', (event) => {
    updateState((s) => ({
      filters: {
        ...s.filters,
        artistTitle: (event.target as HTMLInputElement).value,
      },
    }))
    render(state)
  })
  artistTitleFilterContainer.append(artistTitleFilterElement)
  fieldset.append(artistTitleFilterContainer)

  render(state)
}

async function initializeState(): Promise<State> {
  const rows: Row[] = [
    ...document.querySelectorAll('.mbgen tr:not(:first-of-type)'),
  ]
    .map((row) => {
      const mediaLinksElement = row.querySelector('td:nth-child(2)')
      if (!mediaLinksElement) return

      const availableMediaLinks = streamLinkNames.filter((serviceId) =>
        row.querySelector(`.ui_media_link_btn_${serviceId}`),
      )
      const missingMediaLinks = streamLinkNames.filter(
        (serviceId) => !availableMediaLinks.includes(serviceId),
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
  return {
    rows,
    displayType,
    filters: queryStringToFilters(window.location.hash.slice(1)),
  }
}

function render(state: State) {
  for (const row of state.rows) {
    row.mediaLinksElement.innerHTML = (
      state.displayType === 'available'
        ? row.availableMediaLinks
        : row.missingMediaLinks
    )
      .map(
        (serviceId) =>
          `<span class="ui_media_link_btn ui_media_link_btn_${serviceId}" style="cursor:default;"></span>`,
      )
      .join('')

    const showLinkFilter =
      state.filters.links.length === 0 ||
      state.filters.links.some((serviceId) =>
        row.missingMediaLinks.includes(serviceId),
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

function makeSelector(
  initialState: Set<StreamLinkName>,
  onChange: (selected: Set<StreamLinkName>) => void,
) {
  const div = document.createElement('div')

  const selectedNames: Set<StreamLinkName> = initialState

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
    const renderSelected = (selected: boolean) => {
      if (selected) {
        streamLinkButton.classList.add('selected')
      } else {
        streamLinkButton.classList.remove('selected')
      }
    }
    renderSelected(selectedNames.has(streamLinkName))
    streamLinkButton.addEventListener('click', () => {
      const selected = toggleSelected(streamLinkName)
      renderSelected(selected)
      onChange(selectedNames)
    })
    div.append(streamLinkButton)
  }

  return div
}
