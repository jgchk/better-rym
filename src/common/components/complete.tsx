import { FunctionComponent, h, JSX } from 'preact'

import CheckIcon from '../icons/check'
import styles from '../styles/complete.module.css'
import { clsx } from '../utils/clsx'

export const Complete: FunctionComponent<
  Omit<JSX.SVGAttributes<SVGSVGElement>, 'className'> & { className?: string }
> = ({ className, ...properties }) => (
  <CheckIcon className={clsx(styles.complete, className)} {...properties} />
)
