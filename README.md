# chortle

Create hilarious Mad Libs and share video reactions with friends!

## Quick Start

1. Clone/download the project
2. Open `index.html` in a modern browser
3. Create a Mad Lib and share the link!

## Features

- 📝 10+ Mad Lib templates
- 📱 Mobile-optimized interface  
- 🎥 Video recording and sharing
- ☁️ Cloud video storage (api.video)
- 🔗 No account required - link-based sharing

## Browser Requirements

- Chrome 60+ (recommended)
- Firefox 55+
- Safari 12+
- Edge 79+

**Required:** Camera access for video recording

## Development

### File Structure
- `js/config.js` - Configuration and global state
- `js/templates.js` - Mad Lib templates and management
- `js/wizard.js` - Step-by-step form system
- `js/video.js` - Video recording and playback
- `js/app.js` - Main application logic
- `js/init.js` - Application initialization

### Adding New Templates
1. Edit `js/templates.js`
2. Add template object with required fields
3. Template automatically appears in UI

### Debug Mode
Open browser console and use:
- `ChortleDebug.help()` - Show debug commands
- `ChortleDebug.testTemplate()` - Generate test link
- `ChortleDebug.getState()` - View app state

## Deployment

### Static Hosting (Recommended)
- Netlify, Vercel, GitHub Pages
- Upload all files to hosting service
- Ensure HTTPS (required for camera access)

### API Configuration
- Uses api.video sandbox (free with watermark)
- For production: upgrade to paid api.video plan
- Update API key in `js/config.js`

## Version History

- **v5.0** - Modular architecture, improved mobile UX
- **v4.0** - Wizard-style interface
- **v3.0** - Enhanced UX with search and progress
- **v2.0** - Cloud video storage integration
- **v1.0** - Initial MVP

## Contributing

1. Create feature branch
2. Test on mobile + desktop
3. Update version number if needed
4. Update CHANGELOG.md
