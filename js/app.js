/* Chortle v5.6 - App Logic with Native Sharing (Fixed Syntax Only) */

window.ChortleApp = {
    // Initialize the main app (renamed from init to match init.js expectations)
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

    // Setup category filters
    setupCategoryFilters: function() {
        const categoryContainer = document.getElementById('category-filters');
        if (!categoryContainer) return;

        // Create category buttons
        const categories = ['all', ...window.ChortleTemplates.getCategories()];
        
        categoryContainer.innerHTML = categories.map(category => {
            const displayName = category === 'all' ? 'All' : 
                               category.charAt(0).toUpperCase() + category.slice(1);
            const activeClass = category === window.ChortleState.currentCategory ? 'active' : '';
            
            return `<button class="category-btn ${activeClass}" data-category="${category}">${displayName}</button>`;
        }).join('');

        // Add click handlers
        categoryContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                // Update active state
                categoryContainer.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update state and re-render
                window.ChortleState.currentCategory = e.target.dataset.category;
                this.renderTemplates();
            }
        });
    },

    // Setup search functionality
    setupSearch: function() {
        const searchInput = document.getElementById('template-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            window.ChortleState.searchTerm = e.target.value;
            this.renderTemplates();
        });
    },

    // Setup share page functionality
    setupSharePage: function() {
        // Share button with native sharing
        const shareBtn = document.getElementById('share-chortle');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareChortle());
        }

        // Copy link button (fallback)
        const copyBtn = document.getElementById('copy-link');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyShareLink());
        }
    },

    // Share chortle with native sharing or fallback
    shareChortle: async function() {
        const shareBtn = document.getElementById('share-chortle');
        const linkInput = document.getElementById('generated-link');
        
        if (!linkInput || !linkInput.value) {
            this.showError('No link to share');
            return;
        }

        shareBtn.classList.add('btn-loading');
        shareBtn.disabled = true;

        try {
            const result = await window.ChortleUtils.shareUrl(linkInput.value, 'Check out my Chortle!');
            
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
            shareBtn.classList.remove('btn-loading');
            shareBtn.disabled = false;
        }
    },

    // Copy share link (fallback)
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

        // Back buttons
        const backBtns = document.querySelectorAll('.back-btn');
        backBtns.forEach(btn => {
            btn.addEventListener('click', () => this.goBack());
        });
    },

    // Setup intro page functionality
    setupIntroPage: function() {
        const getStartedBtn = document.getElementById('get-started-btn');
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => {
                this.showPage('template-selection-page');
            });
        }
    },

    // Create new chortle
    createNewChortle: function() {
        window.ChortleState.reset();
        this.showPage('template-selection-page');
    },

    // Go back to previous page
    goBack: function() {
        const currentPage = window.ChortleState.currentPage;
        
        switch (currentPage) {
            case 'wizard-page':
                this.showPage('template-selection-page');
                break;
            case 'share-page':
                this.showPage('wizard-page');
                break;
            case 'reading-view':
                this.showPage('share-page');
                break;
            default:
                this.showPage('template-selection-page');
        }
    },

    // Handle wizard completion
    handleWizardComplete: function(templateKey, formData) {
        console.log('Wizard completed:', templateKey, formData);
        
        // Store the completed data
        window.ChortleState.currentTemplate = templateKey;
        window.ChortleState.currentData = formData;
        
        // Generate share link
        const chortleData = {
            template: templateKey,
            ...formData
        };
        
        const shareLink = this.generateShareLink(chortleData);
        if (shareLink) {
            window.ChortleState.currentShareLink = shareLink;
            
            // Update share link input
            const linkInput = document.getElementById('generated-link');
            if (linkInput) {
                linkInput.value = shareLink;
            }
        }
        
        // Show share page
        this.showPage('share-page');
    },

    // Generate share link
    generateShareLink: function(chortleData) {
        try {
            const encodedData = window.ChortleUtils.encodeChortleData(chortleData);
            if (!encodedData) {
                throw new Error('Failed to encode chortle data');
            }
            
            const baseUrl = window.ChortleUtils.getBaseUrl();
            return `${baseUrl}#chortle=${encodedData}`;
        } catch (error) {
            console.error('Error generating share link:', error);
            return null;
        }
    },

    // Show completed chortle from share link
    showCompletedChortle: function(data) {
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
            this.showError('Unknown template. This Chortle may be from a newer version.');
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

        console.log('Generated story displayed and chortle data stored');
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

// Backward compatibility
window.ChortleApp.init = function() {
    return this.initialize();
};

console.log('📱 Chortle App v5.6 loaded successfully');
