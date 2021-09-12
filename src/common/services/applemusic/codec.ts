export type SearchObject = {
  results: [
    {
      collectionViewUrl: string
    }
  ]
}

export type Release = {
  attributes: {
    artistName: string
    artwork: {
      url: string
    }
    name: string
    recordLabel?: string
    releaseDate: string
    url: string
  }
  relationships: {
    artists: {
      data: [
        {
          attributes: {
            name: string
          }
        }
      ]
    }
    tracks: {
      data: [
        {
          attributes: {
            artistName: string
            durationInMillis: number
            name: string
            trackNumber: number
          }
        }
      ]
    }
  }
}

export type ReleaseHolder = {
  x: number
  d: [Release]
}
