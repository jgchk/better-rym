// eslint-disable-next-line @typescript-eslint/no-unused-vars
//import { h } from 'preact'
import { forceQuerySelector, waitForElement } from '../common/utils/dom'
import { fetch } from '../common/utils/fetch'
import { isNull, isUndefined } from '../common/utils/types'

let headerArray = new Array<Element>()

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

const createEditButton = (alias: string) => {
  const edit = document.createElement('a')
  edit.href = 'javascript:void(0)'
  edit.className = 'btn btn_small flat_btn'
  edit.textContent = 'edit'
  edit.style.cssText =
    'font-size: .6em; vertical-align: middle; bottom: 0.3em; position: relative; margin-right: 1em'
  edit.dataset['alias'] = alias
  edit.dataset['disabled'] = 'false'
  edit.addEventListener('click', editClick)
  return edit
}

const editClick = (event: MouseEvent) => {
  const button = event.target as HTMLAnchorElement
  if (
    button.dataset['disabled'] == 'false' &&
    !isUndefined(button.dataset['alias'])
  ) {
    // ~sharifi fix your css so i don't have to do this mess
    button.dataset['disabled'] = 'true'
    button.style.background = 'var(--btn-secondary-background-disabled)'
    button.style.color = 'var(--btn-secondary-text-disabled)'
    button.style.cursor = 'default'

    const contentBox = forceQuerySelector(
      getCorrespondingContent(getHeader(button.dataset['alias']))
    )('div')
    const contentRendered = forceQuerySelector<HTMLSpanElement>(contentBox)(
      '.rendered_text'
    )
    contentRendered.hidden = true
    contentBox?.prepend('editor goes here soon:tm:')
  }
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

    const aliasFavArtists =
      htmlOrder
        .querySelector('li#fav_artists')
        ?.textContent?.trim()
        .toLowerCase() || 'favorite artists'
    const headerFavArtists = getHeader(aliasFavArtists)
    const buttonFavArtists = createEditButton(aliasFavArtists)
    headerFavArtists?.prepend(buttonFavArtists)

    const aliasOtherComments =
      htmlOrder
        .querySelector('li#other_comments')
        ?.textContent?.trim()
        .toLowerCase() || 'other comments'
    const headerOtherComments = getHeader(aliasOtherComments)
    const buttonOtherComments = createEditButton(aliasOtherComments)
    headerOtherComments?.prepend(buttonOtherComments)
  }
}

void main()
