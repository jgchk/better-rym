import { FunctionComponent, h, JSX } from 'preact'

import Icon from '../../../res/svg/loader.svg'
import styles from '../styles/loader.module.css'
import { ClassValue, clsx } from '../utils/clsx'

export const Loader: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = ({
  className,
  ...properties
}) => <Icon className={clsx(styles.loader, className as ClassValue)} {...properties} />
