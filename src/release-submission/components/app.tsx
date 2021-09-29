import { FunctionComponent, h } from 'preact'
import { useCallback } from 'preact/hooks'

import { StatusForm } from '../../common/components/status-form'
import { useReleaseInfo } from '../../common/hooks/use-release-info'
import { RESOLVABLES } from '../../common/services'
import { Resolvable, ResolveData, Service } from '../../common/services/types'
import { download } from '../../common/utils/download'
import { isComplete } from '../../common/utils/one-shot'
import { fill } from '../utils/fillers'
import { ReleaseOptions } from '../utils/types'

const getFilename = ({ title, artists }: ResolveData) => {
  let filename = ''
  if (artists && artists.length > 0) filename += artists.join(', ')
  if (title) {
    if (artists && artists.length > 0) filename += ' - '
    filename += title
  }
  return filename.length === 0 ? 'cover' : filename
}

export const App: FunctionComponent = () => {
  const { info, fetchInfo } = useReleaseInfo()

  const fetchInfoOuter = useCallback(
    async (
      url: string,
      service: Service & Resolvable,
      options: ReleaseOptions
    ) => {
      const info = await fetchInfo(url, service)
      if (isComplete(info)) {
        void fill(info.data, options)

        if (options.downloadArt && info.data.coverArt) {
          const filename = getFilename(info.data)
          await download(info.data.coverArt.map((url) => ({ url, filename })))
        }
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
