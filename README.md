# StudyMateApp

A React Native app built with Expo for collaborative study, chat, and group management.

## Features
- Group study and collaboration
- Chat functionality
- To-do lists
- Profile management
- Study material sharing
- Video calls
- Notifications

## Setup

### Prerequisites
- Node.js (latest LTS recommended)
- npm (comes with Node.js)
- Expo CLI (`npm install -g expo-cli`)

### Installation
1. Clone the repository:
   ```
   git clone <repo-url>
   cd studymateapp
   ```
2. Install dependencies:
   ```
   npm install
   ```

### Running the App
1. Start Expo:
   ```
   npx expo start -c
   ```
   The `-c` flag clears the Metro cache.
2. Scan the QR code with Expo Go (Android/iOS) or run on emulator/device.

### Troubleshooting
- **WorkletsError (version mismatch):**
  1. Uninstall the app from your device/emulator.
  2. Delete `node_modules` and all cache folders (`.expo`, `.metro-cache`, `.cache`, `.parcel-cache`).
  3. Run `npm install`.
  4. Run `expo prebuild --clean`.
  5. Start Expo with `npx expo start -c`.
  6. Reinstall the app on your device/emulator.
- Ensure `babel.config.js` includes:
  ```js
  plugins: ['react-native-reanimated/plugin']
  ```
- Only one version of `react-native-reanimated` should be installed.

## Folder Structure
- `assets/` — Images and static assets
- `screens/` — App screens (chat, profile, groups, etc.)
- `App.js` — Main entry point
- `metro.config.js` — Metro bundler config
- `babel.config.js` — Babel config
- `package.json` — Project dependencies

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
ISC
