# Chortle Development Documentation
*Always include this file when working with Claude on Chortle updates*

## Current Status: v5.1 - Modular Architecture ✅

**IMPORTANT**: Chortle is now a **modular multi-file application**, NOT a single HTML file.

## Architecture Overview

### File Structure
```
chortle/
├── index.html              # Entry point (loads modules)
├── README.md               # User documentation
├── .gitignore             # Git ignore rules
├── css/
│   ├── styles.css         # Core styles
│   └── mobile.css         # Mobile-responsive styles
└── js/
    ├── config.js          # Configuration & global state
    ├── templates.js       # Mad Lib templates & management
    ├── wizard.js          # Step-by-step form system
    ├── video.js           # Recording & playback
    ├── history.js         # NEW: localStorage history tracking
    ├── app.js             # Main application logic
    └── init.js            # Application initialization
```

### Module Dependencies
```
init.js (startup)
  ↓
config.js (loaded first)
  ↓
templates.js, history.js (data & storage)
  ↓
wizard.js, video.js (features)
  ↓
app.js (orchestrates everything)
```

## Key Features (v5.1)

### 🆕 History System
- **File**: `js/history.js`
- **Purpose**: Track created Chortles and their status
- **Storage**: localStorage (browser-based)
- **Statuses**: 
  - `pending` - Link shared, waiting for video
  - `completed` - Video received
  - `expired` - Old/abandoned
- **Integration**: Hooks into app.js for status updates

### Core Features
- **Templates**: 8 Mad Lib templates across 4 categories
- **Wizard Flow**: Step-by-step form filling
- **Video**: 30-second recordings via api.video
- **Mobile-First**: Responsive design optimized for mobile
- **No Accounts**: Link-based sharing system

## Technical Stack

- **Frontend**: Vanilla JavaScript (ES6+), Modern CSS
- **Video**: api.video cloud service (sandbox)
- **Storage**: localStorage for history
- **Architecture**: Module pattern, no frameworks
- **Responsive**: Mobile-first design

## Development Workflow

### Making Changes
1. **Identify target module** (e.g., templates.js for new Mad Libs)
2. **Include dependencies** if change affects multiple modules
3. **Test integration** between modules
4. **Update version** if significant changes

### Version Numbering
- **Major (x.0)**: Architecture changes, new core features
- **Minor (x.x)**: New templates, feature improvements  
- **Patch (x.x.x)**: Bug fixes, small tweaks

### Testing Checklist
- [ ] Template selection works
- [ ] Wizard flow completes
- [ ] Link generation/copying works
- [ ] Video recording on mobile
- [ ] Video playback with shared links
- [ ] History tracking (if applicable)
- [ ] Cross-browser compatibility

## API Configuration

### api.video (Video Service)
```javascript
API_VIDEO: {
    apiKey: '5KgKV3AkcCXrvHhs2FnSZrTVyrvwyC5K11qNnNvC70Z',
    environment: 'sandbox', // Free with watermarks
    uploadEndpoint: 'https://ws.api.video/upload'
}
```

### Current Limitations
- 30-second video limit (sandbox)
- Watermarked videos
- Public videos only (sandbox requirement)

## Common Update Patterns

### Adding New Templates
**File**: `js/templates.js`
```javascript
'new-template-id': {
    title: 'Template Name',
    category: 'funny|adventure|romance|weird',
    description: 'Brief description',
    template: 'Mad lib text with {placeholders}',
    fields: [
        { name: 'placeholder', label: 'Prompt text:', type: 'text' }
    ]
}
```

### Adding New Features
- **Update relevant module** (wizard.js, video.js, etc.)
- **Update app.js** if new coordination needed
- **Update config.js** for new settings
- **Update mobile.css** for responsive behavior

### Debugging
**Browser Console Commands**:
- `ChortleDebug.help()` - Show available commands
- `ChortleDebug.getState()` - Current app state
- `ChortleDebug.showHistory()` - History table
- `ChortleDebug.testTemplate()` - Generate test link

## Integration Points

### History ↔ App Integration
- **Creation**: app.js calls `ChortleHistory.saveChortle()`
- **Completion**: video.js calls `ChortleApp.updateChortleStatus()`
- **Status Tracking**: Automatic pending → completed flow

### Module Communication
- **Global State**: `window.ChortleState` (config.js)
- **Utilities**: `window.ChortleUtils` (config.js)
- **Events**: Direct function calls between modules
- **No Events**: Simple function calls, no complex pub/sub

## Update Request Format

### For New Conversations with Claude:
```
I'm updating Chortle v5.1 (modular architecture).

Files needed:
- [specific module file, e.g., js/templates.js]
- [this documentation file]

Change requested:
[specific change description]

Context: Chortle is a Mad Libs app with modular JS architecture,
localStorage history tracking, and api.video integration.
```

## Deployment

### Static Hosting
- Upload all files to hosting service
- Ensure HTTPS (required for camera access)
- No build process needed (vanilla JS)

### Recommended Hosts
- Netlify (drag & drop)
- Vercel
- GitHub Pages

## Troubleshooting

### Common Issues
- **"Template not found"**: Check templates.js syntax
- **Video not working**: Check api.video key and HTTPS
- **History not saving**: Check localStorage browser support
- **Mobile layout broken**: Check mobile.css media queries

### Browser Requirements
- Chrome 60+ (recommended)
- Firefox 55+
- Safari 12+
- Edge 79+
- **Required**: Camera access, localStorage support

## Migration Notes (v4 → v5)

**BREAKING CHANGE**: Moved from single HTML file to modular architecture
- **Old**: All code in one chortle_vX.html file
- **New**: Separated into modules with index.html entry point
- **Impact**: All old single-file versions are obsolete
- **Benefits**: Better maintainability, cleaner code, easier debugging

## Next Features (Roadmap)
- [ ] Remove api.video watermarks (paid tier)
- [ ] Template favorites/ratings
- [ ] Social sharing integration  
- [ ] Custom template creation
- [ ] Analytics integration
