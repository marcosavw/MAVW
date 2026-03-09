# ICF Events Directory

A modern React web application to browse and filter International Canoe Federation (ICF) events.

## Features

- 🔍 **Search**: Find events by name or location
- 🏷️ **Filter by Type**: Sprint, Slalom, Marathon, Wildwater, Polo, Dragon Boat
- 📍 **Filter by Location**: Quick filtering by event location
- 📅 **Event Details**: Date, location, type, and status for each event
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build
```

The built files will be in the `dist/` directory.

## Deployment to GitHub Pages

1. Push your code to GitHub repository
2. Go to repository Settings → Pages
3. Set "Build and deployment" source to "GitHub Actions"
4. The `dist/` folder will be served from `https://username.github.io/icf-events/`

## Project Structure

```
icf-events/
├── src/
│   ├── App.jsx          # Main app component with events data
│   ├── App.css          # Styling
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies
```

## Future Enhancements

- [ ] Integrate with real ICF API for live event data
- [ ] Add event details/registration links
- [ ] Calendar view
- [ ] Event notifications
- [ ] Dark mode toggle

## License

MIT
