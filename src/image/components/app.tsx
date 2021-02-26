// eslint-disable-next-line import/no-unresolved
import filenamify from 'filenamify/browser'
import { FunctionComponent, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { StatusForm } from '../../common/components/status-form'
import { useReleaseInfo } from '../../common/hooks/use-release-info'
import { download } from '../../common/utils/download'
import { isComplete } from '../../common/utils/one-shot'
import { isDefined } from '../../common/utils/types'
import styles from '../styles/app.module.css'

export const App: FunctionComponent = () => {
  const { info, fetchInfo } = useReleaseInfo()

  useEffect(() => {
    if (isComplete(info)) {
      const cover = info.data.coverArt
      if (isDefined(cover)) {
        const extension = cover.split('.').pop()
        const filename =
          isDefined(info.data.title) && isDefined(extension)
            ? filenamify(`${info.data.title}.${extension}`)
            : undefined
        void download({ url: cover, filename })
      }
    }
  }, [info])

  return (
    <>
      <h4>Download Cover Art</h4>
      <div className={styles.container}>
        <StatusForm submitText='Download' data={info} onSubmit={fetchInfo} />
      </div>
    </>
  )
}
