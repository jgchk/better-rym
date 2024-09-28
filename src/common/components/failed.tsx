import { FunctionComponent, h, JSX } from 'preact'
import { createPortal } from 'preact/compat'
import { useState } from 'preact/hooks'

import XIcon from '../icons/x'
import styles from '../styles/failed.module.css'
import { clsx } from '../utils/clsx'

export const Failed: FunctionComponent<
  { error: Error; className?: string } & Omit<
    JSX.SVGAttributes<SVGSVGElement>,
    'className'
  >
> = ({ error, className, ...properties }) => {
  const [showTip, setShowTip] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  return (
    <>
      <XIcon
        onMouseOver={() => setShowTip(true)}
        onMouseOut={() => setShowTip(false)}
        onMouseMove={(event: MouseEvent) =>
          setPos({ x: event.pageX, y: event.pageY })
        }
        className={clsx(styles.failed, className)}
        {...properties}
      />
      {showTip &&
        createPortal(
          <div className={styles.tooltip} style={{ left: pos.x, top: pos.y }}>
            {error.message}
          </div>,
          document.body,
        )}
    </>
  )
}
