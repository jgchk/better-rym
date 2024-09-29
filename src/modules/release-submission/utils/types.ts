import type { CapitalizationType } from './capitalization'

export type ReleaseOptions = {
  capitalization: CapitalizationType
  fillFields: {
    artists: boolean
    type: boolean
    date: boolean
    title: boolean
    format: boolean
    discSize: boolean
    attributes: boolean
    tracks: boolean
    label: boolean
  }
}
