/* Chortle v5.2 - App Initialization with History */

// Main initialization function
function initializeChortle() {
    console.log('🎭 Starting Chortle v' + window.ChortleConfig.APP.version);
    
    // Start performance timer
    window.ChortleUtils.startTimer('app-init');
    
    try {
        // Check browser support
        const browserSupport = window.ChortleApp.checkBrowserSupport();
        
        // Show warning for unsupported browsers
        if (!browserSupport.mediaRecorder || !browserSupport.getUserMedia) {
            showBrowserWarning();
        }

        // Show localStorage warning if not supported
        if (!browserSupport.localStorage) {
            showLocalStorageWarning();
        }
        
        // Initialize modules in order
        initializeModules();
        
        // Setup event listeners
        setupGlobalEventListeners();
        
        // Check for incoming links (chortle or video)
        const hasIncomingLink = window.ChortleApp.checkForIncomingLinks();
        
        // If no incoming link, start with intro page
        if (!hasIncomingLink) {
            setupCreationInterface();
        }
        
        // Setup error handling
        setupErrorHandling();
        
        // Performance timing
        window.ChortleUtils.endTimer('app-init');
        
        console.log('✅ Chortle initialization complete');
        
        // Debug information
        if (window.ChortleDebug) {
            console.log('🐛 Debug mode active');
            window.ChortleDebug.logInitialization();
        }
        
    } catch (error) {
        console.error('❌ Chortle initialization failed:', error);
        showInitializationError(error);
    }
}

// Initialize all modules
function initializeModules() {
    console.log('Initializing modules...');
    
    // Initialize in dependency order
    // Config and Utils are already loaded (no init needed)
    
    // Templates (no init needed - just data)
    console.log('✓ Templates loaded:', Object.keys(window.ChortleTemplates.templates).length, 'templates');
    
    // History system (must be before App initialization)
    if (window.ChortleHistory) {
        window.ChortleHistory.initialize();
        console.log('✓ History module initialized');
    } else {
        console.warn('⚠️ History module not loaded - history features disabled');
    }
    
    // App (main logic)
    window.ChortleApp.initialize();
    console.log('✓ App module initialized');
    
    // Video system
    window.ChortleVideo.initialize();
    console.log('✓ Video module initialized');
    
    // Wizard (no separate init - setup on demand)
    console.log('✓ Wizard module ready');
}

// Setup global event listeners
function setupGlobalEventListeners() {
    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
        window.ChortleApp.handleVisibilityChange();
    });
    
    // Before unload cleanup
    window.addEventListener('beforeunload', () => {
        window.ChortleApp.handleBeforeUnload();
    });
    
    // Hash change (for back button support)
    window.addEventListener('hashchange', () => {
        console.log('Hash changed to:', window.location.hash);
        
        // Re-check for incoming links
        const hasIncomingLink = window.ChortleApp.checkForIncomingLinks();
        
        // If no hash, reset to intro page
        if (!window.location.hash && !hasIncomingLink) {
            window.ChortleApp.showPage('intro-page');
        }
    });
    
    // Window resize (for responsive adjustments)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleWindowResize();
        }, 100);
    });
    
    // Global error handling
    window.addEventListener('error', (event) => {
        window.ChortleUtils.logError(event.error, 'global');
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        window.ChortleUtils.logError(event.reason, 'promise');
    });
    
    console.log('✓ Global event listeners setup');
}

// Setup creation interface (for normal app usage)
function setupCreationInterface() {
    console.log('Setting up creation interface...');
    
    // Show intro page first
    window.ChortleApp.showPage('intro-page');
    
    // Initial template render (for when user navigates to template page)
    window.ChortleApp.renderTemplates();
    
    console.log('✓ Creation interface ready');
}

// Setup error handling
function setupErrorHandling() {
    // Set up uncaught error boundary
    window.onerror = function(message, source, lineno, colno, error) {
        console.error('Uncaught error:', {
            message,
            source,
            lineno,
            colno,
            error
        });
        
        // Show user-friendly error
        window.ChortleApp.showError('An unexpected error occurred. Please refresh the page.');
        
        return true; // Prevent default browser error handling
    };
    
    console.log('✓ Error handling setup');
}

// Handle window resize
function handleWindowResize() {
    // Update mobile detection
    const isMobileNow = window.ChortleUtils.isSmallScreen();
    
    // Re-render templates if needed (for responsive grid)
    if (window.ChortleState.currentPage === 'template-selection-page') {
        // Force template re-render for responsive layout
        window.ChortleApp.renderTemplates();
    }
    
    // Adjust video elements if active
    if (window.ChortleState.stream) {
        // Video is active - might need adjustments
        console.log('Video active during resize');
    }
}

