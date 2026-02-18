# FlipBook App

A React application with page-flipping functionality using `react-pageflip-enhanced`.

## Features

- **Single Page Landscape Mode**: Displays one page at a time in landscape orientation
- **Image-Only Pages**: Each page shows a full image with smooth flip animations
- Consistent flip animation for both next and previous pages
- Responsive design that adapts to different screen sizes
- Interactive controls for navigation
- Jump to specific pages
- Visual feedback for current page and book state

## Key Configuration

- `singlePage={true}`: Forces single-page display with flip animation
- `usePortrait={false}`: Landscape mode only
- Images displayed with `object-fit: cover` for full-page coverage

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Customization

### Adding Your Own Images

Replace the `images` array in `src/FlipBook.jsx`:

```javascript
const images = [
  '/path/to/your/image1.jpg',
  '/path/to/your/image2.jpg',
  '/path/to/your/image3.jpg',
  // ... more images
];
```

### Adjusting Dimensions

Modify the aspect ratio in the `updateDimensions` function:

```javascript
let height = width * 0.75; // 4:3 landscape ratio
// or
let height = width * 0.5625; // 16:9 landscape ratio
```

### Changing Flip Speed

Update the `flippingTime` prop (in milliseconds):

```javascript
flippingTime={800} // Faster
flippingTime={1500} // Slower
```

## Library Documentation

This app uses [react-pageflip-enhanced](https://www.npmjs.com/package/react-pageflip-enhanced), which includes:

- Fixed portrait back-flip animation
- Single-page mode support
- Improved swipe gesture handling
- No external dependencies (vendored core)

## Browser Support

Works on all modern browsers with support for:
- Mouse events for desktop
- Touch/swipe gestures for mobile
- Responsive design for various screen sizes
