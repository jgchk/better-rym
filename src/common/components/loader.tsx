import { FunctionComponent, h, JSX } from 'preact'

import LoaderIcon from '../icons/loader'
import { useEffect } from 'preact/hooks'

export function Loader({
  className,
  ...properties
}: Omit<JSX.SVGAttributes<SVGSVGElement>, 'className' | 'style'> & {
  className?: string
  style?: JSX.CSSProperties
}) {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = keyframes
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <LoaderIcon
      className={className}
      {...properties}
      style={{
        ...properties.style,
        color: 'var(--mono-5)',
        animation: 'spin 1.5s linear infinite',
      }}
    />
  )
}

const keyframes = `
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
