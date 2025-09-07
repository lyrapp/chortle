# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
# No build process required - static HTML/JS/CSS
# Open index.html in browser or serve via local server
python -m http.server 8000  # or any static file server
# HTTPS required for camera access in production
```

### Debugging
```bash
# Open browser console and use:
ChortleDebug.help()           # Show debug commands
ChortleDebug.getState()       # View app state  
ChortleDebug.generateTestLink() # Create test link
ChortleDebug.clearState()     # Reset app state
```

## Architecture Overview

### Modular JavaScript Architecture
Chortle v5.3 uses a modular vanilla JavaScript architecture with no frameworks:

- **`js/config.js`** - Global configuration, state management, utilities
- **`js/templates.js`** - Mad Lib templates and text rendering
- **`js/wizard.js`** - Step-by-step form system  
- **`js/video.js`** - Video recording/upload via Cloudinary
- **`js/app.js`** - Main application logic and page navigation
- **`js/init.js`** - Application initialization and startup
- **`js/props.js`** - Props/backgrounds system (experimental)

### Module Dependencies
```
init.js → config.js → templates.js/wizard.js/video.js → app.js
```

### Page Flow
1. **Intro page** - Welcome screen with "Get Started" 
2. **Template selection** - Choose from 8+ Mad Lib templates
3. **Wizard** - Step-by-step form filling
4. **Share page** - Generate and share link
5. **Reading view** - Linked users read & record video
6. **Playback view** - Original creator watches video

## Key Technical Details

### State Management
- Global state in `window.ChortleState` 
- Configuration in `window.ChortleConfig`
- Utilities in `window.ChortleUtils`
- No external state management libraries

### Video System
- **Provider**: Cloudinary (was api.video in older versions)
- **Recording**: MediaRecorder API, 60-second limit
- **Upload**: Direct to Cloudinary with upload presets
- **Playback**: Cloudinary's video player

### URL-Based Sharing
- Chortle data encoded in URL hash: `#chortle=<base64data>`
- Video links: `#video=<encodeddata>`
- Unicode-safe base64 encoding for international characters

### Mobile-First Design
- Responsive CSS with mobile.css breakpoints
- Native Web Share API integration
- Camera access optimization for mobile browsers

## Development Patterns

### Adding New Templates
Edit `js/templates.js`:
```javascript
'template-id': {
    title: 'Template Name',
    category: 'funny|adventure|romance|weird',
    description: 'Brief description', 
    icon: 'path/to/icon.png',
    template: 'Story text with {placeholder} fields',
    fields: [
        { name: 'placeholder', label: 'Prompt:', type: 'text' }
    ]
}
```

### Module Communication
- Direct function calls between modules
- Global state for shared data
- Event-driven architecture avoided for simplicity

### Error Handling
- Browser console logging with context
- User-friendly error messages in UI
- Graceful degradation for unsupported features

## Browser Requirements
- Chrome 60+ (recommended)
- Firefox 55+, Safari 12+, Edge 79+
- **Required**: Camera access, localStorage, MediaRecorder API
- **Optional**: Web Share API, Wake Lock API

## Configuration

### Cloudinary Setup
Update `js/config.js`:
```javascript
CLOUDINARY: {
    cloudName: 'your-cloud',
    uploadPreset: 'your-preset'
}
```

### Feature Flags
```javascript
FEATURES: {
    propsEnabled: false,    // Props/backgrounds system
    propsDebug: false      // Debug logging
}
```

## Common Tasks

### Template Issues
- Check `js/templates.js` syntax
- Validate template IDs match usage
- Ensure all required fields are defined

### Video Not Working  
- Verify Cloudinary configuration
- Check HTTPS requirement
- Test MediaRecorder browser support

### Mobile Layout Problems
- Check `css/mobile.css` media queries  
- Test responsive breakpoints
- Verify touch/click event handling

## Deployment
- Static hosting only (Netlify, Vercel, GitHub Pages)
- No build process required
- **Must serve over HTTPS** for camera access
- Upload all files including css/, js/, icons/ directories