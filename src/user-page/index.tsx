import { h, render } from 'preact'
import { Loader } from '../common/components/loader'
import { forceQuerySelector, waitForElement } from '../common/utils/dom'
import { fetch } from '../common/utils/fetch'
import { parseMarkup } from '../common/utils/markup'
import { isNull, isUndefined } from '../common/utils/types'

let headerArray = new Array<Element>()
let currentPreferences: Document

const EDIT_STYLE =
  'vertical-align: middle; bottom: 0.3em; position: relative; margin-right: 1em; font-size: .6em'
const OTHER_STYLE =
  'vertical-align: middle; position: relative; margin-right: 1em; top: 75%; transform: translateY(-50%)'

const getHeader = (alias: string) => {
  const header = headerArray.find((element) =>
    element.textContent?.includes(alias)
  )
  if (isUndefined(header))
    throw "Couldn't find the requested header with alias " + alias
  return header as HTMLDivElement
}

const getCorrespondingContent = (header: HTMLDivElement) => {
  const content = [...document.querySelectorAll('.bubble_content')][
    headerArray.indexOf(header)
  ]
  if (isUndefined(content))
    throw "Couldn't find the content corresponding to the specified header!"
  return content as HTMLDivElement
}

const createEditButton = (alias: string, field: string) => {
  const edit = document.createElement('a')
  edit.href = 'javascript:void(0)'
  edit.className = 'btn btn_small flat_btn'
  edit.textContent = 'edit'
  edit.style.cssText = EDIT_STYLE
  edit.dataset['alias'] = alias
  edit.dataset['field'] = field
  edit.addEventListener('click', editClick)
  return edit
}

