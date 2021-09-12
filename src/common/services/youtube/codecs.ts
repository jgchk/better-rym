export type TextRun = { text: string }
export type PurpleTitle = { runs: [TextRun] }
export type VideoRenderer = { videoId: string; title: PurpleTitle }
export type ItemSectionRendererContent = { videoRenderer: VideoRenderer }
export type ItemSectionRenderer = { contents: [ItemSectionRendererContent] }
export type SectionListRendererContent = {
  itemSectionRenderer: ItemSectionRenderer
}
export type SectionListRenderer = { contents: [SectionListRendererContent] }
export type PrimaryContents = { sectionListRenderer: SectionListRenderer }
export type TwoColumnSearchResultsRenderer = {
  primaryContents: PrimaryContents
}
export type Contents = {
  twoColumnSearchResultsRenderer: TwoColumnSearchResultsRenderer
}
export type SearchObject = { contents: Contents }

export type Video = {
  items: {
    kind: 'youtube#video'
    id: string
    snippet: {
      publishedAt: string
      title: string
      channelTitle: string
    }
    contentDetails: {
      duration: string
    }
  }[]
}

export type Playlist = {
  items: {
    kind: 'youtube#playlist'
    id: string
    snippet: {
      publishedAt: string
      title: string
      channelTitle: string
      thumbnails: Record<string, { url: string; width: number; height: number }>
    }
  }[]
}

export type PlaylistItems = {
  items: {
    kind: 'youtube#playlistItem'
    contentDetails: {
      videoId: string
    }
  }[]
  nextPageToken?: string
}
