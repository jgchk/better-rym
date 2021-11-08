import { FunctionComponent, h } from 'preact'
import { useCallback } from 'preact/hooks'

import { clsx } from '../../common/utils/clsx'
import classes from '../styles/buttons.module.css'
import { goInfobox } from '../utils/page-functions'

export const Label: FunctionComponent = () => {
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
    <div className={classes['label-container']}>
      <input
        type='button'
        className={clsx('btn blue_btn', classes['small-button'])}
        value='Clear'
        onClick={handleClearClick}
      />
      <input
        type='button'
        className={clsx('btn', classes['small-button'])}
        value='+ (No Label)'
        onClick={handleNoLabelClick}
      />
    </div>
  )
}
