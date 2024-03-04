import 'highlight.js/styles/github-dark.css'

import hljs from 'highlight.js/lib/core'
import css from 'highlight.js/lib/languages/css'

import { forceQuerySelector, waitForElement } from '../../common/utils/dom'
import { fetch } from '../../common/utils/fetch'
import * as storage from '../../common/utils/storage'
import classes from './styles.module.css'

const BUTTON_CLASSES = 'btn btn_small flat_btn'

type Dictionary = { [index: string]: string }

const updateProfile = async (profileData: FormData) => {
  const entries: Dictionary = {}
  for (const [k, v] of profileData) {
    entries[k] = v as string
  }

  await fetch({
    url: 'https://rateyourmusic.com/account/profile_edit_2',
    method: 'POST',
    urlParameters: entries,
  })
}

// Add token to favorite artists if available
// If favorite artists is not available, add to other comments
// If other comments is not available, turn on other comments and then add

const addTokenToProfile = async (token: string) => {
  console.log('1')
  const response2 = await fetch({
    url: 'https://rateyourmusic.com/account/profile_edit',
  })
  console.log('2')
  const profileData = new FormData(
    forceQuerySelector<HTMLFormElement>(
      new DOMParser().parseFromString(response2, 'text/html')
    )('#mediumForm')
  )

  const favArtists = profileData.get('fav_music')?.toString() ?? ''
  profileData.set('fav_music', `${favArtists}\n${token}`)

  await updateProfile(profileData)
}

const verifyAccount = async (username: string) => {
  const registerResponse = await fetch({
    url: `https://better-rym-server.vercel.app/api/register`,
    method: 'POST',
    body: { username },
  })
  const registerJson = JSON.parse(registerResponse) as
    | { error: true; message: string }
    | { success: true; message: string; data: { publicToken: string } }
  if ('error' in registerJson) {
    throw new Error(registerJson.message)
  }
  const publicToken = registerJson.data.publicToken

  await addTokenToProfile(publicToken)

  const verifyResponse = await fetch({
    url: `https://better-rym-server.vercel.app/api/verify`,
    method: 'POST',
    body: { username },
  })
  const verifyJson = JSON.parse(verifyResponse) as
    | { error: true; message: string }
    | { success: true; message: string; data: { privateToken: string } }
  if ('error' in verifyJson) {
    throw new Error(verifyJson.message)
  }
  const privateToken = verifyJson.data.privateToken
  await storage.set('private-token', privateToken)
}

let styleEl: HTMLStyleElement | null = null
const applyStyle = (styleText: string | null) => {
  if (styleText) {
    if (!styleEl) {
      styleEl = document.createElement('style')
      document.head.append(styleEl)
    }
    styleEl.textContent = styleText
  } else {
    styleEl?.remove()
    styleEl = null
  }
}