const editClick = (event: MouseEvent) => {
  const button = event.target as HTMLAnchorElement
  if (
    button.style.display != 'none' &&
    !isUndefined(button.dataset['alias']) &&
    !isUndefined(button.dataset['field'])
  ) {
    button.style.display = 'none'

    const contentBox = forceQuerySelector(
      getCorrespondingContent(getHeader(button.dataset['alias']))
    )('div')
    forceQuerySelector<HTMLSpanElement>(contentBox)(
      '.rendered_text'
    ).outerHTML = ''

    const contentText = document.createElement('textarea')
    contentText.textContent = getParameter(`#${button.dataset['field']}`)
    contentText.style.resize = 'vertical'
    contentText.rows = 6

    const contentButtons = document.createElement('div')
    render(
      <div style='text-align: right; height: 2em'>
        <a
          href='javascript:void(0)'
          className='btn btn_small flat_btn brym_save'
          style={OTHER_STYLE}
          onClick={saveClick}
          data-alias={button.dataset['alias']}
          data-field={button.dataset['field']}
        >
          save
        </a>
        <a
          href='javascript:void(0)'
          className='btn btn_small flat_btn brym_preview'
          style={OTHER_STYLE}
          onClick={previewClick}
          data-alias={button.dataset['alias']}
          data-field={button.dataset['field']}
        >
          preview
        </a>
        <a
          href='javascript:void(0)'
          className='btn btn_small flat_btn brym_cancel'
          style={OTHER_STYLE}
          onClick={cancelClick}
          data-alias={button.dataset['alias']}
          data-field={button.dataset['field']}
        >
          cancel
        </a>
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
    !isUndefined(button.dataset['alias']) &&
    !isUndefined(button.dataset['field']) &&
    button.style.cursor != 'default'
  ) {
    const container = getCorrespondingContent(
      getHeader(button.dataset['alias'])
    )
    if (isNull(container.querySelector('svg[class*="loader"]')))
      lockAndLoad(button)

    forceQuerySelector<HTMLTextAreaElement>(currentPreferences)(
      `#${button.dataset['field']}`
    ).value = container.querySelector('textarea')?.value || ''

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    void updateProfile().then((_value) => {
      closeUpShop(button)
    })
  }
}

const previewClick = (event: MouseEvent) => {
  const button = event.target as HTMLAnchorElement
  if (
    !isUndefined(button.dataset['alias']) &&
    !isUndefined(button.dataset['field']) &&
    button.style.cursor != 'default'
  ) {
    const container = forceQuerySelector(
      getCorrespondingContent(getHeader(button.dataset['alias']))
    )('div')
    if (isNull(container.querySelector('svg[class*="loader"]')))
      lockAndLoad(button)

    const existing = container.querySelector('.rendered_text')
    if (!isNull(existing)) existing.outerHTML = ''

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
  if (
    !isUndefined(button.dataset['alias']) &&
    !isUndefined(button.dataset['field'])
  ) {
    const container = getCorrespondingContent(
      getHeader(button.dataset['alias'])
    )
    const field = button.dataset['field']
    if (isNull(container.querySelector('svg[class*="loader"]')))
      lockAndLoad(button)

    void parseMarkup(
      forceQuerySelector<HTMLTextAreaElement>(currentPreferences)(`#${field}`)
        .value || ''
    ).then((value) => {
      container.innerHTML = `<div style="padding:14px;">${value.outerHTML}</div><div class="clear"></div>`
      forceQuerySelector<HTMLElement>(document)(
        `.bubble_header a[data-field=${field}]`
      ).style.display = 'inline-block'
    })
  }
}

const lockAndLoad = (button: HTMLAnchorElement) => {
  if (
    isNull(button.parentElement) ||
    isUndefined(button.parentElement.children)
  )
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
  if (
    isNull(button.parentElement) ||
    isUndefined(button.parentElement.children)
  )
    throw 'Unexpected null or undefined'

  for (const element of button.parentElement.children) {
    const anchor = element as HTMLElement
    anchor.style.color = ''
    anchor.style.background = ''
    anchor.style.cursor = ''
  }
}

const getParameter = (query: string): string => {
  const parameter = forceQuerySelector(currentPreferences)(query) as
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
  const result = parameter.value
  if (isNull(result)) throw 'Result was null'
  return result
}

const updateProfile = async () => {
  const artist_convert = forceQuerySelector<HTMLInputElement>(
    currentPreferences
  )('#artist_convert').checked
    ? 't'
    : 'f'

  await fetch({
    url: 'https://rateyourmusic.com/account/profile_edit_2',
    method: 'POST',
    urlParameters: {
      username: getParameter('input[name="username"]'),
      token: getParameter('input[name="token"]'),
      language: getParameter('select[name="language"]'),
      firstname: getParameter('#firstname'),
      lastname: getParameter('#lastname'),
      month: getParameter('#month'),
      day: getParameter('#day'),
      year: getParameter('#year'),
      sex: getParameter('#sex'),
      gender_label: getParameter('#gender_label'),
      city: getParameter('#city'),
      state: getParameter('#state'),
      country: getParameter('#country'),
      location: getParameter('#location'),
      tz: getParameter('select[name="tz"]'),
      email: getParameter('#email'),
      password_confirm: getParameter('#password_confirm'),
      homepage: getParameter('#homepage'),
      fav_music: getParameter('#fav_music'),
      artist_convert: artist_convert,
      comments: getParameter('#comments'),
    },
  })
}

const main = async () => {
  // look for the element that always appears on your user page, but never on others
  const key = await waitForElement('.profile_set_listening_btn a')

  if (!isNull(key)) {
    headerArray = [...document.querySelectorAll('.bubble_header')]

    const response = await fetch({
      url: 'https://rateyourmusic.com/account/order',
    })
    const htmlOrder = new DOMParser().parseFromString(response, 'text/html')

    const response2 = await fetch({
      url: 'https://rateyourmusic.com/account/profile_edit',
    })
    currentPreferences = new DOMParser().parseFromString(response2, 'text/html')

    const aliasFavArtists =
      htmlOrder
        .querySelector('li#fav_artists')
        ?.textContent?.trim()
        .toLowerCase() || 'favorite artists'
    getHeader(aliasFavArtists)?.prepend(
      createEditButton(aliasFavArtists, 'fav_music')
    )

    const aliasOtherComments =
      htmlOrder
        .querySelector('li#other_comments')
        ?.textContent?.trim()
        .toLowerCase() || 'other comments'
    getHeader(aliasOtherComments)?.prepend(
      createEditButton(aliasOtherComments, 'comments')
    )
  }
}

void main()
