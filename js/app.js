/* Chortle v5.2 - App Logic with Native Sharing */

window.ChortleApp = {
    // Initialize the main app
    initialize: function() {
        console.log('Initializing Chortle App v' + window.ChortleConfig.APP.version);
        
        // Setup core functionality
        this.setupTemplateSelection();
        this.setupCategoryFilters();
        this.setupSharePage();
        this.setupNavigation();
        this.setupIntroPage();
        
        console.log('App initialization complete');
    },

    // Page navigation system
    showPage: function(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.ChortleState.currentPage = pageId;
        } else {
            console.error('Page not found:', pageId);
        }
    },

    // Setup template selection functionality
    setupTemplateSelection: function() {
        // Initial render
        this.renderTemplates();
        
        // Template button click handlers are added dynamically in renderTemplates
    },

    // Render templates based on current filters
    renderTemplates: function() {
        const container = document.getElementById('template-container');
        const emptyState = document.getElementById('templates-empty');
        
        if (!container || !emptyState) {
            console.error('Template container elements not found');
            return;
        }

        container.innerHTML = '';

        // Get filtered templates
        const templates = window.ChortleTemplates.filterTemplates(
            window.ChortleState.currentCategory, 
            window.ChortleState.searchTerm
        );

        const templateEntries = Object.entries(templates);

        if (templateEntries.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';

            templateEntries.forEach(([key, template]) => {
                const button = document.createElement('button');
                button.className = 'template-btn';
                button.dataset.template = key;
                button.innerHTML = `
                    <div style="display: flex; align-items: flex-start; gap: 15px;">
                        <img src="${template.icon}" alt="${template.title}" class="template-icon-img" style="flex-shrink: 0;">
                        <div style="flex: 1;">
                            <div class="template-btn-title">${template.title}</div>
                            <div class="template-btn-desc">${template.description}</div>
                        </div>
                    </div>
                `;
                
                // Add click handler
                button.addEventListener('click', () => this.selectTemplate(key));
                
                container.appendChild(button);
            });
        }
    },

    // Handle template selection
    selectTemplate: function(templateKey) {
        console.log('Template selected:', templateKey);
        
        // Validate template
        if (!window.ChortleTemplates.validateTemplate(templateKey)) {
            this.showError('Invalid template selected');
            return;
        }


        // NEW: Auto-load background for selected template
        if (window.ChortleBackgrounds && window.ChortleConfig.FEATURES.backgroundsEnabled) {
            window.ChortleBackgrounds.enableBackgroundsForTemplate(templateKey);
        }

        // Setup wizard
        const success = window.ChortleWizard.setup(templateKey);
        if (success) {
            this.showPage('wizard-page');
        } else {
            this.showError('Failed to setup wizard for template');
        }
    },

    // Handle template selection
    selectTemplate: function(templateKey) {
        console.log('Template selected:', templateKey);
        
        // Validate template
        if (!window.ChortleTemplates.validateTemplate(templateKey)) {
            this.showError('Invalid template selected');
            return;
        }
    
        // NEW: Auto-load background for selected template
        if (window.ChortleBackgrounds && window.ChortleConfig.FEATURES.backgroundsEnabled) {
            window.ChortleBackgrounds.enableBackgroundsForTemplate(templateKey);
        }
    
        // Setup wizard
        const success = window.ChortleWizard.setup(templateKey);
        if (success) {
            this.showPage('wizard-page');
        } else {
            this.showError('Failed to setup wizard for template');
        }
    },

    // Setup category filtering
    setupCategoryFilters: function() {
        // Category filtering disabled - always show all templates
        console.log('Category filtering disabled');
    },

    // Setup share page functionality
    setupSharePage: function() {
        // UPDATED: Share button with native sharing
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.generateAndShareLink());
        }

        // UPDATED: Copy link button (fallback)
        const copyBtn = document.getElementById('copy-link');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyShareLink());
        }

        // Create new chortle button
        const createNewBtn = document.getElementById('create-new-chortle');
        if (createNewBtn) {
            createNewBtn.addEventListener('click', () => this.createNewChortle());
        }
    },

    // UPDATED: Generate and immediately share link with native sharing
    generateAndShareLink: async function() {
        const shareBtn = document.getElementById('share-btn');
        const originalText = shareBtn.textContent;
        shareBtn.classList.add('btn-loading');
        shareBtn.disabled = true;
    
        try {
            // Debug current state
            console.log('Share button clicked');
            console.log('Current wizard state:', window.ChortleState);
            console.log('Current template:', window.ChortleState.currentTemplate);
            console.log('Current wizard data:', window.ChortleState.wizardData);
            
            const wizardData = window.ChortleWizard.getWizardData();
            console.log('Retrieved wizard data:', wizardData);
            
            if (!wizardData) {
                throw new Error('getWizardData returned null - wizard may not be completed');
            }
            
            if (!wizardData.template) {
                throw new Error('No template in wizard data - wizard setup may have failed');
            }
            
            // Debug template validation
            const template = window.ChortleTemplates.getTemplate(wizardData.template);
            if (!template) {
                throw new Error(`Template '${wizardData.template}' not found`);
            }
            console.log('✅ Template validated:', template.title);
            
            // Debug field validation  
            const missingFields = template.fields.filter(field => 
                !wizardData[field.name] || wizardData[field.name].trim() === ''
            );
            
            if (missingFields.length > 0) {
                console.log('❌ Missing fields:', missingFields.map(f => f.name));
                throw new Error(`Missing required fields: ${missingFields.map(f => f.name).join(', ')}`);
            }
            console.log('✅ All fields validated');

            const encodedData = window.ChortleUtils.encodeChortleData(wizardData);
            console.log('Encoded result:', encodedData);
            
            if (!encodedData) {
                throw new Error('Failed to encode chortle data - check console for encoding errors');
            }

            const shareableUrl = window.ChortleUtils.getBaseUrl() + '#chortle=' + encodedData;
            console.log('Generated URL:', shareableUrl);

            // Try native sharing first
           const shareResult = await window.ChortleUtils.shareUrl(
                shareableUrl, 
                'Check out my hilarious Chortle!'
            );


            if (shareResult.success) {
                if (shareResult.method === 'native') {
                    // Native sharing succeeded
                    shareBtn.textContent = '✅ Shared!';
                    shareBtn.style.background = '#28a745';
                    
                    setTimeout(() => {
                        shareBtn.textContent = originalText;
                        shareBtn.style.background = '';
                    }, 3000);
                } else if (shareResult.method === 'clipboard') {
                    // Fallback to clipboard succeeded
                    shareBtn.textContent = '📋 Copied to Clipboard!';
                    shareBtn.style.background = '#17a2b8';
                    
                    // Also show the link section for manual sharing
                    document.getElementById('generated-link').value = shareableUrl;
                    document.getElementById('link-section').classList.add('active');
                    window.ChortleUtils.scrollToElement('link-section');
                    
                    setTimeout(() => {
                        shareBtn.textContent = originalText;
                        shareBtn.style.background = '';
                    }, 3000);
                }
            } else {
                // Both native and clipboard failed - show link manually
                throw new Error('Sharing and clipboard access failed');
            }

        } catch (error) {
            console.error('Share error:', error);
            
            // Fallback: show link section for manual copying
            try {
                const wizardData = window.ChortleWizard.getWizardData();
                const encodedData = window.ChortleUtils.encodeChortleData(wizardData);
                const shareableUrl = window.ChortleUtils.getBaseUrl() + '#chortle=' + encodedData;
                
                document.getElementById('generated-link').value = shareableUrl;
                document.getElementById('link-section').classList.add('active');
                window.ChortleUtils.scrollToElement('link-section');
                
                shareBtn.textContent = '📱 Link Ready Below';
                shareBtn.style.background = '#ffc107';
                shareBtn.style.color = '#000';
                
                setTimeout(() => {
                    shareBtn.textContent = originalText;
                    shareBtn.style.background = '';
                    shareBtn.style.color = '';
                }, 3000);
                
            } catch (fallbackError) {
                this.showError('Failed to generate sharing link. Please try again.');
            }
        } finally {
            shareBtn.classList.remove('btn-loading');
            shareBtn.disabled = false;
        }
    },

    // UPDATED: Copy share link (now used as fallback)
    copyShareLink: function() {
        const linkInput = document.getElementById('generated-link');
        const copyBtn = document.getElementById('copy-link');

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
            // Try again after a short delay
            setTimeout(() => {
                console.log('Retrying to find Get Started button...');
                const retryBtn = document.getElementById('get-started-btn');
                if (retryBtn) {
                    console.log('✓ Get Started button found on retry');
                    retryBtn.addEventListener('click', () => {
                        console.log('Get Started button clicked (retry)');
                        this.startChortle();
                    });
                } else {
                    console.error('❌ Get Started button still not found on retry');
                }
            }, 500);
        }
    },

    // Start chortle creation from intro
    startChortle: function() {
        console.log('Starting chortle creation...');
        this.showPage('template-selection-page');
    },
 
    // Create new chortle (reset app)
    createNewChortle: function() {
        // Clear URL hash
        window.location.hash = '';
        
        // Reset app state
        this.resetApp();
        
        // Show template selection
        this.showPage('template-selection-page');
    },

    // Reset app to initial state
    resetApp: function() {
        // Reset global state
        Object.assign(window.ChortleState, {
            currentTemplate: null,
            currentCategory: 'all',
            searchTerm: '',
            currentStep: 0,
            wizardData: {},
            currentPage: 'template-selection-page',
            currentChortleId: null
        });

        // Category filtering disabled - no reset needed

        // Reset wizard
        window.ChortleWizard.reset();

        // Reset share page
        document.getElementById('link-section')?.classList.remove('active');
        const linkInput = document.getElementById('generated-link');
        if (linkInput) {
            linkInput.value = '';
        }

        // Clean up video resources
        if (window.ChortleVideo) {
            window.ChortleVideo.cleanup();
        }

        // Re-render templates
        this.renderTemplates();

        console.log('App reset complete');
    },

