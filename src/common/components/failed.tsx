import { FunctionComponent, h, JSX } from 'preact'
import { createPortal } from 'preact/compat'
import { useState } from 'preact/hooks'

import XIcon from '../icons/x'

export function Failed({
  error,
  className,
  ...properties
}: { error: Error; className?: string; style?: JSX.CSSProperties } & Omit<
  JSX.SVGAttributes<SVGSVGElement>,
  'className' | 'style'
>) {
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
        className={className}
        {...properties}
        style={{
          ...properties.style,
          color: 'var(--gen-text-red)',
        }}
      />
      {showTip &&
        createPortal(
          <div
            style={{
              left: pos.x,
              top: pos.y,
              position: 'absolute',
              maxWidth: '20vw',
              padding: 4,
              color: 'var(--mono-6)',
              wordWrap: 'break-word',
              background: 'var(--mono-f8)',
              border: '1px var(--mono-d) solid',
              transform: 'translate(-50%, -150%)',
              pointerEvents: 'none',
            }}
          >
            {error.message}
          </div>,
          document.body,
        )}
    </>
  )
}
