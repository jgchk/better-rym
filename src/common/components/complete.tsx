import clsx from 'clsx'
import { FunctionComponent, JSX, h } from 'preact'
import Icon from '../../../res/check.svg'
import styles from '../styles/complete.module.css'

export const Complete: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = ({
  className,
  ...properties
}) => <Icon className={clsx(styles.complete, className)} {...properties} />
