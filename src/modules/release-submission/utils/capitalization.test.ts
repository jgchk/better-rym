import { capitalize } from './capitalization'

describe('title caps', () => {
  const titles: (string | [string, string])[] = [
    'You Can Leave Your Hat On',
    'One Is For',
    'And You and I',
    'The Greatest Hits Of',
    'I Am the Walrus',
    'It Is What It Is',
    'That Was Then, This Is Now',
    // 'You Are So Beautiful',
    // 'This Is As Good As It Gets',
    'When You Walked Into My Life',
    'Live From Las Vegas',
    'The Boy With the Arab Strap',
    'The Man Who Sold the World',
    'In a Safe Place',
    // 'The Best of The Temptations',
    'Rattle and Hum',
    "It's Now or Never",
    "Nothin' but a Good Time",
    // 'Life Is But a Dream',
    // "Ain't But a Few of Us Left",
    // 'You Are But a Draft, a Long Rehearsal for a Show That Will Never Play',
    'I Know You Are but What Am I',
    "I Don't Know What It Is but I Like It",
    'Live at Woodstock',
    'Face to Face',
    'Death Cab for Cutie',
    'Pretty in Pink',
    'Spy vs. Spy',
    'Birds v. Worms',
    'Time After Time etc.',
    // "Keep On Rockin' in the Free World",
    // 'Come In From the Cold',
    'Nowhere to Run',
    'How to Dismantle an Atomic Bomb',
    'Song I Love to Sing',
    'Reality Used to Be a Friend of Mine',
    'Otis! The Definitive Otis Redding',
    'In Time: The Best of R.E.M.',
    "I'm Just a Singer (In a Rock 'n' Roll Band)",
    'The Go-Gos',
    'At the Drive-In',
    'The Boy With the X-Ray Eyes',
    'R.E.M.',
    'N.W.A.',
    // 'R.O.C.K. in the U.S.A.',
    "Rock 'n' Roll",
    "Will o' the Wisp",
    "Sweet Child o' Mine",
    // 'Nick Cave and The Bad Seeds',
    // 'Elvis Costello and The Attractions',
    // 'Huey Lewis and The News',
    // 'SpaceGhostPurrp',
    // 'NoMeansNo',
    // 'CunninLynguists',
    // 'HTRK',
    // 'GRMLN',
    'N R C S S S T',
    // 'IV V I IV',
    // 'VIXIVI',
    // 'VIIth Temple',
    'Forty Second (Alpha Remix)',
    'Forty Second [Alpha Remix]',
    'Forty Second {Alpha Remix}',
    'I See The',
    'Who Goes There (The Fiftieth Time The) Fiftieth Time',
    'Who Goes There [The Fiftieth Time The] Fiftieth Time',
    'Who Goes There {The Fiftieth Time The} Fiftieth Time',
    'I’m Ready',
    'Howžy',
    'Grand Theft Auto IV',
    'Mi Padre',
    'B$&@h Made',
    'B!@#h Made',
    'B$%^h Made',
    '"Incalls Only"',
    '“Incalls Only “',
    ['Edifice/Riftworm', 'Edifice / Riftworm'],
    ['Frozen Heart / A Cracked Sea', 'Frozen Heart / A Cracked Sea'],
    ['Frozen Heart  /    A Cracked Sea', 'Frozen Heart / A Cracked Sea'],
    ['Howdy - Extended Mix', 'Howdy (Extended Mix)'],
    ['This Thing - Vocal Mix', 'This Thing (Vocal Mix)'],
    ['Ya Ya  -     Ayo    Remix', 'Ya Ya (Ayo Remix)'],
    [
      'Some Remixes of Other Songs - Remixes',
      'Some Remixes of Other Songs (Remixes)',
    ],
    ['A Set - New Mixs', 'A Set (New Mixs)'],
    [
      'Take A Walk (Neo-Romantic Dima Remix)',
      'Take a Walk (Neo-Romantic Dima Remix)',
    ],
    'Everything Else Is Secondary (1-800 Girls Remix)',
  ]
  test.each(titles)('correctly capitalizes %p', (testCase) => {
    const [input, output] =
      typeof testCase === 'string'
        ? [testCase.toLowerCase(), testCase]
        : [testCase[0].toLowerCase(), testCase[1]]
    expect(capitalize(input, 'title-case')).toBe(output)
  })
})

describe('sentence caps', () => {
  const titles = [
    ['You Can Leave Your Hat On', 'You can leave your hat on'],
    ['One Is For', 'One is for'],
    ['Grand Theft Auto IV', 'Grand theft auto IV'],
  ]

  test.each(titles)('correctly capitalizes %p', (input, output) =>
    expect(capitalize(input.toLowerCase(), 'sentence-case')).toEqual(output)
  )
})
