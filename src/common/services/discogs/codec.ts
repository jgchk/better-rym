import * as t from 'io-ts'

const Artist = t.type({ name: t.string }, 'Artist')

const Track = t.type(
  { position: t.string, title: t.string, duration: t.string },
  'Track'
)

const Image = t.type({ resource_url: t.string }, 'Image')

const Label = t.type({ name: t.string, catno: t.string }, 'Label')

const FormatName = t.keyof(
  {
    Vinyl: true,
    Acetate: true,
    'Flexi-disc': true,
    'Lathe Cut': true,
    Shellac: true,
    'Pathé Disc': true,
    'Edison Disc': true,
    Cylinder: true,
    CD: true,
    CDr: true,
    CDV: true,
    DVD: true,
    DVDr: true,
    'HD DVD': true,
    'HD DVD-R': true,
    'Blu-ray': true,
    'Blu-ray-R': true,
    SACD: true,
    '4-Track Cartridge': true,
    '8-Track Cartridge': true,
    Cassette: true,
    'DC-International': true,
    Elcaset: true,
    PlayTape: true,
    'RCA Tape Cartridge': true,
    DAT: true,
    DCC: true,
    Microcassette: true,
    'NT Cassette': true,
    'Pocket Rocker': true,
    'Revere Magnetic Stereo Tape Ca': true,
    Tefifon: true,
    'Reel-To-Reel': true,
    Sabamobil: true,
    Betacam: true,
    'Betacam SP': true,
    Betamax: true,
    Cartrivision: true,
    MiniDV: true,
    'U-matic': true,
    VHS: true,
    'Video 2000': true,
    Video8: true,
    'Film Reel': true,
    Laserdisc: true,
    SelectaVision: true,
    VHD: true,
    'Wire Recording': true,
    Minidisc: true,
    MVD: true,
    UMD: true,
    'Floppy Disk': true,
    File: true,
    'Memory Stick': true,
    Hybrid: true,
    'All Media': true,
    'Box Set': true,
  },
  'FormatName'
)

export type FormatDescription = t.TypeOf<typeof FormatDescription>
export const FormatDescription = t.keyof(
  {
    // Vinyl, Acetate, Flexi-disc, Lathe Cut, Shellac
    LP: true,
    '16"': true,
    '12"': true,
    '11"': true,
    '10"': true,
    '9"': true,
    '8"': true,
    '7"': true,
    '6½"': true,
    '6"': true,
    '5½"': true,
    '5"': true,
    '4"': true,
    '3½"': true,
    '3"': true,
    '2"': true,
    '1"': true,
    '8 ⅓ RPM': true,
    '16 ⅔ RPM': true,
    '33 ⅓ RPM': true,
    '45 RPM': true,
    '78 RPM': true,
    '80 RPM': true,
    Shape: true,
    'Single Sided': true,
    Advance: true,
    Album: true,
    'Mini-Album': true,
    EP: true,
    'Maxi-Single': true,
    Single: true,
    Compilation: true,
    'Card Backed': true,
    'Club Edition': true,
    'Deluxe Edition': true,
    Enhanced: true,
    Etched: true,
    Jukebox: true,
    'Limited Edition': true,
    Mispress: true,
    Misprint: true,
    Mixed: true,
    Mixtape: true,
    Numbered: true,
    'Partially Mixed': true,
    'Partially Unofficial': true,
    'Picture Disc': true,
    Promo: true,
    Reissue: true,
    Remastered: true,
    Repress: true,
    Sampler: true,
    'Special Edition': true,
    Styrene: true,
    'Test Pressing': true,
    Transcription: true,
    'Unofficial Release': true,
    'White Label': true,
    Stereo: true,
    Mono: true,
    Quadraphonic: true,
    Ambisonic: true,

    // Pathé Disc
    '21cm': true,
    '25cm': true,
    '27cm': true,
    '29cm': true,
    '35cm': true,
    '50cm': true,
    '90 RPM': true,

    // Cylinder
    '2 Minute': true,
    '3 Minute': true,
    '4 Minute': true,
    Concert: true,
    Salon: true,

    // CD, CDr
    Mini: true,
    Minimax: true,
    'Business Card': true,
    'CD-ROM': true,
    CDi: true,
    'CD+G': true,
    HDCD: true,
    VCD: true,
    AVCD: true,
    SVCD: true,
    NTSC: true,
    PAL: true,
    SECAM: true,

    // DVD, DVDr
    'DVD-Audio': true,
    'DVD-Data': true,
    'DVD-Video': true,
    Multichannel: true,
    'Double Sided': true,

    // Blu-ray
    'Blu-ray Audio': true,

    // SACD
    Hybrid: true,

    // Cassette
    '15/16 ips': true,

    // Reel-To-Reel
    '1 ⅞ ips': true,
    '15 ips': true,
    '3 ¾ ips': true,
    '30 ips': true,
    '7 ½ ips': true,
    '½"': true,
    '¼"': true,
    '⅛"': true,
    '2-Track Mono': true,
    '2-Track Stereo': true,
    '4-Track Mono': true,
    '4-Track Stereo': true,
    '10.5" NAB Reel': true,
    '3" Cine Reel': true,
    '5" Cine Reel': true,
    '6" Cine Reel': true,
    '7" Cine Reel': true,

    // Film Reel
    '16mm': true,
    '35mm': true,

    // Floppy Disk, File, Memory Stick
    AAC: true,
    AIFC: true,
    AIFF: true,
    ALAC: true,
    AMR: true,
    APE: true,
    AVI: true,
    DFF: true,
    'Disc Image': true,
    DSF: true,
    FLAC: true,
    FLV: true,
    MOV: true,
    MP2: true,
    MP3: true,
    'MPEG Video': true,
    'MPEG-4 Video': true,
    'ogg-vorbis': true,
    Opus: true,
    RA: true,
    RM: true,
    SHN: true,
    SWF: true,
    TTA: true,
    WAV: true,
    WavPack: true,
    WMA: true,
    WMV: true,
    'MP3 Surround': true,
    '3.5"': true,
    '5.25"': true,

    // Hybrid
    'CD-Record': true,
    DualDisc: true,
    DVDplus: true,
    VinylDisc: true,
  },
  'FormatDescription'
)

export type Format = t.TypeOf<typeof Format>
export const Format = t.intersection(
  [
    t.type({ name: FormatName }),
    t.partial({ descriptions: t.array(FormatDescription), text: t.string }),
  ],
  'Format'
)

export const Release = t.intersection(
  [
    t.type({
      uri: t.string,
      title: t.string,
      artists: t.array(Artist),
      tracklist: t.array(Track),
      images: t.array(Image),
      formats: t.array(Format),
      labels: t.array(Label),
    }),
    t.partial({
      released: t.string,
    }),
  ],
  'Release'
)

export const Master = t.type({ main_release: t.Int }, 'Master')
