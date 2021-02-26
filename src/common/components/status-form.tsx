import { pipe } from 'fp-ts/function'
import { VNode, h } from 'preact'
import { FetchFunction } from '../hooks/use-release-info'
import styles from '../styles/status-form.module.css'
import { OneShot, fold } from '../utils/one-shot'
import { Complete } from './complete'
import { Failed } from './failed'
import { Form } from './form'
import { Loader } from './loader'

export type Properties<E extends Error, T> = {
  data: OneShot<E, T>
  onSubmit: FetchFunction
  submitText?: string
}

export const StatusForm = <E extends Error, T>({
  data,
  onSubmit,
  submitText = 'Submit',
}: Properties<E, T>): VNode => (
  <div className={styles.container}>
    <Form submitText={submitText} onSubmit={onSubmit} />
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
