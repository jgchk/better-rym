import clsx from 'clsx'
import { pipe } from 'fp-ts/function'
import { FunctionComponent, h } from 'preact'
import { Complete } from '../../common/components/complete'
import { Failed } from '../../common/components/failed'
import { Loader } from '../../common/components/loader'
import { fold } from '../../common/utils/one-shot'
import { useAutoFill } from '../hooks/use-auto-fill'
import styles from '../styles/app.module.css'
import { Form } from './form'

export const App: FunctionComponent = () => {
  const { info, autoFill } = useAutoFill()
  return (
    <>
      <div className='submit_step_header'>
        Step 0: <span className='submit_step_header_title'>Import</span>
      </div>
      <div className={clsx('submit_step_box', styles.box)}>
        <Form onSubmit={autoFill} />
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
    </>
  )
}
