/* Chortle v5.3 - Fixed Configuration */

window.ChortleConfig = {
    // Cloudinary configuration
    CLOUDINARY: {
        cloudName: 'di5vqhebx',
        apiKey: '466825116782547',
        uploadEndpoint: 'https://api.cloudinary.com/v1_1/di5vqhebx/upload',
        uploadPreset: 'chortle_videos'
    },
    
    // App Settings
    APP: {
        maxRecordingTime: 60,
        version: '5.3',
        maxFileSize: 50 * 1024 * 1024,
        supportedVideoTypes: ['video/webm', 'video/mp4']
    },
    
    // Props Configuration (v5.3) - RE-ENABLED for debugging
    FEATURES: {
        propsEnabled: true, // Testing with placeholders
        propsDebug: true,   // Enable debug logging
        faceDetectionTimeout: 5000
    },
    
    // UI Configuration
    UI: {
        animationDuration: 300,
        autoScrollDelay: 300,
        copySuccessTimeout: 2000,
        errorDisplayTimeout: 8000,
        captionOverlay: {
            enabled: true,
            fontSize: '1.1em',
            lineHeight: '1.4',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            textColor: 'white',
            padding: '15px',
            maxLines: 3
        }
    }
};

// Global App State
window.ChortleState = {
    // Template system
    currentTemplate: null,
    currentCategory: 'all',
    searchTerm: '',
    
    // Wizard system
    currentStep: 0,
    wizardData: {},
    
    // Video system
    mediaRecorder: null,
    recordedChunks: [],
    stream: null,
    recordingTimer: null,
    recordingSeconds: 0,
    
    // UI state
    isLoading: false,
    currentPage: 'intro-page'
};

