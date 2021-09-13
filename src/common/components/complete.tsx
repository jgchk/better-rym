import { FunctionComponent, h, JSX } from 'preact'

import Icon from '../../../res/check.svg'
import styles from '../styles/complete.module.css'
import { clsx } from '../utils/clsx'

export const Complete: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = ({
  className,
  ...properties
}) => <Icon className={clsx(styles.complete, className)} {...properties} />
