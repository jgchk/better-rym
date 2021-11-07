import '../styles/buttons.css'

import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { clsx } from '../../common/utils/clsx'
import classes from '../styles/buttons.module.css'
import { goInfobox } from '../utils/page-functions'

export const NoLabel: FunctionComponent = () => {
  const [catalogNumberInput, setCatalogNumberInput] =
    useState<HTMLInputElement>()
  useEffect(() => {
    const element = document.querySelector<HTMLInputElement>('input#catalog_no')
    setCatalogNumberInput(element ?? undefined)
  }, [])

  const handleClick = useCallback(() => {
    goInfobox(897)
    if (catalogNumberInput !== undefined) {
      catalogNumberInput.value = 'n/a'
    }
  }, [catalogNumberInput])

  return (
    <input
      type='button'
      className={clsx('btn', classes['small-button'])}
      value='(No Label)'
      onClick={handleClick}
    />
  )
}
