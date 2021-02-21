import clsx from 'clsx'
import { FunctionComponent, JSX, h } from 'preact'
import Icon from '../../../res/loader.svg'
import styles from '../styles/loader.module.css'

export const Loader: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = ({
  className,
  ...properties
}) => <Icon className={clsx(styles.loader, className)} {...properties} />
