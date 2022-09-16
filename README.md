# BetterRYM

<a href="LICENSE"><img src="https://badgen.net/github/license/jgchk/better-rym" /></a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/better-rym/"><img src="https://badgen.net/amo/v/better-rym?color=orange" /></a>
<a href="https://chrome.google.com/webstore/detail/betterrym/pdbgknkejapoehgogijhmahhpiimlhjg"><img src="https://badgen.net/chrome-web-store/v/pdbgknkejapoehgogijhmahhpiimlhjg?color=green" /></a>

Enhancements for [RateYourMusic](https://rateyourmusic.com/) 🎧

## Download

- [Chrome](https://chrome.google.com/webstore/detail/betterrym/pdbgknkejapoehgogijhmahhpiimlhjg)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/better-rym/)

## Features

- Add missing streaming links to Release pages
- Auto-fill the Add Release form
- Download hi-res cover art
- Filter your collection by release type
- Convert stream links to embed codes

## Contributing

I take any and all PRs. So far I've worked with a few talented developers and would love to work with more:

- ~lempamo: additional collection filters, label autofill, inline profile editing/markup preview, advanced autofill options, and speed/size optimizations
- ~code_gs: collection filters feature
- ~flushed_emoji: Melon import support
- ~echance:  featured/remix credit buttons and bug fixes

Issues are also always welcome. This is the best way to get my attention on a bug or feature request.

### Dev Environment

### Setup

1. Install [yarn](https://classic.yarnpkg.com)
2. Create a `.env` file at the project root with the following format:

```
SPOTIFY_ID=<client id>
SPOTIFY_SECRET=<client secret>
YOUTUBE_KEY=<api key>
DISCOGS_KEY=<key>
DISCOGS_SECRET=<secret>
```

3. Create a [Spotify client ID/secret](https://developer.spotify.com/documentation/web-api/quick-start/), [YouTube API key](https://developers.google.com/youtube/v3/getting-started#before-you-start), and a [Discogs application](https://www.discogs.com/settings/developers) and place them in the `.env` file.

### Dev Server

BetterRYM includes a dev server which will hot-reload your browser automatically as you work. It passes source maps and unminified code to the browser for easier debugging.

```sh
# Install dependencies
yarn

# Start dev server
yarn dev
```

Load the unpacked extension from `./output` into your browser ([Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/#manifest), [Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/))

### Production

Use this to generate a production build with minified code.

```sh
# Install dependencies
yarn

# Build for all browsers
yarn prod

# Build for individual browsers
yarn prod:chrome
yarn prod:firefox
```

## License

[GPL-3.0](https://github.com/jgchk/betterRYM/blob/main/LICENSE)
