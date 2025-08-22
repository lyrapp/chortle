// Chortle App - Main Application Logic
// Version 5.4 - Fixed syntax errors in showCompletedChortle function

window.ChortleApp = {
    // Initialize the application
    init: function() {
        console.log('🚀 Initializing Chortle App v5.4...');
        
        // Setup error handling first
        this.setupErrorHandling();
        
        // Setup all event listeners
        this.setupEventListeners();
        
        // Setup navigation
        this.setupNavigation();
        
        // Setup intro page
        this.setupIntroPage();
        
        // Check for incoming shared links
        if (!this.checkForIncomingLinks()) {
            // Show intro page if no incoming links
            this.showPage('intro-page');
        }
        
        console.log('✅ Chortle App initialized successfully');
    },

    // Setup all event listeners
    setupEventListeners: function() {
        // Template selection
        document.addEventListener('click', (e) => {
            if (e.target.matches('.template-card')) {
                const templateId = e.target.dataset.template;
                if (templateId) {
                    this.selectTemplate(templateId);
                }
            }
        });

        // Share button
        const shareBtn = document.getElementById('share-chortle');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareChortle());
        }

        // Copy link button  
        const copyBtn = document.getElementById('copy-link');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyShareLink());
        }

        // Record video button
        const recordBtn = document.getElementById('record-video');
        if (recordBtn) {
            recordBtn.addEventListener('click', () => this.startVideoRecording());
        }

        // Play video button
        const playBtn = document.getElementById('play-video');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.playRecordedVideo());
        }
    },

    // Setup error handling
    setupErrorHandling: function() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showError('An unexpected error occurred. Please refresh the page.');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showError('A network or processing error occurred.');
        });
    },

    // Show specific page
    showPage: function(pageId) {
        console.log(`Showing page: ${pageId}`);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.ChortleState.currentPage = pageId;
            
            // Page-specific setup
            if (pageId === 'template-selection-page') {
                this.renderTemplates();
            } else if (pageId === 'reading-view') {
                this.setupReadingView();
            }
        } else {
            console.error(`Page not found: ${pageId}`);
        }
    },

    // Start new chortle creation
    startChortle: function() {
        console.log('Starting new chortle...');
        window.ChortleState.reset();
        this.showPage('template-selection-page');
    },

    // Create new chortle (reset and restart)
    createNewChortle: function() {
        console.log('Creating new chortle...');
        window.ChortleState.reset();
        this.showPage('template-selection-page');
    },

    // Render template cards
    renderTemplates: function() {
        const container = document.getElementById('template-grid');
        if (!container) {
            console.error('Template grid container not found');
            return;
        }

        const templates = window.ChortleTemplates.getAllTemplates();
        const isMobile = window.ChortleUtils.isSmallScreen();
        
        container.innerHTML = Object.keys(templates).map(templateId => {
            const template = templates[templateId];
            return `
                <div class="template-card" data-template="${templateId}">
                    <div class="template-icon">${this.getTemplateIcon(template.category)}</div>
                    <h3>${template.title}</h3>
                    <p class="template-description">${template.description}</p>
                    <div class="template-category">${template.category}</div>
                </div>
            `;
        }).join('');

        console.log(`Rendered ${Object.keys(templates).length} templates`);
    },

    // Get icon for template category
    getTemplateIcon: function(category) {
        const icons = {
            funny: '😂',
            adventure: '🗺️', 
            romance: '💕',
            weird: '🤪',
            mystery: '🔍',
            fantasy: '🧙‍♂️',
            action: '💥'
        };
        return icons[category] || '📝';
    },

    // Select a template and start wizard
    selectTemplate: function(templateId) {
        console.log(`Template selected: ${templateId}`);
        
        const template = window.ChortleTemplates.getTemplate(templateId);
        if (!template) {
            this.showError('Template not found');
            return;
        }

        window.ChortleState.selectedTemplate = templateId;
        
        // Start the wizard
        if (window.ChortleWizard) {
            window.ChortleWizard.start(templateId);
        } else {
            this.showError('Wizard not available');
        }
    },

    // Complete the chortle creation process
    completeChortle: function(formData) {
        console.log('Completing chortle with data:', formData);
        
        try {
            const templateId = window.ChortleState.selectedTemplate;
            if (!templateId) {
                throw new Error('No template selected');
            }

            // Add template to data
            const chortleData = {
                template: templateId,
                ...formData
            };

            // Generate the story
            const story = window.ChortleTemplates.renderTemplate(templateId, formData);
            
            // Store the data for sharing
            window.ChortleState.currentChortleData = chortleData;
            window.ChortleState.currentStory = story;
            
            // Generate share link
            const shareLink = this.generateShareLink(chortleData);
            window.ChortleState.currentShareLink = shareLink;
            
            console.log('Chortle completed successfully');
            this.showCompletedChortle(chortleData);
            
        } catch (error) {
            console.error('Error completing chortle:', error);
            this.showError('Failed to complete your chortle. Please try again.');
        }
    },

    // Show completed chortle - FIXED SYNTAX ERROR
    showCompletedChortle: function(data) {
        console.log('Showing completed chortle');
        
        if (!data || !data.template) {
            this.showError('Invalid chortle data. This link may be corrupted.');
            return;
        }

        const template = data.template;
        const templateData = { ...data };
        delete templateData.template;

        console.log('Looking for template:', template);

        const templateObj = window.ChortleTemplates.getTemplate(template);
        if (!templateObj) {
            console.error('Template not found:', template);
            this.showError('Unknown template. This chortle may be from a newer version.');
            return;
        }

        console.log('Template found, showing reading view');
        this.showPage('reading-view');

        // Enable backgrounds if available
        if (window.ChortleBackgrounds && window.ChortleConfig.FEATURES.backgroundsEnabled) {
            window.ChortleBackgrounds.enableBackgroundsForTemplate(template);
        }
        
        // Render the completed story
        const story = window.ChortleTemplates.renderTemplate(template, templateData);
        const storyContainer = document.getElementById('completed-story');
        if (storyContainer) {
            storyContainer.innerHTML = story;
        }

        // Store the complete chortle data for video recording
        window.ChortleState.currentChortleData = data;

        // Setup share link
        this.setupShareLink(data);

        console.log('Generated story displayed and chortle data stored');
    },

    // Update chortle status when video is completed
    updateChortleStatus: function(chortleData, videoUrl) {
        // History system disabled - this is a placeholder function
        console.log('History disabled: would update chortle status');
        return;
    },

    // Setup reading view
    setupReadingView: function() {
        // Update share link if we have current chortle data
        if (window.ChortleState.currentChortleData) {
            this.setupShareLink(window.ChortleState.currentChortleData);
        }
    },

    // Generate share link
    generateShareLink: function(chortleData) {
        try {
            const encodedData = window.ChortleUtils.encodeChortleData(chortleData);
            if (!encodedData) {
                throw new Error('Failed to encode chortle data');
            }
            
            const baseUrl = window.location.origin + window.location.pathname;
            return `${baseUrl}#chortle=${encodedData}`;
        } catch (error) {
            console.error('Error generating share link:', error);
            return null;
        }
    },

    // Setup share link in UI
    setupShareLink: function(chortleData) {
        const shareLink = this.generateShareLink(chortleData);
        if (!shareLink) {
            console.error('Failed to generate share link');
            return;
        }

        const linkInput = document.getElementById('generated-link');
        if (linkInput) {
            linkInput.value = shareLink;
        }

        window.ChortleState.currentShareLink = shareLink;
        console.log('Share link generated:', shareLink);
    },

    // Start video recording
    startVideoRecording: function() {
        console.log('Starting video recording...');
        
        if (!window.ChortleVideo) {
            this.showError('Video recording not available');
            return;
        }

        if (!window.ChortleState.currentStory) {
            this.showError('No story to record');
            return;
        }

        // Start video recording with the current story
        window.ChortleVideo.startRecording(window.ChortleState.currentStory);
    },

    // Play recorded video
    playRecordedVideo: function() {
        console.log('Playing recorded video...');
        
        if (!window.ChortleVideo) {
            this.showError('Video playback not available');
            return;
        }

        window.ChortleVideo.playRecording();
    },

    // Share chortle using native sharing or fallback
    shareChortle: async function() {
        const shareBtn = document.getElementById('share-chortle');
        const shareLink = window.ChortleState.currentShareLink;
        
        if (!shareLink) {
            this.showError('No link to share');
            return;
        }

        if (shareBtn) {
            shareBtn.classList.add('btn-loading');
            shareBtn.disabled = true;
        }

        try {
            const result = await window.ChortleUtils.smartShare(shareLink);
            
            if (result.success) {
                if (result.method === 'clipboard') {
                    // Show copy success feedback
                    const originalText = shareBtn.textContent;
                    shareBtn.textContent = '✅ Link Copied!';
                    shareBtn.style.background = '#28a745';

                    setTimeout(() => {
                        shareBtn.textContent = originalText;
                        shareBtn.style.background = '';
                    }, window.ChortleConfig.UI.copySuccessTimeout);
                }
                // For native sharing, no additional feedback needed
            } else {
                this.showError('Failed to share. Please copy the link manually.');
            }
        } catch (error) {
            console.error('Share error:', error);
            this.showError('Share failed. Please try again.');
        } finally {
            if (shareBtn) {
                shareBtn.classList.remove('btn-loading');
                shareBtn.disabled = false;
            }
        }
    },

    // Copy share link (fallback method)
    copyShareLink: function() {
        const linkInput = document.getElementById('generated-link');
        const copyBtn = document.getElementById('copy-link');

        if (!linkInput || !linkInput.value) {
            this.showError('No link to copy');
            return;
        }

        window.ChortleUtils.copyToClipboard(linkInput.value).then(success => {
            if (success) {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copied!';
                copyBtn.style.background = '#28a745';

                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = '';
                }, window.ChortleConfig.UI.copySuccessTimeout);
            } else {
                alert('Copy failed. Please manually copy this link:\n\n' + linkInput.value);
            }
        });
    },

    // Setup navigation buttons
    setupNavigation: function() {
        // Create new buttons
        const createNewBtns = document.querySelectorAll('#create-new, #create-another');
        createNewBtns.forEach(btn => {
            btn.addEventListener('click', () => this.createNewChortle());
        });
    },

    // Setup intro page functionality
    setupIntroPage: function() {
        console.log('Setting up intro page...');
        
        const getStartedBtn = document.getElementById('get-started-btn');
        if (getStartedBtn) {
            console.log('✓ Get Started button found, adding event listener');
            getStartedBtn.addEventListener('click', () => {
                console.log('Get Started button clicked');
                this.startChortle();
            });
        } else {
            console.error('❌ Get Started button not found!');
            
            // Mobile debug info
            if (window.ChortleUtils && window.ChortleUtils.isSmallScreen()) {
                const debugInfo = document.createElement('div');
                debugInfo.className = 'mobile-debug-info';
                debugInfo.innerHTML = `
                    <h4>Mobile Debug Info</h4>
                    <p><strong>Error:</strong> Get Started button not found</p>
                    <p><strong>User Agent:</strong> ${navigator.userAgent}</p>
                    <p><strong>Page Ready State:</strong> ${document.readyState}</p>
                    <button onclick="window.location.reload()" style="background: #f44336; color: white; border: none; padding: 10px; border-radius: 4px;">
                        Reload Page
                    </button>
                `;
                document.body.appendChild(debugInfo);
            }
        }
    },

    // Check for incoming links (chortle or video)
    checkForIncomingLinks: function() {
        const hash = window.location.hash;
        console.log('Checking for incoming links, hash:', hash);

        if (hash.startsWith('#chortle=')) {
            try {
                const chortleData = hash.substring(9);
                console.log('Found chortle data:', chortleData);
                const data = window.ChortleUtils.decodeChortleData(chortleData);
                console.log('Decoded chortle:', data);
                this.showCompletedChortle(data);
                return true;
            } catch (e) {
                console.error('Invalid chortle data:', e);
                this.showError('Invalid chortle link. Please check the link and try again.');
                return false;
            }
        } else if (hash.startsWith('#video=')) {
            try {
                const videoData = hash.substring(7);
                console.log('Found video data:', videoData);
                if (window.ChortleVideo) {
                    window.ChortleVideo.showVideoPlayback(videoData);
                }
                return true;
            } catch (e) {
                console.error('Invalid video data:', e);
                this.showError('Invalid video link. Please check the link and try again.');
                return false;
            }
        }

        return false;
    },

    // Show error message
    showError: function(message) {
        // Remove existing error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 12px;
            border: 1px solid #f5c6cb;
            border-radius: 4px;
            margin: 10px 0;
            font-size: 0.9em;
        `;
        errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;

        // Add to current page
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            activePage.insertBefore(errorDiv, activePage.firstChild);
        } else {
            document.body.appendChild(errorDiv);
        }

        // Auto-remove after timeout
        setTimeout(() => {
            errorDiv.remove();
        }, window.ChortleConfig.UI.errorDisplayTimeout || 5000);

        // Log error
        window.ChortleUtils.logError(new Error(message), 'UI');
    },

    // Get current app state for debugging
    getState: function() {
        return {
            globalState: window.ChortleState,
            currentPage: window.ChortleState.currentPage,
            templateStats: window.ChortleTemplates ? window.ChortleTemplates.getStats() : null,
            wizardState: window.ChortleWizard ? window.ChortleWizard.debug() : null
        };
    },

    // Performance monitoring
    startPerformanceTimer: function(name) {
        if (window.ChortleUtils) {
            window.ChortleUtils.startTimer(name);
        }
    },

    endPerformanceTimer: function(name) {
        if (window.ChortleUtils) {
            window.ChortleUtils.endTimer(name);
        }
    },

    // Feature detection and graceful degradation
    checkBrowserSupport: function() {
        const features = {
            mediaRecorder: 'MediaRecorder' in window,
            getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
            wakeLock: 'wakeLock' in navigator,
            vibrate: 'vibrate' in navigator,
            clipboard: !!(navigator.clipboard && navigator.clipboard.writeText),
            webGL: !!window.WebGLRenderingContext,
            localStorage: (() => {
                try {
                    const test = 'test';
                    localStorage.setItem(test, test);
                    localStorage.removeItem(test);
                    return true;
                } catch (e) {
                    return false;
                }
            })(),
            webShare: !!(navigator.share)
        };

        console.log('Browser support check:', features);

        // Warn about missing critical features
        if (!features.mediaRecorder || !features.getUserMedia) {
            console.warn('Video recording not supported in this browser');
        }

        if (!features.localStorage) {
            console.warn('localStorage not supported - history will not be saved');
        }

        if (features.webShare) {
            console.log('✅ Native sharing supported');
        } else {
            console.log('ℹ️ Native sharing not supported - will use clipboard fallback');
        }

        return features;
    },

    // Handle app visibility changes (for cleanup)
    handleVisibilityChange: function() {
        if (document.hidden) {
            // App hidden - cleanup if needed
            console.log('App hidden - performing cleanup');
        } else {
            // App visible
            console.log('App visible');
        }
    },

    // Handle window beforeunload (cleanup)
    handleBeforeUnload: function() {
        if (window.ChortleVideo) {
            window.ChortleVideo.cleanup();
        }
    }
};

// Debug utilities
window.ChortleDebug = {
    help: function() {
        console.log(`
Chortle Debug Commands:
- ChortleDebug.getState() - View current app state
- ChortleDebug.testTemplate() - Generate test chortle link  
- ChortleDebug.testNativeSharing() - Test sharing functionality
- ChortleDebug.logInitialization() - Check initialization status
- ChortleDebug.clearState() - Reset application state
        `);
    },

    getState: function() {
        return window.ChortleApp.getState();
    },

    testTemplate: function() {
        const testData = {
            template: 'funny-adventure',
            noun1: 'banana',
            adjective1: 'purple',
            verb1: 'dancing'
        };
        
        const link = window.ChortleApp.generateShareLink(testData);
        console.log('Test link generated:', link);
        return link;
    },

    testNativeSharing: function() {
        if (navigator.share) {
            navigator.share({
                title: 'Test Share',
                text: 'Testing native sharing',
                url: window.location.href
            }).then(() => {
                console.log('✅ Native sharing works');
            }).catch(err => {
                console.log('❌ Native sharing failed:', err);
            });
        } else {
            console.log('❌ Native sharing not supported');
        }
    },

    logInitialization: function() {
        console.log('Initialization Status:');
        console.log('- ChortleApp:', !!window.ChortleApp);
        console.log('- ChortleConfig:', !!window.ChortleConfig);
        console.log('- ChortleState:', !!window.ChortleState);
        console.log('- ChortleUtils:', !!window.ChortleUtils);
        console.log('- ChortleTemplates:', !!window.ChortleTemplates);
        console.log('- ChortleWizard:', !!window.ChortleWizard);
        console.log('- ChortleVideo:', !!window.ChortleVideo);
    },

    clearState: function() {
        if (window.ChortleState) {
            window.ChortleState.reset();
            console.log('✅ State cleared');
        }
    }
};

console.log('📱 Chortle App v5.4 loaded successfully');
