import { pipe } from 'fp-ts/function'
import { VNode, h } from 'preact'
import { Service } from '../services/types'
import styles from '../styles/status-form.module.css'
import { OneShot, fold } from '../utils/one-shot'
import { Complete } from './complete'
import { Failed } from './failed'
import { Form } from './form'
import { Loader } from './loader'

export type Properties<E extends Error, T, S extends Service> = {
  data: OneShot<E, T>
  services: S[]
  onSubmit: (
    url: string,
    service: S,
    autoCapitalize: boolean
  ) => void | Promise<void>
  submitText?: string
  showAutoCapitalize?: boolean
}

export const StatusForm = <E extends Error, T, S extends Service>({
  data,
  services,
  onSubmit,
  submitText = 'Submit',
  showAutoCapitalize = false,
}: Properties<E, T, S>): VNode => (
  <div className={styles.container}>
    <Form
      services={services}
      submitText={submitText}
      onSubmit={onSubmit}
      showAutoCapitalize={showAutoCapitalize}
    />
    {pipe(
      data,
      fold(
        () => null,
        () => <Loader />,
        (error) => <Failed error={error} />,
        () => <Complete />
      )
    )}
  </div>
)
