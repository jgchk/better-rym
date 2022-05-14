import { h, VNode } from 'preact'
import { useEffect } from 'preact/hooks'

import { ReleaseOptions } from '../../modules/release-submission/utils/types'
import { Service } from '../services/types'
import styles from '../styles/status-form.module.css'
import { fold, isFailed, OneShot } from '../utils/one-shot'
import { pipe } from '../utils/pipe'
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
    options: ReleaseOptions
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
}: Properties<E, T, S>): VNode => {
  useEffect(() => {
    if (isFailed(data)) {
      console.error(data.error)
    }
  }, [data])

  return (
    <div className={styles.container}>
      <Form
        services={services}
        submitText={submitText}
        onSubmit={(url, service, options) =>
          void onSubmit(url, service, options)
        }
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
}
