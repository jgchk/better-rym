import * as t from 'io-ts'

export type TextRun = t.TypeOf<typeof TextRun>
export const TextRun = t.type({ text: t.string }, 'TextRun')

export type PurpleTitle = t.TypeOf<typeof PurpleTitle>
export const PurpleTitle = t.type({ runs: t.array(TextRun) }, 'PurpleTitle')

export type VideoRenderer = t.TypeOf<typeof VideoRenderer>
export const VideoRenderer = t.type(
  { videoId: t.string, title: PurpleTitle },
  'VideoRenderer'
)

export type ItemSectionRendererContent = t.TypeOf<
  typeof ItemSectionRendererContent
>
export const ItemSectionRendererContent = t.partial(
  { videoRenderer: VideoRenderer },
  'ItemSectionRendererContent'
)

export type ItemSectionRenderer = t.TypeOf<typeof ItemSectionRenderer>
export const ItemSectionRenderer = t.type(
  { contents: t.array(ItemSectionRendererContent) },
  'ItemSectionRenderer'
)

export type SectionListRendererContent = t.TypeOf<
  typeof SectionListRendererContent
>
export const SectionListRendererContent = t.partial(
  { itemSectionRenderer: ItemSectionRenderer },
  'SectionListRendererContent'
)

export type SectionListRenderer = t.TypeOf<typeof SectionListRenderer>
export const SectionListRenderer = t.type(
  { contents: t.array(SectionListRendererContent) },
  'SectionListRenderer'
)

export type PrimaryContents = t.TypeOf<typeof PrimaryContents>
export const PrimaryContents = t.type(
  { sectionListRenderer: SectionListRenderer },
  'PrimaryContents'
)

export type TwoColumnSearchResultsRenderer = t.TypeOf<
  typeof TwoColumnSearchResultsRenderer
>
export const TwoColumnSearchResultsRenderer = t.type(
  { primaryContents: PrimaryContents },
  'TwoColumnSearchResultsRenderer'
)

export type Contents = t.TypeOf<typeof Contents>
export const Contents = t.type(
  { twoColumnSearchResultsRenderer: TwoColumnSearchResultsRenderer },
  'Contents'
)

export type SearchObject = t.TypeOf<typeof SearchObject>
export const SearchObject = t.type({ contents: Contents }, 'SearchObject')

export type Video = t.TypeOf<typeof Video>
export const Video = t.type(
  {
    items: t.tuple([
      t.type({
        kind: t.literal('youtube#video'),
        id: t.string,
        snippet: t.type({
          publishedAt: t.string,
          title: t.string,
          channelTitle: t.string,
        }),
        contentDetails: t.type({
          duration: t.string,
        }),
      }),
    ]),
  },
  'Video'
)

export type Playlist = t.TypeOf<typeof Playlist>
export const Playlist = t.type(
  {
    items: t.tuple([
      t.type({
        kind: t.literal('youtube#playlist'),
        id: t.string,
        snippet: t.type({
          publishedAt: t.string,
          title: t.string,
          channelTitle: t.string,
          thumbnails: t.record(
            t.string,
            t.type({ url: t.string, width: t.Int, height: t.Int })
          ),
        }),
      }),
    ]),
  },
  'Playlist'
)

export type PlaylistItems = t.TypeOf<typeof PlaylistItems>
export const PlaylistItems = t.intersection(
  [
    t.type({
      items: t.array(
        t.type({
          kind: t.literal('youtube#playlistItem'),
          contentDetails: t.type({
            videoId: t.string,
          }),
        })
      ),
    }),
    t.partial({ nextPageToken: t.string }),
  ],
  'PlaylistItems'
)
