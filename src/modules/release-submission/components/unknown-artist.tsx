import { FunctionComponent, h } from 'preact'
import { useCallback } from 'preact/hooks'

import { clsx } from '../../../common/utils/clsx'
import classes from '../styles/buttons.module.css'
import { selectShortcut } from '../utils/page-functions'

export const UnknownArtist: FunctionComponent<{ target: string }> = ({
  target,
}) => {
  const handleClick = useCallback(
    () => selectShortcut('a', 250_714, '[unknown artist]', target),
    [target]
  )

  return (
    <input
      type='button'
      className={clsx('btn', classes.smallButton)}
      value='+ [unknown artist]'
      onClick={handleClick}
    />
  )
}
