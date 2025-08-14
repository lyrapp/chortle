/* Chortle v5.3 - Props System with Face Detection */

window.ChortleProps = {
    // Props system state
    isInitialized: false,
    isEnabled: false,
    currentProp: null,
    faceDetection: null,
    propImage: null,
    
    // Face detection state
    faceResults: null,
    detectionActive: false,
    
    // Performance settings
    detectionFrameRate: 15, // FPS for face detection (mobile-optimized)
    
    // Template to prop mapping (UPDATED with your filename changes)
    templateProps: {
        'ghost-story': 'ghost-hat.png',
        'sweet-dreams': 'sleep-mask.png', 
        'silly-story': 'animal-ears.png',
        'job-interview': 'tie.png',
        'vacation': 'sunglasses.png',
        'superhero': 'superhero-mask.png', // UPDATED: was superhero-cape.png
        'love-letter': 'heart-glasses.png',
        'first-date': 'bowtie.png',
        'alien-invasion': 'alien-hat.png', // UPDATED: was alien-antenna.png
        'cooking-disaster': 'chef-hat.png'
    },

    // Initialize props system
    initialize: async function() {
        console.log('🎭 Initializing Chortle Props System v5.3');
        
        try {
            // Check if props are enabled
            if (!window.ChortleConfig?.FEATURES?.propsEnabled) {
                console.log('Props disabled by feature flag');
                return false;
            }
            
            // Load MediaPipe Face Detection
            await this.loadFaceDetection();
            
            this.isInitialized = true;
            console.log('✅ Props system initialized successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Props initialization failed:', error);
            this.handlePropsError('Failed to initialize props system');
            return false;
        }
    },

    // Load MediaPipe Face Detection library
    loadFaceDetection: async function() {
        console.log('Loading MediaPipe Face Detection...');
        
        try {
            // Load MediaPipe from CDN
            if (!window.FaceDetection) {
                await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js');
                await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
            }
            
            // Initialize Face Detection
            this.faceDetection = new FaceDetection({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
                }
            });
            
            // Configure detection
            this.faceDetection.setOptions({
                model: 'short', // Optimized for close-range selfies
                minDetectionConfidence: 0.5
            });
            
            // Set up result handler
            this.faceDetection.onResults((results) => {
                this.faceResults = results;
                this.processFaceResults(results);
            });
            
            console.log('✅ MediaPipe Face Detection loaded');
            
        } catch (error) {
            console.error('❌ Failed to load face detection:', error);
            throw new Error('Face detection unavailable');
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

    // Enable props for current template
    enablePropsForTemplate: function(templateKey) {
        console.log('🎭 Enabling props for template:', templateKey);
        
        if (!this.isInitialized) {
            console.warn('Props system not initialized');
            return false;
        }
        
        const propFile = this.templateProps[templateKey];
        if (!propFile) {
            console.log('No prop defined for template:', templateKey);
            return false;
        }
        
        // Load prop image
        this.loadPropImage(propFile);
        this.isEnabled = true;
        
        console.log('✅ Props enabled with:', propFile);
        return true;
    },

    // Load prop image
    loadPropImage: function(propFile) {
        const img = new Image();
        img.onload = () => {
            this.propImage = img;
            console.log('✅ Prop image loaded:', propFile);
        };
        img.onerror = () => {
            console.error('❌ Failed to load prop:', propFile);
            this.handlePropsError(`Failed to load prop: ${propFile}`);
        };
        img.src = `props/${propFile}`;
    },

    // Start face detection for video element
    startFaceDetection: function(videoElement) {
        if (!this.isInitialized || !this.isEnabled) {
            console.log('Props not enabled for face detection');
            return;
        }
        
        console.log('🔍 Starting face detection...');
        this.detectionActive = true;
        
        // Start detection loop with throttled frame rate
        this.detectionLoop(videoElement);
    },

    // Face detection loop (throttled for performance)
    detectionLoop: function(videoElement) {
        if (!this.detectionActive || !videoElement) return;
        
        // Send frame to MediaPipe (throttled)
        if (this.faceDetection && videoElement.videoWidth > 0) {
            this.faceDetection.send({ image: videoElement });
        }
        
        // Continue loop at reduced frame rate
        setTimeout(() => {
            this.detectionLoop(videoElement);
        }, 1000 / this.detectionFrameRate);
    },

     // Process face detection results
    processFaceResults: function(results) {
        if (!results.detections || results.detections.length === 0) {
            // No face detected
            this.faceResults = null;
            return;
        }
        
        // Use first detected face
        const face = results.detections[0];
        this.faceResults = {
            bbox: face.boundingBox,
            landmarks: face.landmarks,
            confidence: face.score || 0.5  // FIXED: Handle undefined score
        };
        
        // Debug logging (can be removed in production)
        if (window.ChortleConfig?.FEATURES?.propsDebug) {
            console.log('Face detected with confidence:', this.faceResults.confidence);
        }
    },

    // Draw prop on canvas - FIXED POSITIONING VERSION
    drawPropOnCanvas: function(canvas, ctx) {
        console.log('🎨 Drawing prop called:', {
            enabled: this.isEnabled,
            propImage: !!this.propImage,
            canvasSize: `${canvas.width}x${canvas.height}`
        });
        
        if (!this.isEnabled || !this.propImage) {
            console.log('❌ Prop drawing skipped - missing requirements');
            return;
        }
        
        try {
            // FIXED POSITIONING - center-top of video (works without face detection)
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            // Position prop at center-top
            const propWidth = canvasWidth * 0.3; // 30% of video width
            const propHeight = (this.propImage.height / this.propImage.width) * propWidth;
            const propX = (canvasWidth - propWidth) / 2; // Center horizontally
            const propY = canvasHeight * 0.1; // 10% from top
            
            console.log('🎨 Drawing prop at:', { propX, propY, propWidth, propHeight });
            
            // Draw prop
            ctx.globalAlpha = 0.9;
            ctx.drawImage(this.propImage, propX, propY, propWidth, propHeight);
            ctx.globalAlpha = 1.0;
            
            console.log('✅ Prop drawn successfully');
            
        } catch (error) {
            console.error('❌ Error drawing prop:', error);
        }
    },
    
        // Stop face detection
        stopFaceDetection: function() {
            console.log('🛑 Stopping face detection');
            this.detectionActive = false;
            this.faceResults = null;
        },
    
        // Disable props
        disableProps: function() {
            console.log('🚫 Disabling props');
            this.stopFaceDetection();
            this.isEnabled = false;
            this.currentProp = null;
            this.propImage = null;
        },
    
        // Handle props errors gracefully
        handlePropsError: function(message) {
            console.warn('Props error:', message);
            
            // Disable props on error to prevent breaking main app
            this.disableProps();
            
            // Show discrete error message (only in debug mode)
            if (window.ChortleConfig?.FEATURES?.propsDebug && window.ChortleApp?.showError) {
                window.ChortleApp.showError(`Props: ${message}`);
            }
        },

    // Check if props are available for template
    hasPropsForTemplate: function(templateKey) {
        return !!this.templateProps[templateKey];
    },

    // Get prop filename for template
    getPropForTemplate: function(templateKey) {
        return this.templateProps[templateKey] || null;
    },

    // Cleanup props system
    cleanup: function() {
        console.log('🧹 Cleaning up props system');
        
        this.stopFaceDetection();
        this.disableProps();
        
        if (this.faceDetection) {
            this.faceDetection.close();
            this.faceDetection = null;
        }
        
        this.isInitialized = false;
    },

    // Debug: Get current props state
    getDebugInfo: function() {
        return {
            isInitialized: this.isInitialized,
            isEnabled: this.isEnabled,
            currentProp: this.currentProp,
            hasFaceDetection: !!this.faceDetection,
            faceDetected: !!this.faceResults,
            faceConfidence: this.faceResults?.confidence || 0,
            propImage: !!this.propImage,
            templateProps: Object.keys(this.templateProps)
        };
    },

    // Debug: Test props with dummy face data
    testProps: function(templateKey = 'silly-story') {
        console.log('🧪 Testing props system...');
        
        if (!this.isInitialized) {
            console.error('Props not initialized');
            return;
        }
        
        // Enable props for template
        this.enablePropsForTemplate(templateKey);
        
        // Simulate face detection
        this.faceResults = {
            bbox: {
                xCenter: 0.5,
                yCenter: 0.4,
                width: 0.3,
                height: 0.4
            },
            confidence: 0.9
        };
        
        console.log('✅ Props test setup complete');
        console.log('Debug info:', this.getDebugInfo());
    }
};

// Export for debugging
if (window.ChortleDebug) {
    window.ChortleDebug.props = window.ChortleProps;
}

// Auto-initialize if feature is enabled
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure config is loaded
    setTimeout(() => {
        if (window.ChortleConfig?.FEATURES?.propsEnabled) {
            window.ChortleProps.initialize();
        }
    }, 100);
});
