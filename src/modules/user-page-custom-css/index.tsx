import { waitForElement } from '../../common/utils/dom'

const BUTTON_CLASSES = 'btn btn_small flat_btn'

const main = async () => {
  // look for the element that always appears on your user page, but never on others
  const key = await waitForElement('.profile_set_listening_btn a')
  const isOwnUserPage = key !== null

  if (!isOwnUserPage) return

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
    console.log({ headerContent })
    if (!headerContent)
      throw new Error('No header content found on the user page!')

    let style: HTMLStyleElement | null = null

    const editorContainer = document.createElement('div')

    const editor = document.createElement('textarea')
    editor.style.width = '100%'
    editor.style.height = '100px'
    editor.style.display = 'block'
    editorContainer.append(editor)

    const buttonRow = document.createElement('div')
    buttonRow.style.display = 'flex'
    buttonRow.style.justifyContent = 'flex-end'

    const previewBtn = document.createElement('button')
    previewBtn.className = BUTTON_CLASSES
    previewBtn.textContent = 'preview'
    previewBtn.addEventListener('click', () => {
      if (!style) {
        style = document.createElement('style')
        document.head.append(style)
      }
      style.textContent = editor.value
    })

    const cancelBtn = document.createElement('button')
    cancelBtn.className = BUTTON_CLASSES
    cancelBtn.textContent = 'cancel'
    cancelBtn.addEventListener('click', () => {
      editorContainer.remove()
      style?.remove()
      style = null
    })

    buttonRow.append(previewBtn)
    buttonRow.append(cancelBtn)

    editorContainer.append(buttonRow)

    headerContent.prepend(editorContainer)
  })
}

void main()
