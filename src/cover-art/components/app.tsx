import { FunctionComponent, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { StatusForm } from '../../common/components/status-form'
import { useReleaseInfo } from '../../common/hooks/use-release-info'
import { RESOLVABLES } from '../../common/services'
import { ResolveData } from '../../common/services/types'
import { download } from '../../common/utils/download'
import {
  OneShot,
  complete,
  failed,
  fold,
  initial,
  loading,
} from '../../common/utils/one-shot'
import { pipe } from '../../common/utils/pipe'
import { isDefined, isNotNull } from '../../common/utils/types'
import styles from '../styles/app.module.css'

const getFilename = ({ title, artists }: ResolveData) => {
  let filename = ''
  if (isDefined(artists) && artists.length > 0) {
    filename += artists.join(', ')
  }
  if (isDefined(title)) {
    if (isDefined(artists) && artists.length > 0) {
      filename += ' - '
    }
    filename += title
  }
  if (filename.length === 0) {
    return 'cover'
  }
  return filename
}

export const App: FunctionComponent = () => {
  const { info, fetchInfo } = useReleaseInfo()
  const [state, setState] = useState<OneShot<Error, ResolveData>>(initial)

  useEffect(() => {
    const handleDownload = async (data: ResolveData) => {
      const { coverArt, url } = data
      if (isDefined(coverArt)) {
        const filename = getFilename(data)
        await download(coverArt.map((url) => ({ url, filename })))

        if (isDefined(url)) {
          const sourceInput = document.getElementById(
            'source'
          ) as HTMLTextAreaElement | null
          if (isNotNull(sourceInput) && sourceInput.value.length === 0) {
            sourceInput.value = url
          }
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
          }
        )
      )
    )
  }, [info])

  return (
    <>
      <h4>Download Cover Art</h4>
      <div className={styles.container}>
        <StatusForm
          services={RESOLVABLES}
          submitText='Download'
          data={state}
          onSubmit={(url, service) => void fetchInfo(url, service)}
        />
      </div>
    </>
  )
}
