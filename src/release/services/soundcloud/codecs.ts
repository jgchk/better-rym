import * as t from 'io-ts'

const UserObject = t.type({ kind: t.literal('user') }, 'UserObject')

const TrackObject = t.type(
  { kind: t.literal('track'), permalink_url: t.string },
  'TrackObject'
)

const PlaylistObject = t.type(
  { kind: t.literal('playlist'), permalink_url: t.string },
  'PlaylistObject'
)

export const MusicObject = t.union([TrackObject, PlaylistObject])

export type SearchObject = t.TypeOf<typeof SearchObject>
export const SearchObject = t.type(
  { collection: t.array(t.union([TrackObject, UserObject, PlaylistObject])) },
  'PagingObject'
)
