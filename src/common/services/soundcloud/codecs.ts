import * as t from 'io-ts'

const UserObject = t.type({ kind: t.literal('user') }, 'UserObject')

export type TrackObject = t.TypeOf<typeof TrackObject>
export const TrackObject = t.type(
  {
    id: t.Int,
    kind: t.literal('track'),
    display_date: t.string,
    duration: t.Int,
    permalink_url: t.string,
    title: t.string,
    artwork_url: t.union([t.string, t.null]),
    user: t.type({
      username: t.string,
    }),
  },
  'TrackObject'
)

export const SimplifiedTrackObject = t.type(
  { id: t.Int, kind: t.literal('track') },
  'SimplifiedTrackObject'
)

export const PlaylistObject = t.type(
  {
    kind: t.literal('playlist'),
    permalink_url: t.string,
    title: t.string,
    display_date: t.string,
    tracks: t.array(t.union([TrackObject, SimplifiedTrackObject])),
    artwork_url: t.union([t.string, t.null]),
    user: t.type({
      username: t.string,
    }),
  },
  'PlaylistObject'
)

export type MusicObject = t.TypeOf<typeof MusicObject>
export const MusicObject = t.union([TrackObject, PlaylistObject])

export type SearchObject = t.TypeOf<typeof SearchObject>
export const SearchObject = t.type(
  { collection: t.array(t.union([TrackObject, UserObject, PlaylistObject])) },
  'PagingObject'
)