// Show browser warning for unsupported features
function showBrowserWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'browser-warning';
    warningDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ffc107;
        color: #000;
        padding: 10px;
        text-align: center;
        z-index: 9999;
        font-size: 0.9em;
    `;
    
    warningDiv.innerHTML = `
        ⚠️ Some features may not work in this browser. 
        For the best experience, use Chrome, Firefox, or Safari.
        <button onclick="this.parentElement.remove()" style="margin-left: 10px; background: none; border: 1px solid #000; padding: 5px 10px; cursor: pointer;">
            Dismiss
        </button>
    `;
    
    document.body.appendChild(warningDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (warningDiv.parentElement) {
            warningDiv.remove();
        }
    }, 10000);
}

// Show localStorage warning
function showLocalStorageWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'localStorage-warning';
    warningDiv.style.cssText = `
        position: fixed;
        top: 40px;
        left: 0;
        right: 0;
        background: #17a2b8;
        color: white;
        padding: 10px;
        text-align: center;
        z-index: 9998;
        font-size: 0.9em;
    `;
    
    warningDiv.innerHTML = `
        💾 History features disabled: Your browser doesn't support local storage.
        <button onclick="this.parentElement.remove()" style="margin-left: 10px; background: none; border: 1px solid white; color: white; padding: 5px 10px; cursor: pointer;">
            Dismiss
        </button>
    `;
    
    document.body.appendChild(warningDiv);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (warningDiv.parentElement) {
            warningDiv.remove();
        }
    }, 8000);
}

// Show initialization error
function showInitializationError(error) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 8px;
        padding: 20px;
        max-width: 400px;
        text-align: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    errorDiv.innerHTML = `
        <h3 style="color: #721c24; margin-bottom: 10px;">Initialization Error</h3>
        <p style="color: #721c24; margin-bottom: 15px;">
            Chortle failed to start properly. Please refresh the page to try again.
        </p>
        <button onclick="window.location.reload()" 
                style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
            Refresh Page
        </button>
    `;
    
    document.body.appendChild(errorDiv);
}

// Development helpers
function setupDevelopmentHelpers() {
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.search.includes('debug=true')) {
        
        // Add debug helpers to ChortleDebug
        if (!window.ChortleDebug) {
            window.ChortleDebug = {};
        }
        
        Object.assign(window.ChortleDebug, {
            // Log initialization info
            logInitialization: function() {
                console.group('🎭 Chortle Debug Info');
                console.log('Version:', window.ChortleConfig.APP.version);
                console.log('Templates loaded:', Object.keys(window.ChortleTemplates.templates).length);
                console.log('Current state:', window.ChortleState);
                console.log('Browser support:', window.ChortleApp.checkBrowserSupport());
                console.log('Performance timings:', window.performance.getEntriesByType('measure'));
                
                // History info
                if (window.ChortleHistory) {
                    console.log('History stats:', window.ChortleHistory.getStats());
                    console.log('Recent history:', window.ChortleHistory.getHistory().slice(0, 3));
                } else {
                    console.log('History module not available');
                }
                
                console.groupEnd();
            },
            
            // Quick template test
            testTemplate: function(templateKey = 'silly-story') {
                const testData = {
                    template: templateKey,
                    name: 'Test User',
                    adjective1: 'amazing',
                    animal: 'unicorn',
                    verb1: 'danced',
                    place: 'Mars',
                    adjective2: 'spectacular',
                    number: 42
                };
                
                const encodedData = window.ChortleUtils.encodeChortleData(testData);
                const testUrl = window.ChortleUtils.getBaseUrl() + '#chortle=' + encodedData;
                
                console.log('Test URL:', testUrl);
                window.location.hash = '#chortle=' + encodedData;
                
                return testUrl;
            },
            
            // Reset everything
            reset: function() {
                window.ChortleApp.resetApp();
                console.log('App reset complete');
            },
            
            // History debugging
            showHistory: function() {
                if (window.ChortleHistory) {
                    const history = window.ChortleHistory.getHistory();
                    console.table(history.map(entry => ({
                        id: entry.id,
                        template: entry.templateTitle,
                        status: entry.status,
                        created: window.ChortleHistory.formatDate(entry.createdAt)
                    })));
                } else {
                    console.log('History module not available');
                }
            },
            
            clearHistory: function() {
                if (window.ChortleHistory) {
                    window.ChortleHistory.clearHistory();
                    console.log('History cleared');
                } else {
                    console.log('History module not available');
                }
            },
            
            // Export history for backup
            exportHistory: function() {
                if (window.ChortleHistory) {
                    window.ChortleHistory.exportHistory();
                } else {
                    console.log('History module not available');
                }
            },
            
            // Test native sharing
            testNativeSharing: async function() {
                const testUrl = 'https://example.com/test-chortle';
                const result = await window.ChortleUtils.shareUrl(testUrl, 'Test Chortle Share');
                console.log('Share result:', result);
            },
            
            // Show all available debug functions
            help: function() {
                console.group('🛠️ Chortle Debug Commands');
                console.log('ChortleDebug.logInitialization() - Show initialization info');
                console.log('ChortleDebug.testTemplate() - Generate test chortle');
                console.log('ChortleDebug.reset() - Reset app state');
                console.log('ChortleDebug.getState() - Get current app state');
                console.log('ChortleDebug.showHistory() - Display history table');
                console.log('ChortleDebug.clearHistory() - Clear all history');
                console.log('ChortleDebug.exportHistory() - Export history as JSON');
                console.log('ChortleDebug.testNativeSharing() - Test sharing functionality');
                console.groupEnd();
            },
            
            getState: () => window.ChortleApp.getState()
        });
        
        console.log('🛠️ Development helpers loaded. Use ChortleDebug.help() for commands.');
    }
}

// Wait for DOM to be ready, then initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeChortle();
        setupDevelopmentHelpers();
    });
} else {
    // DOM is already ready
    initializeChortle();
    setupDevelopmentHelpers();
}

// Prevent multiple initialization
window.ChortleInitialized = true;
