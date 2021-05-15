import { FunctionComponent, JSX, h } from 'preact'
import Icon from '../../../res/loader.svg'
import styles from '../styles/loader.module.css'
import { clsx } from '../utils/clsx'

export const Loader: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = ({
  className,
  ...properties
}) => <Icon className={clsx(styles.loader, className)} {...properties} />
