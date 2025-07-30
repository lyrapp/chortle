/* Chortle v5.2 - App Logic with Native Sharing */

window.ChortleApp = {
    // Initialize the main app
    initialize: function() {
        console.log('Initializing Chortle App v' + window.ChortleConfig.APP.version);
        
        // Setup core functionality
        this.setupTemplateSelection();
        this.setupSearch();
        this.setupCategoryFilters();
        this.setupSharePage();
        this.setupNavigation();
        
        // Initialize history system
        if (window.ChortleHistory) {
            window.ChortleHistory.initialize();
        }
        
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
            
            // Auto-scroll on mobile
            if (window.ChortleUtils.isSmallScreen()) {
                setTimeout(() => {
                    targetPage.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 100);
            }
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
                    <div class="template-btn-title">${template.title}</div>
                    <div class="template-btn-desc">${template.description}</div>
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

        // Setup wizard
        const success = window.ChortleWizard.setup(templateKey);
        if (success) {
            this.showPage('wizard-page');
        } else {
            this.showError('Failed to setup wizard for template');
        }
    },

    // Setup search functionality
    setupSearch: function() {
        const searchInput = document.getElementById('template-search');
        if (!searchInput) return;

        // Debounced search to avoid excessive filtering
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                window.ChortleState.searchTerm = e.target.value.toLowerCase();
                this.renderTemplates();
            }, 300); // 300ms debounce
        });

        // Clear search on escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                window.ChortleState.searchTerm = '';
                this.renderTemplates();
            }
        });
    },

    // Setup category filtering
    setupCategoryFilters: function() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                document.querySelectorAll('.category-btn').forEach(b => {
                    b.classList.remove('active');
                });
                
                // Add active class to clicked button
                btn.classList.add('active');

                // Update state and re-render
                window.ChortleState.currentCategory = btn.dataset.category;
                this.renderTemplates();
            });
        });
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
            const wizardData = window.ChortleWizard.getWizardData();
            
            if (!wizardData || !wizardData.template) {
                throw new Error('No wizard data available');
            }

            console.log('Generating link with data:', wizardData);

            const encodedData = window.ChortleUtils.encodeChortleData(wizardData);
            if (!encodedData) {
                throw new Error('Failed to encode chortle data');
            }

            const shareableUrl = window.ChortleUtils.getBaseUrl() + '#chortle=' + encodedData;
            console.log('Generated URL:', shareableUrl);

            // Save to history
            if (window.ChortleHistory) {
                const chortleId = window.ChortleHistory.saveChortle(wizardData, shareableUrl);
                if (chortleId) {
                    console.log('Chortle saved to history with ID:', chortleId);
                    window.ChortleState.currentChortleId = chortleId;
                }
            }

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

        // Reset search
        const searchInput = document.getElementById('template-search');
        if (searchInput) {
            searchInput.value = '';
        }

        // Reset category filter
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-category="all"]')?.classList.add('active');

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

    // Show completed chortle (when someone clicks a link)
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

        // Render the completed story
        const story = window.ChortleTemplates.renderTemplate(template, templateData);
        document.getElementById('completed-story').innerHTML = story;

        // Store the chortle data for potential history updates
        window.ChortleState.currentChortleData = data;

        console.log('Generated story displayed');
    },

    // Update chortle status when video is completed
    updateChortleStatus: function(chortleData, videoUrl) {
        if (!chortleData || !window.ChortleHistory) return;

        // Try to find the chortle in history by matching the data
        const history = window.ChortleHistory.getHistory();
        const matchingChortle = history.find(entry => {
            // Match by template and key fields
            if (entry.template !== chortleData.template) return false;
            
            // Check if all fields match
            const entryFields = entry.fields || {};
            const chortleFields = { ...chortleData };
            delete chortleFields.template;
            
            return Object.keys(chortleFields).every(key => {
                return entryFields[key] === chortleFields[key];
            });
        });

        if (matchingChortle) {
            window.ChortleHistory.markCompleted(matchingChortle.id, videoUrl);
            console.log('Updated chortle status to completed:', matchingChortle.id);
        } else {
            console.log('Could not find matching chortle in history for status update');
        }
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
            historyStats: window.ChortleHistory ? window.ChortleHistory.getStats() : null
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