// Show completed chortle (when someone clicks a link) - FIXED to store data
showCompletedChortle: function(data) {
    console.log('Showing completed chortle with data:', data);

    // Validate data
    if (!window.ChortleUtils.validateChortleData(data)) {
        this.showError('Invalid Chortle data. This link may be corrupted.');
        return;
    }

    const template = data.template;
    const templateData = { ...data };
    delete templateData.template;

    console.log('Looking for template:', template);

    const templateObj = window.ChortleTemplates.getTemplate(template);
    if (!templateObj) {
        console.error('Template not found:', template);
        this.showError('Unknown template. This Chortle may be from a newer version.');
        return;
    }

    console.log('Template found, showing reading view');
    this.showPage('reading-view');

    // In showCompletedChortle() function, add this after template validation:
    if (templateObj) {
        // ADD THIS LINE:
        if (window.ChortleBackgrounds && window.ChortleConfig.FEATURES.backgroundsEnabled) {
            window.ChortleBackgrounds.enableBackgroundsForTemplate(template);
        }
        
    // Render the completed story
    const story = window.ChortleTemplates.renderTemplate(template, templateData);
    document.getElementById('completed-story').innerHTML = story;

    // FIXED: Store the complete chortle data (including template) for video recording
    window.ChortleState.currentChortleData = data; // Store the FULL data including template

    console.log('Generated story displayed and chortle data stored');
},

    // Update chortle status when video is completed (placeholder - history disabled)
    updateChortleStatus: function(chortleData, videoUrl) {
        // History system disabled - this is a placeholder function
        console.log('History disabled: would update chortle status');
        return;
    },

    // Show error message
    showError: function(message) {
        // Remove existing error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;

        // Add to current page
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            activePage.appendChild(errorDiv);
        } else {
            document.body.appendChild(errorDiv);
        }

        // Auto-remove after timeout
        setTimeout(() => {
            errorDiv.remove();
        }, window.ChortleConfig.UI.errorDisplayTimeout);

        // Log error
        window.ChortleUtils.logError(new Error(message), 'UI');
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
                this.showError('Invalid Chortle link. Please check the link and try again.');
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

    // Get current app state for debugging
    getState: function() {
        return {
            globalState: window.ChortleState,
            currentPage: window.ChortleState.currentPage,
            templateStats: window.ChortleTemplates.getStats(),
            wizardState: window.ChortleWizard ? window.ChortleWizard.debug() : null,
            // historyStats removed - history system disabled
        };
    },

    // Performance monitoring
    startPerformanceTimer: function(name) {
        window.ChortleUtils.startTimer(name);
    },

    endPerformanceTimer: function(name) {
        window.ChortleUtils.endTimer(name);
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
            // NEW: Check for native sharing support
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

// Export for debugging
if (window.ChortleDebug) {
    window.ChortleDebug.app = window.ChortleApp;
}
