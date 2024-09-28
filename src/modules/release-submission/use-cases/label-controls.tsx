import { render } from 'preact'
import { useCallback } from 'preact/hooks'
import { clsx } from '~/common/utils/clsx'
import { waitForElement } from '~/common/utils/dom'
import { goInfobox } from '../utils/page-functions'
import classes from '../styles/buttons.module.css'

export default async function injectLabelControls() {
  const clearButton = await waitForElement('input[value=Clear]')
  const container = document.createElement('span')
  clearButton.after(container)
  clearButton.remove()
  render(<Label />, container)
}

function Label() {
  const handleClearClick = useCallback(() => {
    const label = document.querySelector<HTMLInputElement>('input#label')
    if (label) label.value = '0'

    const labeltext = document.querySelector('#labeltext')
    if (labeltext)
      labeltext.innerHTML =
        '<span class="smallgray"> (Use search box on right to choose label )</span>'
  }, [])

  const handleNoLabelClick = useCallback(() => {
    goInfobox(897)

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
        value='+ (No Label)'
        onClick={handleNoLabelClick}
      />
    </div>
  )
}
