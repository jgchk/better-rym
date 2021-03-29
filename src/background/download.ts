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
  for (const { url, filename } of data) {
    try {
      const blob = await fetch(url).then((response) => {
        if (response.ok) {
          return response.blob()
        } else {
          throw new Error(`Status code: ${response.status}`)
        }
      })
      const fileType = await fromBlob(blob)

      const extension = isDefined(fileType) ? `.${fileType.ext}` : ''
      const formattedFilename = filename.slice(0, 100 - extension.length)
      const filenameWithExtension = filenamify(
        `${formattedFilename}${extension}`
      )

      const downloadId = await browser.downloads.download({
        url: URL.createObjectURL(blob),
        filename: filenameWithExtension,
      })
      return { id, type: 'download', data: { id: downloadId } }
    } catch (error) {
      console.error(error)
    }
  }

  throw new Error('None of the links worked')
}
