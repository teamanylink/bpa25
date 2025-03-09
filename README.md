# BPA25 Podcast App

A React Native podcast application with advanced audio player functionality.

## Features

- Podcast browsing and discovery
- Enhanced audio player with stable playback
- Swipeable bottom sheet design for podcast details
- Tab navigation for episodes, about, and briefs sections

## Key Components

### Audio Player

The app includes a completely rewritten audio player implementation that ensures reliable playback:

- Robust error recovery system
- Multi-strategy playback approach
- Better UI feedback during loading/buffering
- Consistent styling across mini and full-screen players

### Podcast Detail Interface

- Clean top section with large podcast image and metadata
- Bottom sheet with tab navigation
- Swipe gestures for expanding/collapsing the bottom sheet

## Technologies Used

- React Native with Expo
- Expo Router for navigation
- Expo AV for audio playback
- NativeWind (TailwindCSS) for styling
- Zustand for state management

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## License

MIT