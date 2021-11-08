import { FunctionComponent, h } from 'preact'
import { useCallback } from 'preact/hooks'

import { clsx } from '../../common/utils/clsx'
import classes from '../styles/buttons.module.css'

export const CatalogNumber: FunctionComponent = () => {
  const handleClearClick = useCallback(() => {
    const input = document.querySelector<HTMLInputElement>('input#catalog_no')
    if (input) input.value = ''
  }, [])

  const handleNAClick = useCallback(() => {
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
        value='+ n/a'
        onClick={handleNAClick}
      />
    </div>
  )
}
