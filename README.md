# BetterRYM

<a href="LICENSE"><img src="https://badgen.net/github/license/jgchk/better-rym" /></a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/better-rym/"><img src="https://badgen.net/amo/v/better-rym?color=orange" /></a>
<a href="https://chrome.google.com/webstore/detail/betterrym/pdbgknkejapoehgogijhmahhpiimlhjg"><img src="https://badgen.net/chrome-web-store/v/pdbgknkejapoehgogijhmahhpiimlhjg?color=green" /></a>

Enhancements for [RateYourMusic](https://rateyourmusic.com/) 🎧

## Features

- Add missing streaming links to Release pages
- Auto-fill the Add Release form
- Download hi-res cover art
- Filter your collection by release type
- Convert stream links to embed codes

## Workflows

### Prerequisites

1. Install [yarn](https://classic.yarnpkg.com)
2. Create a `.env` file at the project root with the following format:

```
SPOTIFY_ID=FJEIjfeiwqn342163nfowiqnefJ
SPOTIFY_SECRET=j3821r0nowJFDASEIQ8931ho
YOUTUBE_KEY=jf2138fFJ_432jf8f198flasj8
```

3. Create a [Spotify client ID/secret](https://developer.spotify.com/documentation/web-api/quick-start/) and a [YouTube API key](https://developers.google.com/youtube/v3/getting-started#before-you-start) and place them in the `.env` file.

### Development

```sh
# Install dependencies
yarn

# Start dev server
yarn dev
```

Load the unpacked extension from `./output` into your browser ([Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/#manifest), [Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/))

### Production

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
