// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, render } from 'preact'
import { forceQuerySelector, waitForElement } from '../common/utils/dom'
import { fetch } from '../common/utils/fetch'
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
  return header
}

const getCorrespondingContent = (header: Element) => {
  const content = [...document.querySelectorAll('.bubble_content')][
    headerArray.indexOf(header)
  ]
  if (isUndefined(content))
    throw "Couldn't find the content corresponding to the specified header!"
  return content
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
    !button.hidden &&
    !isUndefined(button.dataset['alias']) &&
    !isUndefined(button.dataset['field'])
  ) {
    button.hidden = true

    const contentBox = forceQuerySelector(
      getCorrespondingContent(getHeader(button.dataset['alias']))
    )('div')
    const contentRendered = forceQuerySelector<HTMLSpanElement>(contentBox)(
      '.rendered_text'
    )
    const contentBackup = contentRendered.cloneNode(true) as HTMLSpanElement
    contentBackup.className = 'brym-backup'
    contentBackup.hidden = true
    contentRendered.hidden = true
    contentBox?.prepend(contentBackup)

    const contentText = document.createElement('textarea')
    contentText.textContent = forceQuerySelector(currentPreferences)(
      `#${button.dataset['field']}`
    ).textContent
    contentText.rows = 5

    const contentButtons = document.createElement('div')
    render(
      <div style='text-align: right; height: 2em'>
        <a
          href='javascript:void(0)'
          className='btn btn_small flat_btn brym_save'
          style={OTHER_STYLE}
          onClick={saveClick}
        >
          save
        </a>
        <a
          href='javascript:void(0)'
          className='btn btn_small flat_btn brym_preview'
          style={OTHER_STYLE}
        >
          preview
        </a>
        <a
          href='javascript:void(0)'
          className='btn btn_small flat_btn brym_cancel'
          style={OTHER_STYLE}
          onClick={closeUpShop}
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
  closeUpShop(event)
}

const closeUpShop = (event: MouseEvent) => {
  const button = event.target as HTMLAnchorElement
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
    const headerFavArtists = getHeader(aliasFavArtists)
    const buttonFavArtists = createEditButton(aliasFavArtists, 'fav_music')
    headerFavArtists?.prepend(buttonFavArtists)

    const aliasOtherComments =
      htmlOrder
        .querySelector('li#other_comments')
        ?.textContent?.trim()
        .toLowerCase() || 'other comments'
    const headerOtherComments = getHeader(aliasOtherComments)
    const buttonOtherComments = createEditButton(aliasOtherComments, 'comments')
    headerOtherComments?.prepend(buttonOtherComments)
  }
}

void main()
