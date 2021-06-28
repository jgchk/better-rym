// eslint-disable-next-line import/no-unresolved
import filenamify from 'filenamify/browser'
import {
  DownloadRequest,
  DownloadResponse,
} from '../common/utils/messaging/codec'
import { isDefined } from '../common/utils/types'
import './buffer-polyfill'

const mimeTypes: Record<string, string | undefined> = {
  'image/bmp': 'bmp',
  'image/gif': 'gif',
  'image/vnd.microsoft.icon': 'ico',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
  'image/tiff': 'tiff',
  'image/webp': 'webp',
}

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
      const mimeTypeExtension = mimeTypes[blob.type]
      const urlExtension = url.split('.').pop()

      const extension = isDefined(mimeTypeExtension)
        ? `.${mimeTypeExtension}`
        : isDefined(urlExtension)
        ? `.${urlExtension}`
        : ''
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
