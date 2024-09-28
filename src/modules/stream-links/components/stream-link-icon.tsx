import { h } from 'preact'
import { useCallback, useState } from 'preact/hooks'

import { Failed } from '../../../common/components/failed'
import { Loader } from '../../../common/components/loader'
import { Searchable, Service } from '../../../common/services/types'
import { isComplete, isFailed, isLoading } from '../../../common/utils/one-shot'
import { StreamLinkState } from './stream-link'

export function StreamLinkIcon({
  service,
  state,
}: {
  service: Service & Searchable
  state: StreamLinkState
}) {
  const [isHovered, setIsHovered] = useState(false)

  const renderIcon = useCallback(() => {
    if (isComplete(state) && state.data._tag === 'exists') {
      return service.icon({
        style: {
          ...iconStyle,
          ...(isHovered ? fullHoverStyle : fullStyle),
        },
      })
    }

    if (isComplete(state) && state.data._tag === 'found') {
      return service.foundIcon({
        style: {
          ...iconStyle,
          ...(isHovered ? fullHoverStyle : fullStyle),
        },
      })
    }

    return service.notFoundIcon({
      style: {
        ...iconStyle,
        ...emptyStyle,
      },
    })
  }, [service, state, isHovered])

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderIcon()}
      {isLoading(state) && <Loader style={statusIconStyle} />}
      {isFailed(state) && (
        <Failed error={state.error} style={statusIconStyle} />
      )}
    </div>
  )
}

const iconStyle = {
  color: 'var(--mono-3)',
  transition: 'opacity 0.2s',
}

const fullStyle = {
  opacity: 0.8,
}

const fullHoverStyle = {
  opacity: 1,
}

const emptyStyle = {
  opacity: 0.15,
}

const statusIconStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: 16,
  height: 16,
}
