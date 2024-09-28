import { forceQuerySelector, waitForElement } from '../../common/utils/dom'
import { parseMarkup } from '../../common/utils/markup'

export async function main() {
  const searchBar: HTMLInputElement = await waitForElement(
    '#ui_search_input_main_search',
  )
  const searchButton = forceQuerySelector<HTMLElement>(document)(
    '#ui_search_icon_main_search',
  )

  keyHandler = searchBar.onkeydown
  clickHandler = searchButton.onclick

  searchBar.onkeydown = shortcutHandler
  searchButton.onclick = shortcutHandler
}

let keyHandler:
  | ((this: GlobalEventHandlers, event: KeyboardEvent) => unknown)
  | null
let clickHandler:
  | ((this: GlobalEventHandlers, event: MouseEvent) => unknown)
  | null

const SEARCH_REGEX =
  /^\[(Artist|Album|Genre|Label|List|Rating|Venue|Concert|Bug)\d*]$/g

function shortcutHandler(event: Event) {
  if (event.type == 'keydown' && (event as KeyboardEvent).key != 'Enter') return

  const searchBar = forceQuerySelector<HTMLInputElement>(document)(
    '#ui_search_input_main_search',
  )

  if (SEARCH_REGEX.test(searchBar.value)) {
    void parseMarkup(searchBar.value).then((value) => {
      window.location.href = (value.firstElementChild as HTMLLinkElement).href
    })
  } else {
    if (event.type == 'keydown' && keyHandler != null)
      keyHandler.call(searchBar, event as KeyboardEvent)
    if (event.type == 'click' && clickHandler != null)
      clickHandler.call(
        forceQuerySelector<HTMLElement>(document)(
          '#ui_search_icon_main_search',
        ),
        event as MouseEvent,
      )
  }
}
