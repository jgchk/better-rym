import browser from 'webextension-polyfill'

import filenamify from '~/common/utils/filenamify'

import type {
  DownloadRequest,
  DownloadResponse,
} from '../../common/utils/messaging/codec'

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

      const extension =
        mimeTypeExtension !== undefined
          ? `.${mimeTypeExtension}`
          : urlExtension !== undefined
            ? `.${urlExtension}`
            : ''
      const formattedFilename = filename.slice(0, 100 - extension.length)
      const filenameWithExtension = filenamify(
        `${formattedFilename}${extension}`,
      )

      const downloadId = await browser.downloads.download({
        url,
        filename: filenameWithExtension,
      })
      return { id, type: 'download', data: { id: downloadId } }
    } catch (error) {
      console.error(error)
    }
  }

  throw new Error('None of the links worked')
}
