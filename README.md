# BetterRYM

Enhancements for [RateYourMusic](https://rateyourmusic.com/) 🎧

## Features

- Add missing streaming links to Release pages
- Auto-fill the Add Release form

## Workflows

Prerequisite: [Yarn](https://yarnpkg.com)

### Development

```sh
# Install dependencies
yarn

# Start dev server
yarn dev
```

Load the unpacked extension from `./output` into your browser ([Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/#manifest), [Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/), [Edge](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading))

### Production

```sh
# Install dependencies
yarn

# Build for all browsers
yarn prod

# Build for individual browsers
yarn prod:chrome
yarn prod:firefox
yarn prod:edge
```

## License

[GPL-3.0](https://github.com/jgchk/betterRYM/blob/main/LICENSE)
