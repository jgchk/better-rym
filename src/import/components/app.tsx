import { FunctionComponent, h } from 'preact'
import { useCallback } from 'preact/hooks'
import { StatusForm } from '../../common/components/status-form'
import { useReleaseInfo } from '../../common/hooks/use-release-info'
import { ServiceId } from '../../common/services'
import { isComplete } from '../../common/utils/one-shot'
import { fill } from '../utils/fillers'

export const App: FunctionComponent = () => {
  const { info, fetchInfo } = useReleaseInfo()

  const fetchInfoOuter = useCallback(
    async (url: string, serviceId: ServiceId, autoCapitalize: boolean) => {
      const info = await fetchInfo(url, serviceId)
      if (isComplete(info)) {
        void fill(info.data, autoCapitalize)
      }
    },
    [fetchInfo]
  )

  return (
    <>
      <div className='submit_step_header'>
        Step 0: <span className='submit_step_header_title'>Import</span>
      </div>
      <div className={'submit_step_box'}>
        <StatusForm
          submitText='Import'
          data={info}
          onSubmit={fetchInfoOuter}
          showAutoCapitalize
        />
      </div>
    </>
  )
}
