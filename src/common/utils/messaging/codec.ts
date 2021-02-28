import * as t from 'io-ts'

export type FetchRequest = t.TypeOf<typeof FetchRequest>
export const FetchRequest = t.type(
  {
    id: t.string,
    type: t.literal('fetch'),
    data: t.intersection([
      t.type({ url: t.string }),
      t.partial({
        method: t.union([t.literal('GET'), t.literal('POST')]),
        urlParameters: t.record(t.string, t.string),
        headers: t.record(t.string, t.string),
      }),
    ]),
  },
  'FetchRequest'
)

export type FetchResponse = t.TypeOf<typeof FetchResponse>
export const FetchResponse = t.type(
  {
    id: t.string,
    type: t.literal('fetch'),
    data: t.type({
      body: t.string,
    }),
  },
  'FetchResponse'
)

export type DownloadRequest = t.TypeOf<typeof DownloadRequest>
export const DownloadRequest = t.type(
  {
    id: t.string,
    type: t.literal('download'),
    data: t.type({ url: t.string, filename: t.string }),
  },
  'DownloadRequest'
)

export type DownloadResponse = t.TypeOf<typeof DownloadResponse>
export const DownloadResponse = t.type(
  {
    id: t.string,
    type: t.literal('download'),
    data: t.type({ id: t.number }),
  },
  'DownloadResponse'
)

export type BackgroundRequest = FetchRequest | DownloadRequest
export type BackgroundResponse = FetchResponse | DownloadResponse
