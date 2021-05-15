import { FunctionComponent, JSX, h } from 'preact'
import { createPortal } from 'preact/compat'
import { useState } from 'preact/hooks'
import Icon from '../../../res/x.svg'
import styles from '../styles/failed.module.css'
import { clsx } from '../utils/clsx'

export const Failed: FunctionComponent<
  { error: Error } & JSX.SVGAttributes<SVGSVGElement>
> = ({ error, className, ...properties }) => {
  const [showTip, setShowTip] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  return (
    <>
      <Icon
        onMouseOver={() => setShowTip(true)}
        onMouseOut={() => setShowTip(false)}
        onMouseMove={(event) => setPos({ x: event.pageX, y: event.pageY })}
        className={clsx(styles.failed, className)}
        {...properties}
      />
      {showTip &&
        createPortal(
          <div className={styles.tooltip} style={{ left: pos.x, top: pos.y }}>
            {error.message}
          </div>,
          document.body
        )}
    </>
  )
}
