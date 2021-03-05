import { pipe } from 'fp-ts/function'
import { VNode, h } from 'preact'
import { ServiceId } from '../services'
import styles from '../styles/status-form.module.css'
import { OneShot, fold } from '../utils/one-shot'
import { Complete } from './complete'
import { Failed } from './failed'
import { Form } from './form'
import { Loader } from './loader'

export type Properties<E extends Error, T> = {
  data: OneShot<E, T>
  onSubmit: (
    url: string,
    serviceId: ServiceId,
    autoCapitalize: boolean
  ) => Promise<void>
  submitText?: string
  showAutoCapitalize?: boolean
}

export const StatusForm = <E extends Error, T>({
  data,
  onSubmit,
  submitText = 'Submit',
  showAutoCapitalize = false,
}: Properties<E, T>): VNode => (
  <div className={styles.container}>
    <Form
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
