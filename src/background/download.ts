import { fromBlob } from 'file-type/browser'
// eslint-disable-next-line import/no-unresolved
import filenamify from 'filenamify/browser'
import {
  DownloadRequest,
  DownloadResponse,
} from '../common/utils/messaging/codec'
import { isDefined } from '../common/utils/types'
import './buffer-polyfill'

export const download = async ({
  id,
  data,
}: DownloadRequest): Promise<DownloadResponse> => {
  const blob = await fetch(data.url).then((response) => response.blob())
  const fileType = await fromBlob(blob)

  const filename = filenamify(
    `${data.filename}${isDefined(fileType) ? `.${fileType.ext}` : ''}`
  )

  const downloadId = await browser.downloads.download({
    url: URL.createObjectURL(blob),
    filename,
  })
  return { id, type: 'download', data: { id: downloadId } }
}
