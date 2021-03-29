import { FunctionComponent, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { StatusForm } from '../../common/components/status-form'
import { useReleaseInfo } from '../../common/hooks/use-release-info'
import { RESOLVABLES } from '../../common/services'
import { ResolveData } from '../../common/services/types'
import { download } from '../../common/utils/download'
import { isComplete } from '../../common/utils/one-shot'
import { isDefined } from '../../common/utils/types'
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

  useEffect(() => {
    if (isComplete(info)) {
      const { coverArt } = info.data
      if (isDefined(coverArt)) {
        const filename = getFilename(info.data)
        void download(coverArt.map((url) => ({ url, filename })))
      }
    }
  }, [info])

  return (
    <>
      <h4>Download Cover Art</h4>
      <div className={styles.container}>
        <StatusForm
          services={RESOLVABLES}
          submitText='Download'
          data={info}
          onSubmit={(url, service) => void fetchInfo(url, service)}
        />
      </div>
    </>
  )
}
