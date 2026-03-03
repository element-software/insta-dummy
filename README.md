# insta-dummy

A dummy Instagram profile app — identical UI on mobile and web. Built as a film/video prop.

## Stack

| Tool | Purpose |
|---|---|
| [Expo](https://expo.dev) (SDK 55) | Cross-platform runtime (iOS · Android · Web) |
| [React Native Web](https://necolas.github.io/react-native-web/) | Render React Native components in the browser |
| [NativeWind](https://www.nativewind.dev) v4 | Tailwind CSS utility classes for React Native |
| [Tailwind CSS](https://tailwindcss.com) v3 | Utility-first CSS (shared via `packages/theme`) |
| [Turborepo](https://turbo.build) | Monorepo build orchestration |
| [TypeScript](https://www.typescriptlang.org) 5 | Strict types everywhere — source, config, and declaration files |
| AsyncStorage | Local photo persistence (no server required) |
| expo-image-picker | Pick photos from the device library |

## Monorepo structure

```
apps/
  mobile/          ← Expo app (iOS · Android · Web)
packages/
  theme/           ← Shared Tailwind config + design tokens
```

## Features

- Instagram-like profile page (top bar, avatar, stats, bio, story highlights, photo grid, bottom tab bar)
- Tap any empty grid cell to pick a photo from your device's library
- Selected photos persist locally — no server, no database, no API calls
- Single codebase for native **and** web, styled with Tailwind classes

## Get started

```sh
npm install
```

### Run on web
```sh
npm run web
# or directly:
cd apps/mobile && npx expo start --web
```

### Run on Android / iOS
```sh
cd apps/mobile && npx expo start --android
cd apps/mobile && npx expo start --ios
```

### Type-check all packages
```sh
npm run typecheck
```

### Build web for production
```sh
npm run build:web
```

## Shared theme

Edit `packages/theme/tailwind.config.ts` to change brand colours, spacing or typography across the whole app:

```js
colors: {
  brand: { pink: '#e1306c', blue: '#0095f6', dark: '#00376b' },
  ig:    { divider: '#dbdbdb', bg: '#f9f9f9', text: '#262626', ... },
}
```

Raw JS tokens are also exported from `packages/theme/index.js` for use outside Tailwind.

## Screenshot

![insta-dummy profile page](https://github.com/user-attachments/assets/3ace825f-0eb4-49f5-882a-57c4a5783b50)
