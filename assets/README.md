# Assets Directory

This directory contains the app's static assets:

- `icon.png` - App icon (1024x1024px)
- `splash.png` - Splash screen image
- `adaptive-icon.png` - Android adaptive icon
- `favicon.png` - Web favicon

For development, you can generate these using Expo's asset generation tools or use placeholder images.

To generate assets from a single icon:
```bash
npx @expo/image-utils generate-icons --icon-path path/to/icon.png
```

## Required Sizes

- **icon.png**: 1024x1024px (used for iOS and Android)
- **splash.png**: 1284x2778px (iPhone 13 Pro Max resolution)
- **adaptive-icon.png**: 1024x1024px (Android only)
- **favicon.png**: 48x48px (Web only)