const setupOwnUserPage = async (username: string, initialUserStyle: string) => {
  hljs.registerLanguage('css', css)

  const header = document.querySelector('.profile_header')
  if (!header) throw new Error('No header found on the user page!')

  const isVerified = await storage.get('private-token')
  console.log({ isVerified })
  if (!isVerified) {
    const verifyBtn = document.createElement('button')
    verifyBtn.className = BUTTON_CLASSES
    verifyBtn.textContent = 'verify'

    verifyBtn.addEventListener('click', () => {
      void verifyAccount(username).then(() => console.log('VERIFIED NERD'))
    })
    header.append(verifyBtn)
  }

  const editBtn = document.createElement('button')
  editBtn.className = BUTTON_CLASSES
  editBtn.style.bottom = '0.3em'
  editBtn.style.fontSize = '.6em'
  editBtn.textContent = 'edit'
  header.append(editBtn)

  editBtn.addEventListener('click', () => {
    const headerContent = document.querySelector('.bubble_content')
    if (!headerContent)
      throw new Error('No header content found on the user page!')

    const wrapper = document.createElement('div')
    wrapper.style.padding = '14px'

    const editorContainer = document.createElement('div')
    editorContainer.style.position = 'relative'
    editorContainer.style.width = '100%'
    editorContainer.style.height = '150px'
    const editorPre = document.createElement('pre')
    editorPre.className = classes.highlighting ?? ''
    editorPre.ariaHidden = 'true'
    const editorCode = document.createElement('code')
    editorCode.className = 'language-css'
    editorPre.append(editorCode)
    editorContainer.append(editorPre)
    wrapper.append(editorContainer)

    const hiddenTextarea = document.createElement('textarea')
    hiddenTextarea.className = classes.editing ?? ''
    hiddenTextarea.spellcheck = false

    const syncScroll = () => {
      editorPre.scrollTop = hiddenTextarea.scrollTop
      editorPre.scrollLeft = hiddenTextarea.scrollLeft
    }

    const updateText = (text: string) => {
      // Handle final newlines
      if (text[text.length - 1] == '\n') {
        // If the last character is a newline character
        text += ' ' // Add a placeholder space character to the final line
      }
      editorCode.textContent = text

      delete editorCode.dataset.highlighted
      hljs.highlightElement(editorCode)
    }

    hiddenTextarea.addEventListener('input', (e) => {
      updateText((e.currentTarget as HTMLTextAreaElement).value)
      syncScroll()
    })
    hiddenTextarea.addEventListener('scroll', syncScroll)

    hiddenTextarea.addEventListener('keydown', (e) => {
      const code = hiddenTextarea.value
      if (e.key == 'Tab') {
        /* Tab key pressed */
        e.preventDefault() // stop normal
        const before_tab = code.slice(0, hiddenTextarea.selectionStart) // text before tab
        const after_tab = code.slice(
          hiddenTextarea.selectionEnd,
          hiddenTextarea.value.length
        ) // text after tab
        const cursor_pos = hiddenTextarea.selectionEnd + 1 // where cursor moves after tab - moving forward by 1 char to after tab
        hiddenTextarea.value = before_tab + '\t' + after_tab // add tab char
        // move cursor
        hiddenTextarea.selectionStart = cursor_pos
        hiddenTextarea.selectionEnd = cursor_pos
        updateText(hiddenTextarea.value) // Update text to include indent
      }
    })

    const observer = new ResizeObserver(() => {
      editorContainer.style.height = `${hiddenTextarea.offsetHeight}px`
    })
    observer.observe(hiddenTextarea)

    editorContainer.append(hiddenTextarea)

    const buttonRow = document.createElement('div')
    buttonRow.style.display = 'flex'
    buttonRow.style.justifyContent = 'flex-end'
    buttonRow.style.gap = '4px'
    buttonRow.style.marginTop = '8px'

    const saveStyle = async () => {
      const styleText = editorPre.textContent
      if (!styleText) return // TODO: delete file in github

      await fetch({
        url: `https://api.github.com/repos/jgchk/better-rym-user-themes/contents/${username}.css`,
        method: 'PUT',
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: {
          message: `Update ${username}.css`,
          content: window.btoa(styleText),
        },
      })
    }

    const saveBtn = document.createElement('button')
    saveBtn.className = BUTTON_CLASSES
    saveBtn.textContent = 'save'
    saveBtn.addEventListener('click', () => {
      applyStyle(editorPre.textContent)
      void saveStyle()
    })

    const previewBtn = document.createElement('button')
    previewBtn.className = BUTTON_CLASSES
    previewBtn.textContent = 'preview'
    previewBtn.addEventListener('click', () =>
      applyStyle(editorPre.textContent)
    )

    const cancelBtn = document.createElement('button')
    cancelBtn.className = BUTTON_CLASSES
    cancelBtn.textContent = 'cancel'
    cancelBtn.addEventListener('click', () => {
      wrapper.remove()
      styleEl?.remove()
      styleEl = null
      observer.disconnect()
    })

    buttonRow.append(saveBtn)
    buttonRow.append(previewBtn)
    buttonRow.append(cancelBtn)

    wrapper.append(buttonRow)

    headerContent.prepend(wrapper)

    hiddenTextarea.value = initialUserStyle
    updateText(initialUserStyle)
  })
}

const fetchUserStyle = async (username: string) => {
  const res = await fetch({
    url: `https://better-rym-server.vercel.app/api/themes/${username}`,
    method: 'GET',
  })

  const json = JSON.parse(res) as
    | { error: true; message: string }
    | { success: true; message: string; data: { theme: string } }

  if ('error' in json) {
    throw new Error(json.message)
  }

  return json.data.theme
}

const main = async () => {
  const usernameEl = await waitForElement('#profilename')
  const username = usernameEl?.textContent
  if (!username) throw new Error('No username found on the user page!')

  const userStyle = await fetchUserStyle(username)
  if (userStyle) {
    applyStyle(userStyle)
  }

  // look for the element that always appears on your user page, but never on others
  const key = await waitForElement('.profile_set_listening_btn a')
  const isOwnUserPage = key !== null
  if (isOwnUserPage) {
    await setupOwnUserPage(username, userStyle)
  }
}

void main()
