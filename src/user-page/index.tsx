import { h, render } from 'preact'

import { Loader } from '../common/components/loader'
import { forceQuerySelector, waitForElement } from '../common/utils/dom'
import { fetch } from '../common/utils/fetch'
import { parseMarkup } from '../common/utils/markup'

let headerArray: Element[]
let currentPreferences: FormData

const BUTTON_CLASSES = 'btn btn_small flat_btn'
const COMMON_STYLE =
  'vertical-align:middle; position:relative; margin-right:1em;'
const OTHER_STYLE = COMMON_STYLE + 'top:75%; transform:translateY(-50%)'

type Dictionary = { [index: string]: string }

const getHeader = (alias: string) => {
  const header = headerArray.find((element) =>
    element.textContent?.includes(alias)
  )
  if (!header) throw "Couldn't find the requested header with alias " + alias
  return header as HTMLDivElement
}

const getCorrespondingContent = (alias: string) => {
  const content = [...document.querySelectorAll('.bubble_content')][
    headerArray.indexOf(getHeader(alias))
  ]
  if (!content)
    throw "Couldn't find the content corresponding to the specified header!"
  return content as HTMLDivElement
}

const createEditButton = (alias: string, field: string) => {
  const edit = document.createElement('a')
  getHeader(alias)?.prepend(edit)
  edit.outerHTML = `<a href="javascript:void(0)" class="${BUTTON_CLASSES}" style="${
    COMMON_STYLE + 'bottom:0.3em; font-size:.6em'
  }" data-alias="${alias}" data-field="${field}">edit</a>`
  forceQuerySelector<HTMLAnchorElement>(getHeader(alias))('a').addEventListener(
    'click',
    editClick
  )
}

const editClick = (event: MouseEvent) => {
  const button = event.target as HTMLElement
  if (
    button.style.display != 'none' &&
    button.dataset['alias'] != null &&
    button.dataset['field'] != null
  ) {
    button.style.display = 'none'

    const contentBox = forceQuerySelector(
      getCorrespondingContent(button.dataset['alias'])
    )('div')
    forceQuerySelector<HTMLSpanElement>(contentBox)(
      '.rendered_text'
    ).outerHTML = ''

    const contentText = document.createElement('textarea')
    contentText.textContent =
      (currentPreferences.get(button.dataset['field']) as string) || ''
    contentText.style.resize = 'vertical'
    contentText.rows = 6

    const contentButtons = document.createElement('div')
    const options = [
      [saveClick, 'save'],
      [previewClick, 'preview'],
      [cancelClick, 'cancel'],
    ] as const
    render(
      <div style='text-align:right; height:2em'>
        {options.map(([handler, text]) => (
          <a
            href='javascript:void(0)'
            className={BUTTON_CLASSES}
            style={OTHER_STYLE}
            onClick={handler}
            data-alias={button.dataset['alias']}
            data-field={button.dataset['field']}
            key={text}
          >
            {text}
          </a>
        ))}
      </div>,
      contentButtons
    )
    contentButtons.prepend(contentText)
    contentBox?.append(contentButtons)
  }
}

const saveClick = (event: MouseEvent) => {
  const button = event.target as HTMLAnchorElement
  if (
    button.dataset['alias'] != null &&
    button.dataset['field'] != null &&
    button.style.cursor != 'default'
  ) {
    const container = getCorrespondingContent(button.dataset['alias'])
    if (container.querySelector('svg[class*="loader"]') != null)
      lockAndLoad(button)

    currentPreferences.set(
      button.dataset['field'],
      container.querySelector('textarea')?.value || ''
    )

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    void updateProfile().then((_v) => {
      closeUpShop(button)
    })
  }
}

