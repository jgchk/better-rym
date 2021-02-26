import { pipe } from 'fp-ts/function'
import { FunctionComponent, h } from 'preact'
import { UseReleaseInfoValue } from '../hooks/use-release-info'
import styles from '../styles/status-form.module.css'
import { fold } from '../utils/one-shot'
import { Complete } from './complete'
import { Failed } from './failed'
import { Form } from './form'
import { Loader } from './loader'

export const StatusForm: FunctionComponent<
  UseReleaseInfoValue & { submitText: string }
> = ({ info, fetchInfo, submitText }) => (
  <div className={styles.container}>
    <Form submitText={submitText} onSubmit={fetchInfo} />
    {pipe(
      info,
      fold(
        () => null,
        () => <Loader />,
        (error) => <Failed error={error} />,
        () => <Complete />
      )
    )}
  </div>
)
