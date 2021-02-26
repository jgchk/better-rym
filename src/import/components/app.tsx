import { FunctionComponent, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { StatusForm } from '../../common/components/status-form'
import { useReleaseInfo } from '../../common/hooks/use-release-info'
import { isComplete } from '../../common/utils/one-shot'
import { fill } from '../utils/fillers'

export const App: FunctionComponent = () => {
  const { info, fetchInfo } = useReleaseInfo()

  useEffect(() => {
    if (isComplete(info)) {
      fill(info.data)
    }
  }, [info])

  return (
    <>
      <div className='submit_step_header'>
        Step 0: <span className='submit_step_header_title'>Import</span>
      </div>
      <div className={'submit_step_box'}>
        <StatusForm submitText='Import' info={info} fetchInfo={fetchInfo} />
      </div>
    </>
  )
}
