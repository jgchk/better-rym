import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { Searchable, Service } from '../../common/services/types'
import {
  OneShot,
  complete,
  failed,
  initial,
  isComplete,
  isFailed,
  isLoading,
  loading,
} from '../../common/utils/one-shot'
import { PageDataState } from '../hooks/use-page-data'
import { Icon } from './icon'

export type ServiceLinkState = OneShot<Error, ServiceLinkCompleteState>
type ServiceLinkCompleteState =
  | { _tag: 'exists' | 'found'; url: string }
  | { _tag: 'not-found' }

export const ServiceLink: FunctionComponent<{
  service: Service & Searchable
  pageData: PageDataState
}> = ({ service, pageData }) => {
  const [state, setState] = useState<ServiceLinkState>(initial)

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
          } catch (error) {
            setState(failed(error))
          }
        } else {
          setState(complete({ _tag: 'exists', url: existingLink }))
        }
      }
    })()
  }, [pageData, service])

  const renderIcon = useCallback(
    () => <Icon service={service} state={state} />,
    [service, state]
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
