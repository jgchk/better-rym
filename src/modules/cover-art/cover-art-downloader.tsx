import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { ServiceLinkForm } from '../../common/components/service-link-form'
import { useReleaseInfo } from '../../common/hooks/use-release-info'
import { RESOLVABLES } from '../../common/services'
import type { ResolveData } from '../../common/services/types'
import { download } from '../../common/utils/download'
import type { OneShot } from '../../common/utils/one-shot'
import {
  complete,
  failed,
  fold,
  initial,
  loading,
} from '../../common/utils/one-shot'
import { pipe } from '../../common/utils/pipe'

export function CoverArtDownloader() {
  const { info, fetchInfo } = useReleaseInfo()
  const [state, setState] = useState<OneShot<Error, ResolveData>>(initial)

  useEffect(() => {
    const handleDownload = async (data: ResolveData) => {
      const { coverArt, url } = data
      if (coverArt) {
        const filename = getFilename(data)
        await download(coverArt.map((url) => ({ url, filename })))

        if (url) {
          const sourceInput = document.getElementById(
            'source',
          ) as HTMLTextAreaElement | null
          if (sourceInput && sourceInput.value.length === 0)
            sourceInput.value = url
        }

        setState(complete(data))
      } else {
        setState(failed(new Error('no cover art found')))
      }
    }

    setState(
      pipe(
        info,
        fold<Error, ResolveData, OneShot<Error, ResolveData>>(
          () => initial,
          () => loading,
          (error) => failed(error),
          (data) => {
            void handleDownload(data)
            return loading
          },
        ),
      ),
    )
  }, [info])

  return (
    <>
      <h4>Download Cover Art</h4>
      <div
        style={{
          marginBottom: 16,
          padding: 8,
          background: 'var(--mono-f4)',
          border: '1px solid var(--mono-e8)',
        }}
      >
        <ServiceLinkForm
          services={RESOLVABLES}
          submitText='Download'
          data={state}
          onSubmit={(url, service) => void fetchInfo(url, service)}
        />
      </div>
    </>
  )
}

const getFilename = ({ title, artists }: ResolveData) => {
  let filename = ''
  if (artists && artists.length > 0) filename += artists.join(', ')
  if (title) {
    if (artists && artists.length > 0) filename += ' - '
    filename += title
  }
  return filename.length === 0 ? 'cover' : filename
}
