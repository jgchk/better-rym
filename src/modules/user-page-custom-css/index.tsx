import 'highlight.js/styles/github-dark.css'

import hljs from 'highlight.js/lib/core'
import css from 'highlight.js/lib/languages/css'

import { waitForElement } from '../../common/utils/dom'
import { fetch } from '../../common/utils/fetch'
import classes from './styles.module.css'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN not found!')

const BUTTON_CLASSES = 'btn btn_small flat_btn'

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

const setupOwnUserPage = (username: string, initialUserStyle: string) => {
  hljs.registerLanguage('css', css)

  const header = document.querySelector('.profile_header')
  if (!header) throw new Error('No header found on the user page!')

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
          Authorization: `Bearer ${GITHUB_TOKEN}`,
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
  return fetch({
    url: `https://api.github.com/repos/jgchk/better-rym-user-themes/contents/${username}.css`,
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.raw+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
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
    setupOwnUserPage(username, userStyle)
  }
}

void main()
