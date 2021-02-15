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

type ServiceState = OneShot<Option<string>>

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
        (maybeLink) => task.of({ type: 'complete', data: maybeLink })
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
          (link) => setState({ type: 'complete', data: of(link) })
        )
      )
    }
  })

  return (
    <Switch>
      <Match when={asInitial(state)}>
        <div>{service}: initial</div>
      </Match>
      <Match when={asLoading(state)}>
        <div>{service}: loading</div>
      </Match>
      <Match when={asComplete(state)}>
        {({ data }) => (
          <Switch>
            <Match when={asSome(data)}>
              {({ value }) => (
                <div>
                  <a href={value} target='_blank' rel='noreferrer'>
                    {service}: complete
                  </a>
                </div>
              )}
            </Match>
            <Match when={asNone(data)}>
              <div>{service}: complete</div>
            </Match>
          </Switch>
        )}
      </Match>
      <Match when={asFailed(state)}>
        <div>{service}: failed</div>
      </Match>
    </Switch>
  )
}

export default ServiceLink
