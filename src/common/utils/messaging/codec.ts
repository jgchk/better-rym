export type FetchRequest = {
  id: string
  type: 'fetch'
  data: {
    url: string
    method?: 'GET' | 'POST' | 'PUT'
    urlParameters?: { [key: string]: string }
    headers?: { [key: string]: string }
    credentials?: RequestCredentials
    body?: unknown
  }
}

export type FetchResponse = {
  id: string
  type: 'fetch'
  data: {
    body: string
  }
}

export type DownloadRequest = {
  id: string
  type: 'download'
  data: {
    url: string
    filename: string
  }[]
}

export type DownloadResponse = {
  id: string
  type: 'download'
  data: {
    id: number
  }
}

export type BackgroundRequest = FetchRequest | DownloadRequest
export type BackgroundResponse = FetchResponse | DownloadResponse

export const isBackgroundRequest = (o: unknown): o is BackgroundRequest =>
  typeof o === 'object' && o !== null && 'id' in o && 'type' in o && 'data' in o
export const isBackgroundResponse = (o: unknown): o is BackgroundResponse =>
  typeof o === 'object' && o !== null && 'id' in o && 'type' in o && 'data' in o
