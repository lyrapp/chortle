/* Chortle v5.4 - AI Background Segmentation System - FIXED */

window.ChortleBackgrounds = {
    // Background system state
    isInitialized: false,
    isEnabled: false,
    currentBackground: null,
    segmentation: null,
    backgroundImage: null,
    
    // Segmentation state
    segmentationActive: false,
    currentSegmentationMask: null,
    performanceMonitor: {
        frameCount: 0,
        startTime: 0,
        currentFPS: 0,
        averageFPS: 0
    },
    
    // Settings
    targetFPS: 15, // Reduced for mobile performance
    qualityThreshold: 12, // Minimum FPS before fallback
    
    // Template to background mapping
    templateBackgrounds: {
        'ghost-story': 'spooky-mansion.jpg',
        'sweet-dreams': 'dreamy-clouds.jpg',
        'silly-story': 'zoo-safari.jpg',
        'job-interview': 'office-building.jpg',
        'vacation': 'tropical-beach.jpg',
        'superhero': 'superhero-city.jpg',
        'love-letter': 'romantic-garden.jpg',
        'first-date': 'elegant-restaurant.jpg',
        'alien-invasion': 'alien-spaceship.jpg',
        'cooking-disaster': 'kitchen-restaurant.jpg'
    },

    // Initialize background system
    initialize: async function() {
        console.log('🎨 Initializing Chortle Backgrounds System v5.4');
        
        try {
            // Check if backgrounds are enabled
            if (!window.ChortleConfig?.FEATURES?.backgroundsEnabled) {
                console.log('Backgrounds disabled by feature flag');
                return false;
            }
            
            // Check browser capabilities
            if (!this.checkBrowserSupport()) {
                console.log('Browser does not support background segmentation');
                return false;
            }
            
            // Load MediaPipe Selfie Segmentation
            await this.loadSegmentation();
            
            this.isInitialized = true;
            console.log('✅ Background system initialized successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Background initialization failed:', error);
            this.handleBackgroundError('Failed to initialize background system');
            return false;
        }
    },

    // Check browser support for background features
    checkBrowserSupport: function() {
        // Check for required APIs
        const hasWebGL = !!window.WebGLRenderingContext;
        const hasCanvas = !!window.CanvasRenderingContext2D;
        const hasUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        
        return hasWebGL && hasCanvas && hasUserMedia;
    },

    // Load MediaPipe Selfie Segmentation library
    loadSegmentation: async function() {
        console.log('Loading MediaPipe Selfie Segmentation...');
        
        try {
            // Load MediaPipe from CDN
            if (!window.SelfieSegmentation) {
                await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js');
                await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
            }
            
            // Initialize Selfie Segmentation
            this.segmentation = new SelfieSegmentation({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
                }
            });
            
            // Configure segmentation for performance
            this.segmentation.setOptions({
                modelSelection: 0, // 0 = general model (faster), 1 = landscape model (better quality)
                selfieMode: true
            });
            
            // Set up result handler
            this.segmentation.onResults((results) => {
                this.processSegmentationResults(results);
            });
            
            console.log('✅ MediaPipe Selfie Segmentation loaded');
            
        } catch (error) {
            console.error('❌ Failed to load segmentation:', error);
            throw new Error('Background segmentation unavailable');
        }
    },

    // Load external script utility
    loadScript: function(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve(); // Already loaded
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    // Enable backgrounds for current template
    enableBackgroundsForTemplate: function(templateKey) {
        console.log('🎨 Enabling backgrounds for template:', templateKey);
        
        if (!this.isInitialized) {
            console.warn('Background system not initialized');
            return false;
        }
        
        const backgroundFile = this.templateBackgrounds[templateKey];
        if (!backgroundFile) {
            console.log('No background defined for template:', templateKey);
            this.isEnabled = false;
            this.currentBackground = null;
            return false;
        }
        
        // Set current background
        this.currentBackground = backgroundFile;
        this.loadBackgroundImage(backgroundFile);
        this.isEnabled = true;
        
        console.log('✅ Backgrounds enabled with:', backgroundFile);
        return true;
    },

    // Load background image
    loadBackgroundImage: function(backgroundFile) {
        const img = new Image();
        img.onload = () => {
            this.backgroundImage = img;
            console.log('✅ Background image loaded:', backgroundFile);
        };
        img.onerror = () => {
            console.error('❌ Failed to load background:', backgroundFile);
            this.handleBackgroundError(`Failed to load background: ${backgroundFile}`);
        };
        img.src = `backgrounds/${backgroundFile}`;
    },

    // Start background segmentation for video element
    startSegmentation: function(videoElement) {
        if (!this.isInitialized || !this.isEnabled) {
            console.log('Backgrounds not enabled for segmentation');
            return;
        }
        
        console.log('🎨 Starting background segmentation...');
        this.segmentationActive = true;
        this.startPerformanceMonitoring();
        
        // Start segmentation loop
        this.segmentationLoop(videoElement);
    },

    // Segmentation processing loop
    segmentationLoop: function(videoElement) {
        if (!this.segmentationActive || !videoElement) return;
        
        // Send frame to MediaPipe
        if (this.segmentation && videoElement.videoWidth > 0) {
            this.segmentation.send({ image: videoElement });
        }
        
        // Continue loop at target frame rate
        setTimeout(() => this.segmentationLoop(videoElement), 1000 / this.targetFPS);
    },

    // Process segmentation results from MediaPipe
    processSegmentationResults: function(results) {
        if (!this.segmentationActive) return;
        
        // Store current segmentation mask
        this.currentSegmentationMask = results.segmentationMask;
        
        // Update performance monitoring
        this.updatePerformanceMonitoring();
        
        // If FPS drops too low, disable backgrounds
        if (this.performanceMonitor.averageFPS < this.qualityThreshold) {
            console.warn('⚠️ Performance below threshold, considering fallback');
        }
    },

    // Apply background to canvas during recording
    applyBackgroundToCanvas: function(canvas, ctx, videoElement) {
        if (!this.isEnabled || !this.backgroundImage || !this.currentSegmentationMask) {
            // No background processing, just draw video
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            return;
        }

        try {
            // Create temporary canvas for segmentation processing
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;

            // Draw background first
            tempCtx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);

            // Draw video with mask applied
            tempCtx.globalCompositeOperation = 'source-over';
            tempCtx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            // Apply segmentation mask to remove background from person
            tempCtx.globalCompositeOperation = 'destination-in';
            tempCtx.drawImage(this.currentSegmentationMask, 0, 0, canvas.width, canvas.height);

            // Composite the result onto the main canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(tempCanvas, 0, 0);

        } catch (error) {
            console.error('❌ Background compositing failed:', error);
            // Fallback to normal video
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        }
    },

    // Stop background segmentation
    stopSegmentation: function() {
        console.log('🛑 Stopping background segmentation');
        this.segmentationActive = false;
        this.currentSegmentationMask = null;
    },

    // Disable backgrounds
    disableBackgrounds: function() {
        console.log('🎨 Disabling backgrounds');
        this.stopSegmentation();
        this.isEnabled = false;
        this.currentBackground = null;
        this.backgroundImage = null;
    },

    // Handle background-related errors
    handleBackgroundError: function(message) {
        console.error('❌ Background Error:', message);
        
        // Disable backgrounds on error
        this.disableBackgrounds();
        
        // Show user-friendly message if in debug mode
        if (window.ChortleConfig?.FEATURES?.backgroundsDebug) {
            this.showUserMessage(`Background feature temporarily disabled: ${message}`, 'warning');
        }
    },

    // Show message to user
    showUserMessage: function(message, type = 'info') {
        // Create or update user notification
        let notification = document.getElementById('background-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'background-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 6px;
                z-index: 9999;
                font-size: 14px;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;
            document.body.appendChild(notification);
        }

        // Style based on type
        const styles = {
            info: { background: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' },
            warning: { background: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' },
            error: { background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
            success: { background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }
        };

        const style = styles[type] || styles.info;
        Object.assign(notification.style, style);
        notification.textContent = message;

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },

    // Start performance monitoring
    startPerformanceMonitoring: function() {
        this.performanceMonitor.startTime = Date.now();
        this.performanceMonitor.frameCount = 0;
        this.performanceMonitor.currentFPS = 0;
        this.performanceMonitor.averageFPS = 0;
    },

    // Update performance monitoring
    updatePerformanceMonitoring: function() {
        this.performanceMonitor.frameCount++;
        const elapsed = (Date.now() - this.performanceMonitor.startTime) / 1000;
        
        if (elapsed > 0) {
            this.performanceMonitor.currentFPS = this.performanceMonitor.frameCount / elapsed;
            this.performanceMonitor.averageFPS = this.performanceMonitor.currentFPS;
        }
    },

    // Check if background is available for template
    hasBackgroundForTemplate: function(templateKey) {
        return !!this.templateBackgrounds[templateKey];
    },

    // Get background filename for template
    getBackgroundForTemplate: function(templateKey) {
        return this.templateBackgrounds[templateKey] || null;
    },

    // Cleanup background system
    cleanup: function() {
        console.log('🧹 Cleaning up background system');
        
        this.stopSegmentation();
        this.disableBackgrounds();
        
        if (this.segmentation) {
            this.segmentation.close();
            this.segmentation = null;
        }
        
        this.isInitialized = false;

        // Remove user notifications
        const notification = document.getElementById('background-notification');
        if (notification) {
            notification.remove();
        }
    },

    // Get performance metrics
    getPerformanceMetrics: function() {
        return {
            currentFPS: Math.round(this.performanceMonitor.currentFPS),
            averageFPS: Math.round(this.performanceMonitor.averageFPS),
            frameCount: this.performanceMonitor.frameCount,
            isAboveThreshold: this.performanceMonitor.averageFPS >= this.qualityThreshold
        };
    },

    // Debug: Get current background state
    getDebugInfo: function() {
        return {
            isInitialized: this.isInitialized,
            isEnabled: this.isEnabled,
            currentBackground: this.currentBackground,
            hasSegmentation: !!this.segmentation,
            segmentationActive: this.segmentationActive,
            backgroundImage: !!this.backgroundImage,
            hasMask: !!this.currentSegmentationMask,
            performance: this.getPerformanceMetrics(),
            templateBackgrounds: Object.keys(this.templateBackgrounds),
            config: {
                backgroundsEnabled: window.ChortleConfig?.FEATURES?.backgroundsEnabled,
                backgroundsDebug: window.ChortleConfig?.FEATURES?.backgroundsDebug
            }
        };
    }
};

// Export for debugging
if (window.ChortleDebug) {
    window.ChortleDebug.backgrounds = window.ChortleBackgrounds;
}

// Auto-initialize if feature is enabled
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure config is loaded
    setTimeout(() => {
        if (window.ChortleConfig?.FEATURES?.backgroundsEnabled) {
            window.ChortleBackgrounds.initialize().then(success => {
                if (success) {
                    console.log('🎨 Background system ready');
                } else {
                    console.log('⚠️ Background system failed to initialize');
                }
            });
        } else {
            console.log('🎨 Background system disabled by feature flag');
        }
    }, 100);
});
