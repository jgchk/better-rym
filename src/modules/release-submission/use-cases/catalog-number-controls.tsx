import { render } from 'preact'
import { useCallback } from 'preact/hooks'

import { waitForElement } from '~/common/utils/dom'

export default async function injectCatalogNumberControls() {
  const catNoInput = await waitForElement('#catalog_no')
  const container = document.createElement('span')
  catNoInput.after(container)
  render(<CatalogNumber />, container)
}

function CatalogNumber() {
  const handleClearClick = useCallback(() => {
    const input = document.querySelector<HTMLInputElement>('input#catalog_no')
    if (input) input.value = ''
  }, [])

  const handleNAClick = useCallback(() => {
    const input = document.querySelector<HTMLInputElement>('input#catalog_no')
    if (input) input.value = 'n/a'
  }, [])

  return (
    <div style={{ marginTop: '0.25em' }}>
      <input
        type='button'
        className='btn blue_btn'
        value='Clear'
        onClick={handleClearClick}
        style={{ fontSize: '14px !important' }}
      />
      <input
        type='button'
        className='btn'
        value='+ n/a'
        onClick={handleNAClick}
        style={{ fontSize: '14px !important' }}
      />
    </div>
  )
}
