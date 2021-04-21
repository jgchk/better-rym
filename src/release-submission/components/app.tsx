import { FunctionComponent, h } from 'preact'
import { useCallback } from 'preact/hooks'
import { StatusForm } from '../../common/components/status-form'
import { useReleaseInfo } from '../../common/hooks/use-release-info'
import { RESOLVABLES } from '../../common/services'
import { Resolvable, Service } from '../../common/services/types'
import { isComplete } from '../../common/utils/one-shot'
import { CapitalizationType } from '../utils/capitalization'
import { fill } from '../utils/fillers'

export const App: FunctionComponent = () => {
  const { info, fetchInfo } = useReleaseInfo()

  const fetchInfoOuter = useCallback(
    async (
      url: string,
      service: Service & Resolvable,
      capitalization: CapitalizationType
    ) => {
      const info = await fetchInfo(url, service)
      if (isComplete(info)) {
        void fill(info.data, capitalization)
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
          services={RESOLVABLES}
          submitText='Import'
          data={info}
          onSubmit={fetchInfoOuter}
          showAutoCapitalize
        />
      </div>
    </>
  )
}
