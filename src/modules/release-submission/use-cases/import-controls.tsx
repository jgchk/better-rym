import { render } from 'preact'
import { useCallback } from 'preact/hooks'
import { useReleaseInfo } from '~/common/hooks/use-release-info'
import { Resolvable, ResolveData, Service } from '~/common/services/types'
import { waitForElement } from '~/common/utils/dom'
import { ReleaseOptions } from '../utils/types'
import { isComplete } from '~/common/utils/one-shot'
import { fill } from '../utils/fillers'
import { download } from '~/common/utils/download'
import { StatusForm } from '~/common/components/status-form'
import { RESOLVABLES } from '~/common/services'

export default async function injectImportControls() {
  const siblingElement = await waitForElement('.submit_step_header')
  const app = document.createElement('div')
  app.id = 'better-rym'
  siblingElement.before(app)
  render(<Import />, app)
}

function Import() {
  const { info, fetchInfo } = useReleaseInfo()

  const fetchInfoOuter = useCallback(
    async (
      url: string,
      service: Service & Resolvable,
      options: ReleaseOptions,
    ) => {
      const info = await fetchInfo(url, service)
      if (isComplete(info)) {
        void fill(info.data, options)

        // emit import event
        const importEvent = new CustomEvent<ResolveData>('importEvent', {
          detail: info.data,
        })
        document.dispatchEvent(importEvent)

        if (options.downloadArt && info.data.coverArt) {
          const filename = getFilename(info.data)
          await download(info.data.coverArt.map((url) => ({ url, filename })))
        }
      }
    },
    [fetchInfo],
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

function getFilename({ title, artists }: ResolveData) {
  let filename = ''
  if (artists && artists.length > 0) filename += artists.join(', ')
  if (title) {
    if (artists && artists.length > 0) filename += ' - '
    filename += title
  }
  return filename.length === 0 ? 'cover' : filename
}
