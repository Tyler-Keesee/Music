# Offline Music Player

A browser-based music player with service-worker caching and progressive-web-app experiments. Offline operation depends on installed service-worker support and successfully cached assets; do not assume all media is available offline.

## Features

- ✅ Fully offline functionality
- ✅ Works in airplane mode
- ✅ Responsive design for all devices
- ✅ Progressive Web App (PWA) support
- ✅ Video and audio playback support
- ✅ Offline caching of media files
- ✅ Offline search capability
- ✅ Native app-like experience

## Usage

1. Open the application in your web browser
2. The app will automatically cache all media files and resources
3. Once essential assets and media are cached successfully, supported offline features can work without a network connection
4. You can access the app in airplane mode or without internet connection
5. The app can be installed as a Progressive Web App on your device

## Offline Capabilities

- All media files (MP4, MP3) are cached locally
- Application assets are cached for offline use
- Works perfectly in airplane mode
- No internet connection required after initial load
- Persistent storage for media files

## Installation

1. Clone this repository
2. Serve the repository through HTTPS or a local web server (service workers do not run from `file://`)
3. Verify that the service worker installs and the desired media assets actually load before relying on offline caching
4. Install as a PWA by clicking the install button in your browser

## Technical Details

- Uses Service Workers for offline functionality
- Implements IndexedDB for persistent storage
- Uses Web Audio API for audio playback
- Supports both audio and video playback
- Fully responsive design using CSS Grid and Flexbox

## Requirements

- Modern web browser (Chrome, Firefox, Safari)
- PWA support (for installation)
- Offline storage capabilities

## Development

The application is built with vanilla JavaScript, CSS, and HTML for maximum compatibility and performance.

## License

MIT License

## Media availability and offline behavior

- Select **Add Media** to import your own audio or video files. The app attempts to save imported files to your browser's IndexedDB so they remain available when you reopen the app offline; this depends on available storage space and permissions.
- The app shell is cached by its service worker when opened on HTTPS or localhost. Importing large files may exceed browser storage quotas, so test offline playback before relying on it.
- Existing `music/` entries in this repository are small Git LFS pointer files, **not playable media served by GitHub Pages**. No licensed music or video is bundled in the deployed app.
- For local development use `python -m http.server 8000`, then open `http://localhost:8000/` rather than opening `index.html` via `file://`.