// Utility Functions
window.ChortleUtils = {
    // Generate unique IDs
    generateId: function() {
        return 'chortle_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    // Device detection
    isMobile: function() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Screen size detection
    isSmallScreen: function() {
        return window.innerWidth <= 768;
    },
    
    // URL handling for iframe context
    getBaseUrl: function() {
        if (window.location.origin === 'null' || window.location.origin.includes('srcdoc')) {
            // We're in an iframe/artifact context, use relative URL
            return window.location.href.split('#')[0];
        } else {
            // Normal context
            return window.location.origin + window.location.pathname;
        }
    },
    
    // Native sharing with fallback to copy
    shareUrl: async function(url, title = 'Check out my Chortle!') {
        // Try native Web Share API first (mobile browsers)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: 'I made a Chortle for you!',
                    url: url
                });
                return { success: true, method: 'native' };
            } catch (err) {
                // User cancelled or error - fall back to copy
                console.log('Native share cancelled or failed:', err);
            }
        }
        
        // Fallback to clipboard
        const copySuccess = await this.copyToClipboard(url);
        return { 
            success: copySuccess, 
            method: copySuccess ? 'clipboard' : 'failed' 
        };
    },
    
    // Copy to clipboard with fallback
    copyToClipboard: async function(text) {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                console.warn('Clipboard API failed, using fallback');
                return this.fallbackCopy(text);
            }
        } else {
            return this.fallbackCopy(text);
        }
    },
    
    // Fallback copy method
    fallbackCopy: function(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    },
    
    // Auto-scroll disabled
    scrollToElement: function(elementId, delay = 300) {
        // Auto-scroll functionality disabled
    },
    
    // Haptic feedback
    vibrate: function(pattern) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    },
    
    // Wake lock for recording
    requestWakeLock: async function() {
        if ('wakeLock' in navigator) {
            try {
                const wakeLock = await navigator.wakeLock.request('screen');
                return wakeLock;
            } catch (err) {
                console.warn('Wake lock failed:', err);
                return null;
            }
        }
        return null;
    },
    
    // Error logging
    logError: function(error, context = '') {
        console.error(`Chortle Error ${context}:`, error);
        // In production, you'd send this to your error tracking service
    },
    
    // Performance timing
    startTimer: function(name) {
        if (window.performance && window.performance.mark) {
            window.performance.mark(`chortle-${name}-start`);
        }
    },
    
    endTimer: function(name) {
        if (window.performance && window.performance.mark && window.performance.measure) {
            window.performance.mark(`chortle-${name}-end`);
            window.performance.measure(`chortle-${name}`, `chortle-${name}-start`, `chortle-${name}-end`);
        }
    },
    
    // Data validation
    validateChortleData: function(data) {
        if (!data || typeof data !== 'object') return false;
        if (!data.template || typeof data.template !== 'string') return false;
        
        // Check if template exists
        if (!window.ChortleTemplates || !window.ChortleTemplates.templates[data.template]) {
            return false;
        }
        
        return true;
    },
    
    // URL encoding/decoding (Unicode-safe)
    encodeChortleData: function(data) {
        try {
            console.log('🔍 Encoding chortle data:', data);
            
            if (!data || typeof data !== 'object') {
                console.error('❌ Invalid data for encoding:', data);
                return null;
            }
            
            // Handle link data vs chortle data differently
            if (data.videoId && data.chortle) {
                console.log('📹 Encoding link data with video ID');
                const jsonString = JSON.stringify(data);
                console.log('📝 Link JSON string length:', jsonString.length);
                
                // Use Unicode-safe encoding
                const encodedData = this.unicodeSafeEncode(jsonString);
                console.log('✅ Encoded link data successfully');
                return encodedData;
            }
            
            // This is chortle data, check for template
            if (!data.template) {
                console.error('❌ Missing template in data:', data);
                console.error('🔍 Available keys:', Object.keys(data));
                return null;
            }
            
            console.log(`📋 Template: ${data.template}`);
            
            // Clean the data to remove any problematic values
            const cleanData = {};
            Object.keys(data).forEach(key => {
                const value = data[key];
                console.log(`🔍 Processing field ${key}:`, typeof value, value);
                
                // Only include string and number values
                if (typeof value === 'string' || typeof value === 'number') {
                    // Check for problematic characters
                    if (typeof value === 'string') {
                        const hasUnicode = /[^\x00-\x7F]/.test(value);
                        if (hasUnicode) {
                            console.log(`🌏 Unicode detected in ${key}:`, value);
                        }
                    }
                    cleanData[key] = value;
                } else {
                    console.warn('⚠️ Skipping non-serializable value:', key, typeof value, value);
                }
            });
            
            console.log('🧹 Cleaned data:', cleanData);
            
            const jsonString = JSON.stringify(cleanData);
            console.log('📝 JSON string length:', jsonString.length);
            console.log('📝 JSON preview:', jsonString.substring(0, 100) + '...');
            
            // Use Unicode-safe encoding instead of btoa
            const encodedData = this.unicodeSafeEncode(jsonString);
            console.log('✅ Encoded data successfully, length:', encodedData?.length);
            
            return encodedData;
        } catch (error) {
            console.error('❌ Error encoding chortle data:', error);
            console.error('🔍 Error stack:', error.stack);
            console.error('📊 Data that failed to encode:', data);
            this.logError(error, 'encoding chortle data');
            return null;
        }
    },

    // Unicode-safe base64 encoding
    unicodeSafeEncode: function(str) {
        try {
            // Convert Unicode string to UTF-8 bytes, then to base64
            const utf8Bytes = new TextEncoder().encode(str);
            const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
            return btoa(binaryString);
        } catch (error) {
            console.error('❌ Unicode encoding failed:', error);
            console.error('🔍 String preview:', str.substring(0, 50));
            return null;
        }
    },

    // Unicode-safe base64 decoding  
    unicodeSafeDecode: function(encodedStr) {
        try {
            const binaryString = atob(encodedStr);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return new TextDecoder().decode(bytes);
        } catch (error) {
            console.error('❌ Unicode decoding failed:', error);
            return null;
        }
    },
        
    decodeChortleData: function(encodedData) {
        try {
            console.log('🔍 Decoding chortle data, length:', encodedData.length);
            const jsonString = this.unicodeSafeDecode(encodedData);
            if (!jsonString) {
                throw new Error('Failed to decode base64');
            }
            console.log('📝 Decoded JSON preview:', jsonString.substring(0, 100) + '...');
            const data = JSON.parse(jsonString);
            console.log('✅ Successfully decoded:', data);
            return data;
        } catch (error) {
            console.error('❌ Error decoding chortle data:', error);
            this.logError(error, 'decoding chortle data');
            return null;
        }
    },
    
    // Format Chortle text for caption overlay
    formatTextForCaptions: function(text) {
        // Remove HTML tags and convert to plain text for caption display
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        return tempDiv.textContent || tempDiv.innerText || '';
    },
    
    // Split text into caption chunks
    splitIntoChunks: function(text, maxChunkLength = 150) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        const chunks = [];
        let currentChunk = '';
        
        sentences.forEach(sentence => {
            const trimmed = sentence.trim();
            if ((currentChunk + ' ' + trimmed).length <= maxChunkLength) {
                currentChunk += (currentChunk ? ' ' : '') + trimmed;
            } else {
                if (currentChunk) chunks.push(currentChunk + '.');
                currentChunk = trimmed;
            }
        });
        
        if (currentChunk) chunks.push(currentChunk + '.');
        return chunks;
    }
};

// Debug helpers (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.ChortleDebug = {
        getState: () => window.ChortleState,
        getConfig: () => window.ChortleConfig,
        generateTestLink: () => {
            const testData = {
                template: 'silly-story',
                name: 'Bob',
                adjective1: 'sparkly',
                animal: 'giraffe',
                verb1: 'danced',
                place: 'Mars',
                adjective2: 'magnificent',
                number: 47
            };
            
            const encodedData = window.ChortleUtils.encodeChortleData(testData);
            const testUrl = window.ChortleUtils.getBaseUrl() + '#chortle=' + encodedData;
            
            console.log('Test URL generated:', testUrl);
            return testUrl;
        },
        clearState: () => {
            // Reset state for testing
            Object.assign(window.ChortleState, {
                currentTemplate: null,
                currentCategory: 'all',
                searchTerm: '',
                currentStep: 0,
                wizardData: {},
                mediaRecorder: null,
                recordedChunks: [],
                stream: null,
                recordingTimer: null,
                recordingSeconds: 0,
                isLoading: false,
                currentPage: 'intro-page'
            });
        }
    };
    
    console.log('Chortle Debug mode enabled. Use ChortleDebug.generateTestLink() to create test links.');
}
