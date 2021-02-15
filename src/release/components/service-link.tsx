import { pipe } from 'fp-ts/function'
import { task } from 'fp-ts/lib/Task'
import { Option, fold as foldO, of } from 'fp-ts/Option'
import { fold as foldTE } from 'fp-ts/TaskEither'
import { Component, Match, Switch, createEffect, createState } from 'solid-js'
import { asNone, asSome } from '../../common/utils/fp-ts'
import {
  OneShot,
  asComplete,
  asFailed,
  asInitial,
  asLoading,
} from '../../common/utils/one-shot'
import { PageDataState } from '../hooks/use-metadata'
import { SearchFunction, Service } from '../services'
import { Metadata } from '../utils/page-data'
import Icon from './icon'

type ServiceState = OneShot<{ searched: boolean; link: Option<string> }>

const ServiceLink: Component<{
  service: Service
  pageData: PageDataState
  search: SearchFunction
}> = ({ service, pageData, search }) => {
  const [state, setState] = createState<ServiceState>({ type: 'initial' })

  const fetch = async (metadata: Metadata) => {
    setState({ type: 'loading' })
    const nextState = await pipe(
      search(metadata),
      foldTE<Error, Option<string>, ServiceState>(
        (error) => task.of({ type: 'failed', error }),
        (maybeLink) =>
          task.of({
            type: 'complete',
            data: { searched: true, link: maybeLink },
          })
      )
    )()
    setState(nextState)
  }

  createEffect(() => {
    if (pageData.type === 'complete') {
      pipe(
        pageData.data.links[service],
        foldO(
          () => void fetch(pageData.data.metadata),
          (link) =>
            setState({
              type: 'complete',
              data: { searched: false, link: of(link) },
            })
        )
      )
    }
  })

  return (
    <Switch>
      <Match when={asInitial(state)}>
        <Icon service={service} state='initial' />
      </Match>
      <Match when={asLoading(state)}>
        <Icon service={service} state='loading' />
      </Match>
      <Match when={asComplete(state)}>
        {({ data: { searched, link } }) => (
          <Switch>
            <Match when={asSome(link)}>
              {({ value }) => (
                <a href={value} target='_blank' rel='noreferrer'>
                  <Icon
                    service={service}
                    state={searched ? 'searched' : 'existing'}
                  />
                </a>
              )}
            </Match>
            <Match when={asNone(link)}>
              <Icon service={service} state='initial' />
            </Match>
          </Switch>
        )}
      </Match>
      <Match when={asFailed(state)}>
        <Icon service={service} state='failed' />
      </Match>
    </Switch>
  )
}

export default ServiceLink
