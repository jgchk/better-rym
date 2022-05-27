import { sendBackgroundMessage } from './messaging'
import { DownloadRequest, DownloadResponse } from './messaging/codec'

export const download = async (
  data: DownloadRequest['data']
): Promise<number> => {
  const response = await sendBackgroundMessage<
    DownloadRequest,
    DownloadResponse
  >({
    type: 'download',
    data,
  })

  return response.data.id
}
