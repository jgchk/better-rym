import { FunctionComponent, h, JSX } from 'preact'

import Icon from '../../../res/svg/check.svg'
import styles from '../styles/complete.module.css'
import { ClassValue, clsx } from '../utils/clsx'

export const Complete: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = ({
  className,
  ...properties
}) => <Icon className={clsx(styles.complete, className as ClassValue)} {...properties} />
