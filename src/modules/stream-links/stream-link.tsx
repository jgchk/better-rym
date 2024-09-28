import { h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { Searchable, Service } from '../../common/services/types'
import { parseError } from '../../common/utils/error'
import {
  complete,
  failed,
  initial,
  isComplete,
  isFailed,
  isLoading,
  loading,
  OneShot,
} from '../../common/utils/one-shot'
import { PageDataState } from './use-page-data'
import { StreamLinkIcon } from './stream-link-icon'

export type StreamLinkState = OneShot<Error, StreamLinkCompleteState>
type StreamLinkCompleteState =
  | { _tag: 'exists' | 'found'; url: string }
  | { _tag: 'not-found' }

export function StreamLink({
  service,
  pageData,
}: {
  service: Service & Searchable
  pageData: PageDataState
}) {
  const [state, setState] = useState<StreamLinkState>(initial)

  useEffect(() => {
    void (async () => {
      if (isLoading(pageData)) {
        setState(loading)
      } else if (isFailed(pageData)) {
        setState(failed(pageData.error))
      } else if (isComplete(pageData)) {
        const releaseData = pageData.data
        const existingLink = releaseData.links[service.id]
        if (existingLink === undefined) {
          setState(loading)
          try {
            const foundLink = await service.search(releaseData.metadata)
            if (foundLink === undefined) {
              setState(complete({ _tag: 'not-found' }))
            } else {
              setState(complete({ _tag: 'found', url: foundLink }))
            }
          } catch (error: unknown) {
            setState(failed(parseError(error)))
          }
        } else {
          setState(complete({ _tag: 'exists', url: existingLink }))
        }
      }
    })()
  }, [pageData, service])

  const renderIcon = useCallback(
    () => <StreamLinkIcon service={service} state={state} />,
    [service, state],
  )

  // if we have a link available, wrap in an anchor element
  if (
    isComplete(state) &&
    (state.data._tag === 'exists' || state.data._tag === 'found')
  )
    return (
      <a href={state.data.url} target='_blank' rel='noreferrer'>
        {renderIcon()}
      </a>
    )

  return renderIcon()
}
