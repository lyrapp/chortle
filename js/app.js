/* Chortle v5.7 - App Logic with Native Sharing + Background Integration */

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

    // Handle template selection - FIXED with background integration
    selectTemplate: function(templateKey) {
        console.log('Template selected:', templateKey);
        
        // Validate template
        if (!window.ChortleTemplates.validateTemplate(templateKey)) {
            this.showError('Invalid template selected');
            return;
        }

        // FIXED: Enable backgrounds for selected template
        if (window.ChortleBackgrounds && window.ChortleConfig?.FEATURES?.backgroundsEnabled) {
            console.log('🎨 Enabling backgrounds for template:', templateKey);
            const backgroundEnabled = window.ChortleBackgrounds.enableBackgroundsForTemplate(templateKey);
            
            if (backgroundEnabled) {
                console.log('✅ Background system activated for', templateKey);
            } else {
                console.log('ℹ️ No background available for', templateKey);
            }
        } else {
            console.log('ℹ️ Background system not available or disabled');
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
        // Setup create link button (in wizard)
        const createLinkBtn = document.getElementById('create-link-btn');
        if (createLinkBtn) {
            createLinkBtn.addEventListener('click', () => {
                this.createSharableLink();
            });
        }

        // Setup copy button
        const copyBtn = document.getElementById('copy-link-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyToClipboard();
            });
        }

        // Setup native share button
        const shareBtn = document.getElementById('native-share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareNatively();
            });
        }

        // Setup new chortle button
        const newChortleBtn = document.getElementById('new-chortle-btn');
        if (newChortleBtn) {
            newChortleBtn.addEventListener('click', () => {
                this.createNewChortle();
            });
        }

        // Set up share buttons on reading page
        const readingCopyBtn = document.getElementById('reading-copy-btn');
        if (readingCopyBtn) {
            readingCopyBtn.addEventListener('click', () => {
                this.copyToClipboard();
            });
        }

        const readingShareBtn = document.getElementById('reading-share-btn');
        if (readingShareBtn) {
            readingShareBtn.addEventListener('click', () => {
                this.shareNatively();
            });
        }
    },

    // Setup navigation
    setupNavigation: function() {
        // Back to templates from wizard
        const backBtn = document.getElementById('back-to-templates');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showPage('template-selection-page');
            });
        }
    },

    // Setup intro page
    setupIntroPage: function() {
        const getStartedBtn = document.getElementById('get-started-btn');
        if (getStartedBtn) {
            console.log('✓ Get Started button found');
            getStartedBtn.addEventListener('click', () => {
                console.log('Get Started button clicked');
                this.startChortle();
            });
        } else {
            console.warn('⚠️ Get Started button not found - retrying...');
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
 
    // Create new chortle (reset app) - FIXED with background cleanup
    createNewChortle: function() {
        // Clear URL hash
        window.location.hash = '';
        
        // Reset app state
        this.resetApp();
        
        // Show template selection
        this.showPage('template-selection-page');
    },

    // Reset app to initial state - FIXED with background cleanup
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

        // Reset wizard
        window.ChortleWizard.reset();

        // Reset share page
        document.getElementById('link-section')?.classList.remove('active');
        const linkInput = document.getElementById('generated-link');
        if (linkInput) {
            linkInput.value = '';
        }

        // FIXED: Clean up background resources
        if (window.ChortleBackgrounds) {
            window.ChortleBackgrounds.cleanup();
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

        // FIXED: Enable backgrounds for the completed template
        if (window.ChortleBackgrounds && window.ChortleConfig?.FEATURES?.backgroundsEnabled) {
            console.log('🎨 Enabling backgrounds for completed template:', template);
            window.ChortleBackgrounds.enableBackgroundsForTemplate(template);
        }

        // Update global state for completed chortle
        window.ChortleState.currentTemplate = template;
        window.ChortleState.wizardData = templateData;

        // Update chortle history with data
        if (window.ChortleHistory) {
            window.ChortleHistory.updateChortleData(data.id, templateData);
        }

        // Populate reading page with data
        const readingContent = document.getElementById('reading-content');
        if (readingContent) {
            const populatedText = window.ChortleUtils.populateTemplate(templateObj.template, templateData);
            readingContent.textContent = populatedText;
        }

        // Show reading page
        this.showPage('reading-page');

        console.log('Completed chortle displayed successfully');
    },

    // Create sharable link
    createSharableLink: function() {
        const wizardData = window.ChortleWizard.getAllData();
        const template = window.ChortleState.currentTemplate;
        
        if (!template || !wizardData || Object.keys(wizardData).length === 0) {
            this.showError('Please complete all fields first');
            return;
        }

        // Generate unique ID
        const chortleId = window.ChortleUtils.generateId();
        
        // Create data object
        const chortleData = {
            id: chortleId,
            template: template,
            timestamp: Date.now(),
            ...wizardData
        };

        // Save to history
        if (window.ChortleHistory) {
            window.ChortleHistory.saveChortle(chortleData);
        }

        // Store current chortle ID for potential video linking
        window.ChortleState.currentChortleId = chortleId;

        // Create URL
        const url = window.ChortleUtils.createShareUrl(chortleData);
        
        // Update UI
        const linkInput = document.getElementById('generated-link');
        const linkSection = document.getElementById('link-section');
        
        if (linkInput && linkSection) {
            linkInput.value = url;
            linkSection.classList.add('active');
        }

        console.log('Sharable link created:', url);
    },

    // Copy link to clipboard
    copyToClipboard: async function() {
        const linkInput = document.getElementById('generated-link');
        
        if (!linkInput || !linkInput.value) {
            this.showError('No link to copy');
            return;
        }

        try {
            await navigator.clipboard.writeText(linkInput.value);
            
            // Update button text temporarily
            const copyBtn = document.getElementById('copy-link-btn') || document.getElementById('reading-copy-btn');
            if (copyBtn) {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✓ Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            }
            
            console.log('Link copied to clipboard');
            
        } catch (err) {
            console.error('Failed to copy:', err);
            
            // Fallback: select the text
            linkInput.select();
            linkInput.setSelectionRange(0, 99999);
            
            this.showMessage('Link selected - press Ctrl+C to copy');
        }
    },

    // Native sharing (if supported)
    shareNatively: async function() {
        const linkInput = document.getElementById('generated-link');
        
        if (!linkInput || !linkInput.value) {
            this.showError('No link to share');
            return;
        }

        // Check if native sharing is supported
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out my Chortle!',
                    text: 'I created a funny Chortle for you to read and react to!',
                    url: linkInput.value
                });
                console.log('Successfully shared');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                    this.copyToClipboard(); // Fallback to copy
                }
            }
        } else {
            // Fallback to copy
            this.copyToClipboard();
        }
    },

    // Update chortle status (called from video.js when recording completes)
    updateChortleStatus: function(chortleId, videoUrl) {
        if (window.ChortleHistory) {
            window.ChortleHistory.updateChortleStatus(chortleId, 'completed', {
                videoUrl: videoUrl,
                completedAt: Date.now()
            });
        }
        
        console.log('Chortle status updated:', chortleId, videoUrl);
    },

    // Error handling
    showError: function(message) {
        console.error('App Error:', message);
        alert('Error: ' + message); // Simple error display for now
    },

    // Show message to user
    showMessage: function(message) {
        console.log('App Message:', message);
        // Could be enhanced with a proper notification system
    }
};
