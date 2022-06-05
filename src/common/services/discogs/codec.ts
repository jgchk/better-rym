type FormatName =
  | 'Vinyl'
  | 'Acetate'
  | 'Flexi-disc'
  | 'Lathe Cut'
  | 'Shellac'
  | 'Pathé Disc'
  | 'Edison Disc'
  | 'Cylinder'
  | 'CD'
  | 'CDr'
  | 'CDV'
  | 'DVD'
  | 'DVDr'
  | 'HD DVD'
  | 'HD DVD-R'
  | 'Blu-ray'
  | 'Blu-ray-R'
  | 'SACD'
  | '4-Track Cartridge'
  | '8-Track Cartridge'
  | 'Cassette'
  | 'DC-International'
  | 'Elcaset'
  | 'PlayTape'
  | 'RCA Tape Cartridge'
  | 'DAT'
  | 'DCC'
  | 'Microcassette'
  | 'NT Cassette'
  | 'Pocket Rocker'
  | 'Revere Magnetic Stereo Tape Ca'
  | 'Tefifon'
  | 'Reel-To-Reel'
  | 'Sabamobil'
  | 'Betacam'
  | 'Betacam SP'
  | 'Betamax'
  | 'Cartrivision'
  | 'MiniDV'
  | 'U-matic'
  | 'VHS'
  | 'Video 2000'
  | 'Video8'
  | 'Film Reel'
  | 'Laserdisc'
  | 'SelectaVision'
  | 'VHD'
  | 'Wire Recording'
  | 'Minidisc'
  | 'MVD'
  | 'UMD'
  | 'Floppy Disk'
  | 'File'
  | 'Memory Stick'
  | 'Hybrid'
  | 'All Media'
  | 'Box Set'

export type FormatDescription =
  | // Vinyl, Acetate, Flexi-disc, Lathe Cut, Shellac
  'LP'
  | '16"'
  | '12"'
  | '11"'
  | '10"'
  | '9"'
  | '8"'
  | '7"'
  | '6½"'
  | '6"'
  | '5½"'
  | '5"'
  | '4"'
  | '3½"'
  | '3"'
  | '2"'
  | '1"'
  | '8 ⅓ RPM'
  | '16 ⅔ RPM'
  | '33 ⅓ RPM'
  | '45 RPM'
  | '78 RPM'
  | '80 RPM'
  | 'Shape'
  | 'Single Sided'
  | 'Advance'
  | 'Album'
  | 'Mini-Album'
  | 'EP'
  | 'Maxi-Single'
  | 'Single'
  | 'Compilation'
  | 'Card Backed'
  | 'Club Edition'
  | 'Deluxe Edition'
  | 'Enhanced'
  | 'Etched'
  | 'Jukebox'
  | 'Limited Edition'
  | 'Mispress'
  | 'Misprint'
  | 'Mixed'
  | 'Mixtape'
  | 'Numbered'
  | 'Partially Mixed'
  | 'Partially Unofficial'
  | 'Picture Disc'
  | 'Promo'
  | 'Reissue'
  | 'Remastered'
  | 'Repress'
  | 'Sampler'
  | 'Special Edition'
  | 'Styrene'
  | 'Test Pressing'
  | 'Transcription'
  | 'Unofficial Release'
  | 'White Label'
  | 'Stereo'
  | 'Mono'
  | 'Quadraphonic'
  | 'Ambisonic'

  // Pathé Disc
  | '21cm'
  | '25cm'
  | '27cm'
  | '29cm'
  | '35cm'
  | '50cm'
  | '90 RPM'

  // Cylinder
  | '2 Minute'
  | '3 Minute'
  | '4 Minute'
  | 'Concert'
  | 'Salon'

  // CD, CDr
  | 'Mini'
  | 'Minimax'
  | 'Business Card'
  | 'CD-ROM'
  | 'CDi'
  | 'CD+G'
  | 'HDCD'
  | 'VCD'
  | 'AVCD'
  | 'SVCD'
  | 'NTSC'
  | 'PAL'
  | 'SECAM'

  // DVD, DVDr
  | 'DVD-Audio'
  | 'DVD-Data'
  | 'DVD-Video'
  | 'Multichannel'
  | 'Double Sided'

  // Blu-ray
  | 'Blu-ray Audio'

  // SACD
  | 'Hybrid'

  // Cassette
  | '15/16 ips'

  // Reel-To-Reel
  | '1 ⅞ ips'
  | '15 ips'
  | '3 ¾ ips'
  | '30 ips'
  | '7 ½ ips'
  | '½"'
  | '¼"'
  | '⅛"'
  | '2-Track Mono'
  | '2-Track Stereo'
  | '4-Track Mono'
  | '4-Track Stereo'
  | '10.5" NAB Reel'
  | '3" Cine Reel'
  | '5" Cine Reel'
  | '6" Cine Reel'
  | '7" Cine Reel'

  // Film Reel
  | '16mm'
  | '35mm'

  // Floppy Disk, File, Memory Stick
  | 'AAC'
  | 'AIFC'
  | 'AIFF'
  | 'ALAC'
  | 'AMR'
  | 'APE'
  | 'AVI'
  | 'DFF'
  | 'Disc Image'
  | 'DSF'
  | 'FLAC'
  | 'FLV'
  | 'MOV'
  | 'MP2'
  | 'MP3'
  | 'MPEG Video'
  | 'MPEG-4 Video'
  | 'ogg-vorbis'
  | 'Opus'
  | 'RA'
  | 'RM'
  | 'SHN'
  | 'SWF'
  | 'TTA'
  | 'WAV'
  | 'WavPack'
  | 'WMA'
  | 'WMV'
  | 'MP3 Surround'
  | '3.5"'
  | '5.25"'

  // Hybrid
  | 'CD-Record'
  | 'DualDisc'
  | 'DVDplus'
  | 'VinylDisc'

export type Format = {
  name: FormatName
  descriptions?: [FormatDescription]
  text?: string
}

export type Release = {
  uri: string
  title: string
  artists: [{ name: string; id: number }]
  tracklist: [
    {
      position: string
      title: string
      duration: string
      type_: 'heading' | 'track'
    }
  ]
  images: [{ resource_url: string }]
  formats: [Format]
  labels: [
    {
      name: string
      catno: string
    }
  ]
  released?: string
}

export type Master = { main_release: number }
