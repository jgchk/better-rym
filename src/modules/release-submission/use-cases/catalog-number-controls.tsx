import { render } from 'preact'
import { useCallback } from 'preact/hooks'
import { waitForElement } from '~/common/utils/dom'
import classes from '../styles/buttons.module.css'
import { clsx } from '~/common/utils/clsx'

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
    <div className={classes.labelContainer}>
      <input
        type='button'
        className={clsx('btn blue_btn', classes.smallButton)}
        value='Clear'
        onClick={handleClearClick}
      />
      <input
        type='button'
        className={clsx('btn', classes.smallButton)}
        value='+ n/a'
        onClick={handleNAClick}
      />
    </div>
  )
}
