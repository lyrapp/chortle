/* Chortle v5.4 - AI Background Segmentation System */

window.ChortleBackgrounds = {
    // Background system state
    isInitialized: false,
    isEnabled: false,
    currentBackground: null,
    segmentation: null,
    backgroundImage: null,
    
    // Segmentation state
    segmentationActive: false,
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
            return false;
        }
        
        // Load background image
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
        setTimeout(() => {
            this.segmentationLoop(videoElement);
        }, 1000 / this.targetFPS);
    },

    // Process segmentation results
    processSegmentationResults: function(results) {
        // Store segmentation mask for canvas rendering
        this.currentSegmentationMask = results.segmentationMask;
        
        // Update performance monitoring
        this.updatePerformanceMonitoring();
        
        // Check if performance is acceptable
        if (this.performanceMonitor.currentFPS < this.qualityThreshold) {
            console.warn('⚠️ Background segmentation performance below threshold');
            // Could implement automatic quality reduction here
        }
    },

    // Start performance monitoring
    startPerformanceMonitoring: function() {
        this.performanceMonitor.frameCount = 0;
        this.performanceMonitor.startTime = performance.now();
    },

    // Update performance metrics
    updatePerformanceMonitoring: function() {
        this.performanceMonitor.frameCount++;
        const elapsed = (performance.now() - this.performanceMonitor.startTime) / 1000;
        
        if (elapsed > 0) {
            this.performanceMonitor.currentFPS = this.performanceMonitor.frameCount / elapsed;
            
            // Update average FPS (exponential moving average)
            if (this.performanceMonitor.averageFPS === 0) {
                this.performanceMonitor.averageFPS = this.performanceMonitor.currentFPS;
            } else {
                this.performanceMonitor.averageFPS = 
                    (this.performanceMonitor.averageFPS * 0.9) + 
                    (this.performanceMonitor.currentFPS * 0.1);
            }
        }
    },

    // Draw background composite on canvas
    drawBackgroundOnCanvas: function(canvas, ctx, videoElement) {
        if (!this.isEnabled || !this.backgroundImage || !this.currentSegmentationMask) {
            // Draw normal video if backgrounds not available
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            return;
        }
        
        try {
            // Create temporary canvas for segmentation processing
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            // Draw background
            tempCtx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
            
            // Create segmentation mask
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = this.currentSegmentationMask.width;
            maskCanvas.height = this.currentSegmentationMask.height;
            const maskCtx = maskCanvas.getContext('2d');
            
            // Convert segmentation mask to image data
            const imageData = maskCtx.createImageData(maskCanvas.width, maskCanvas.height);
            const data = imageData.data;
            
            for (let i = 0; i < this.currentSegmentationMask.data.length; i++) {
                const pixelIndex = i * 4;
                const maskValue = this.currentSegmentationMask.data[i] * 255;
                
                data[pixelIndex] = maskValue;     // R
                data[pixelIndex + 1] = maskValue; // G
                data[pixelIndex + 2] = maskValue; // B
                data[pixelIndex + 3] = 255;       // A
            }
            
            maskCtx.putImageData(imageData, 0, 0);
            
            // Apply segmentation composite
            tempCtx.globalCompositeOperation = 'destination-out';
            tempCtx.drawImage(maskCanvas, 0, 0, canvas.width, canvas.height);
            
            // Draw person on top
            tempCtx.globalCompositeOperation = 'destination-over';
            tempCtx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            
            // Draw final composite to main canvas
            ctx.drawImage(tempCanvas, 0, 0);
            
        } catch (error) {
            console.error('❌ Error drawing background composite:', error);
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
        console.log('🚫 Disabling backgrounds');
        this.stopSegmentation();
        this.isEnabled = false;
        this.currentBackground = null;
        this.backgroundImage = null;
    },

    // Handle background errors gracefully
    handleBackgroundError: function(message) {
        console.warn('Background error:', message);
        
        // Disable backgrounds on error to prevent breaking main app
        this.disableBackgrounds();
        
        // Show discrete error message (only in debug mode)
        if (window.ChortleConfig?.FEATURES?.backgroundsDebug && window.ChortleApp?.showError) {
            window.ChortleApp.showError(`Backgrounds: ${message}`);
        }
    },

    // Check if backgrounds are available for template
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
            performance: this.getPerformanceMetrics(),
            templateBackgrounds: Object.keys(this.templateBackgrounds)
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
            window.ChortleBackgrounds.initialize();
        }
    }, 100);
});