const previewClick = (event: MouseEvent) => {
  const button = event.target as HTMLAnchorElement
  if (button.dataset['alias'] != null && button.style.cursor != 'default') {
    const container = forceQuerySelector(
      getCorrespondingContent(button.dataset['alias'])
    )('div')
    if (container.querySelector('svg[class*="loader"]') != null)
      lockAndLoad(button)

    const existing = container.querySelector('.rendered_text')
    if (existing) existing.outerHTML = ''

    void parseMarkup(
      forceQuerySelector<HTMLTextAreaElement>(container)('textarea').value || ''
    ).then((value) => {
      const line = document.createElement('hr')
      line.style.margin = '1em 0'
      value.prepend(line)
      container.append(value)
      forceQuerySelector(container)('svg[class*="loader"]').outerHTML = ''
      unlock(button)
    })
  }
}

const cancelClick = (event: MouseEvent) => {
  const button = event.target as HTMLAnchorElement
  if (button.style.cursor != 'default') closeUpShop(button)
}

const closeUpShop = (button: HTMLAnchorElement) => {
  if (button.dataset['alias'] != null && button.dataset['field'] != null) {
    const container = getCorrespondingContent(button.dataset['alias'])
    const field = button.dataset['field']
    if (container.querySelector('svg[class*="loader"]') != null)
      lockAndLoad(button)

    void parseMarkup(currentPreferences.get(field)?.toString() || '').then(
      (value) => {
        container.innerHTML = `<div style="padding:14px;">${value.outerHTML}</div><div class="clear"></div>`
        forceQuerySelector<HTMLElement>(document)(
          `.bubble_header a[data-field=${field}]`
        ).style.display = 'inline-block'
      }
    )
  }
}

const lockAndLoad = (button: HTMLAnchorElement) => {
  if (button.parentElement == null || !button.parentElement.children)
    throw 'Unexpected null or undefined'

  for (const element of button.parentElement.children) {
    const anchor = element as HTMLElement
    anchor.style.color = 'var(--btn-secondary-text-disabled)'
    anchor.style.background = 'var(--btn-seconary-background-disabled)'
    anchor.style.cursor = 'default'
  }

  const loaderContainer = document.createElement('div')
  render(<Loader />, loaderContainer)
  const loader = forceQuerySelector<SVGSVGElement>(loaderContainer)('svg')
  loader.style.cssText =
    'margin-right: 1em; vertical-align: middle; position: relative; top: 35%'
  loader.classList.add('.loader')
  button.parentElement.prepend(loader)
}

const unlock = (button: HTMLAnchorElement) => {
  if (button.parentElement == null || !button.parentElement.children)
    throw 'Unexpected null or undefined'

  for (const element of button.parentElement.children) {
    const anchor = element as HTMLElement
    anchor.style.color = anchor.style.background = anchor.style.cursor = ''
  }
}

const updateProfile = async () => {
  const entries: Dictionary = {}
  for (const [k, v] of currentPreferences) entries[k] = v as string

  await fetch({
    url: 'https://rateyourmusic.com/account/profile_edit_2',
    method: 'POST',
    urlParameters: entries,
  })
}

const main = async () => {
  // look for the element that always appears on your user page, but never on others
  const key = await waitForElement('.profile_set_listening_btn a')

  if (key !== null) {
    headerArray = [...document.querySelectorAll('.bubble_header')]

    const response = await fetch({
      url: 'https://rateyourmusic.com/account/order',
    })
    const htmlOrder = new DOMParser().parseFromString(response, 'text/html')

    const response2 = await fetch({
      url: 'https://rateyourmusic.com/account/profile_edit',
    })
    currentPreferences = new FormData(
      forceQuerySelector<HTMLFormElement>(
        new DOMParser().parseFromString(response2, 'text/html')
      )('#mediumForm')
    )

    createEditButton(
      htmlOrder
        .querySelector('li#fav_artists')
        ?.textContent?.trim()
        .toLowerCase() || 'favorite artists',
      'fav_music'
    )
    createEditButton(
      htmlOrder
        .querySelector('li#other_comments')
        ?.textContent?.trim()
        .toLowerCase() || 'other comments',
      'comments'
    )
  }
}

void main()
