import { sendBackgroundMessage } from './messaging'
import { DownloadRequest, DownloadResponse } from './messaging/codec'

export const download = async (
  data: DownloadRequest['data']
): Promise<number> =>
  (await sendBackgroundMessage({ type: 'download', data }, DownloadResponse))
    .data.id
