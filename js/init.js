/* Chortle v5.3 - App Initialization with Props Support */

// MOBILE DEBUG: Add mobile-specific logging
const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const logMobile = (message, data = null) => {
    if (isMobileDevice) {
        console.log(`📱 MOBILE: ${message}`, data || '');
    } else {
        console.log(`🖥️ DESKTOP: ${message}`, data || '');
    }
};

// Main initialization function with mobile error handling
function initializeChortle() {
    logMobile('🎭 Starting Chortle v' + window.ChortleConfig.APP.version);
    
    // Start performance timer
    window.ChortleUtils.startTimer('app-init');
    
    try {
        // MOBILE FIX: Check if all required modules are loaded
        if (!checkModulesLoaded()) {
            logMobile('❌ Modules not fully loaded, retrying in 500ms');
            setTimeout(initializeChortle, 500);
            return;
        }
        
        // Check browser support
        const browserSupport = window.ChortleApp.checkBrowserSupport();
        
        // MOBILE FIX: Only show warnings that don't block the UI on mobile
        if (!browserSupport.mediaRecorder || !browserSupport.getUserMedia) {
            if (!isMobileDevice) {
                showBrowserWarning();
            } else {
                logMobile('⚠️ Video features may not work on this mobile browser');
            }
        }

        // MOBILE FIX: Don't show localStorage warning on mobile to avoid UI clutter
        if (!browserSupport.localStorage && !isMobileDevice) {
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
        
        logMobile('✅ Chortle initialization complete');
        
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

// MOBILE FIX: Check if all required modules are loaded
function checkModulesLoaded() {
    const requiredModules = [
        'ChortleConfig',
        'ChortleState', 
        'ChortleUtils',
        'ChortleTemplates',
        'ChortleWizard',
        'ChortleVideo',
        'ChortleApp',
        'ChortleProps'  // Added props module
    ];
    
    const missingModules = requiredModules.filter(module => !window[module]);
    
    if (missingModules.length > 0) {
        logMobile('Missing modules:', missingModules);
        return false;
    }
    
    return true;
}

// Initialize all modules with better error handling
function initializeModules() {
    logMobile('Initializing modules...');
    
    try {
        // Initialize in dependency order
        // Config and Utils are already loaded (no init needed)
        
        // Templates (no init needed - just data)
        if (window.ChortleTemplates && window.ChortleTemplates.templates) {
            logMobile('✓ Templates loaded:', Object.keys(window.ChortleTemplates.templates).length + ' templates');
        } else {
            throw new Error('ChortleTemplates not loaded properly');
        }
        
        // Props system (v5.3)
        if (window.ChortleProps) {
            logMobile('✓ Props module loaded');
            // Props initialize themselves via DOMContentLoaded if enabled
        } else {
            logMobile('⚠️ Props module not loaded (optional)');
        }
        
        // App (main logic)
        if (window.ChortleApp && typeof window.ChortleApp.initialize === 'function') {
            window.ChortleApp.initialize();
            logMobile('✓ App module initialized');
        } else {
            throw new Error('ChortleApp not loaded properly');
        }
        
        // Video system
        if (window.ChortleVideo && typeof window.ChortleVideo.initialize === 'function') {
            window.ChortleVideo.initialize();
            logMobile('✓ Video module initialized');
        } else {
            throw new Error('ChortleVideo not loaded properly');
        }
        
        // Wizard (no separate init - setup on demand)
        if (window.ChortleWizard) {
            logMobile('✓ Wizard module ready');
        } else {
            throw new Error('ChortleWizard not loaded properly');
        }
        
    } catch (error) {
        logMobile('❌ Module initialization failed:', error.message);
        throw error;
    }
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
        logMobile('Hash changed to:', window.location.hash);
        
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
        logMobile('Global error caught:', event.error?.message);
        window.ChortleUtils.logError(event.error, 'global');
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        logMobile('Unhandled promise rejection:', event.reason);
        window.ChortleUtils.logError(event.reason, 'promise');
    });
    
    logMobile('✓ Global event listeners setup');
}

// MOBILE FIX: Enhanced creation interface setup with better button handling
function setupCreationInterface() {
    logMobile('Setting up creation interface...');
    
    // Show intro page first
    window.ChortleApp.showPage('intro-page');
    
    // Initial template render (for when user navigates to template page) 
    window.ChortleApp.renderTemplates();
    
    // MOBILE FIX: Enhanced button setup with multiple retry attempts
    setupGetStartedButton();
    
    logMobile('✓ Creation interface ready');
}

// MOBILE FIX: Robust get-started button setup with multiple retries
function setupGetStartedButton(attempt = 1) {
    const maxAttempts = 5;
    const retryDelay = attempt * 200; // Increasing delay: 200ms, 400ms, 600ms, etc.
    
    logMobile(`Attempting to setup get-started button (attempt ${attempt}/${maxAttempts})`);
    
    const getStartedBtn = document.getElementById('get-started-btn');
    
    if (getStartedBtn) {
        logMobile('✓ Get Started button found, adding event listener');
        
        // Remove any existing listeners to prevent duplicates
        getStartedBtn.replaceWith(getStartedBtn.cloneNode(true));
        const newBtn = document.getElementById('get-started-btn');
        
        newBtn.addEventListener('click', (e) => {
            logMobile('Get Started button clicked');
            e.preventDefault();
            
            try {
                if (window.ChortleApp && typeof window.ChortleApp.showPage === 'function') {
                    window.ChortleApp.showPage('template-selection-page');
                    logMobile('✓ Navigated to template selection');
                } else {
                    throw new Error('ChortleApp.showPage not available');
                }
            } catch (error) {
                logMobile('❌ Error navigating from get started button:', error.message);
                showInitializationError(error);
            }
        });
        
        // MOBILE FIX: Also handle touch events for better mobile responsiveness
        if (isMobileDevice) {
            newBtn.addEventListener('touchstart', (e) => {
                logMobile('Get Started button touched');
                // Add visual feedback
                newBtn.style.transform = 'scale(0.98)';
            });
            
            newBtn.addEventListener('touchend', (e) => {
                // Remove visual feedback
                newBtn.style.transform = 'scale(1)';
            });
        }
        
        logMobile('✓ Get Started button setup complete');
        
    } else {
        if (attempt < maxAttempts) {
            logMobile(`❌ Get Started button not found, retrying in ${retryDelay}ms...`);
            setTimeout(() => setupGetStartedButton(attempt + 1), retryDelay);
        } else {
            logMobile('❌ Get Started button setup failed after all attempts');
            console.error('CRITICAL: Get Started button not found after', maxAttempts, 'attempts');
            
            // MOBILE FIX: Show detailed error for debugging
            if (isMobileDevice) {
                const introPage = document.getElementById('intro-page');
                if (introPage) {
                    introPage.innerHTML += `
                        <div style="background: #ffebee; border: 1px solid #f44336; padding: 20px; margin: 20px; border-radius: 8px; color: #c62828;">
                            <h4>Mobile Debug Info</h4>
                            <p><strong>Error:</strong> Get Started button not found</p>
                            <p><strong>User Agent:</strong> ${navigator.userAgent}</p>
                            <p><strong>Page Ready State:</strong> ${document.readyState}</p>
                            <p><strong>Modules Loaded:</strong> ${checkModulesLoaded()}</p>
                            <button onclick="window.location.reload()" style="background: #f44336; color: white; border: none; padding: 10px; border-radius: 4px;">
                                Reload Page
                            </button>
                        </div>
                    `;
                }
            }
        }
    }
}

// Setup error handling
function setupErrorHandling() {
    // Set up uncaught error boundary with mobile-specific handling
    window.onerror = function(message, source, lineno, colno, error) {
        logMobile('Uncaught error:', {
            message,
            source,
            lineno,
            colno,
            error: error?.message
        });
        
        // Show user-friendly error with mobile consideration
        if (isMobileDevice) {
            // More concise error message for mobile
            window.ChortleApp?.showError('App error occurred. Please refresh.');
        } else {
            window.ChortleApp?.showError('An unexpected error occurred. Please refresh the page.');
        }
        
        return true; // Prevent default browser error handling
    };
    
    logMobile('✓ Error handling setup');
}

// Handle window resize
function handleWindowResize() {
    // Update mobile detection
    const isMobileNow = window.ChortleUtils?.isSmallScreen();
    
    // Re-render templates if needed (for responsive grid)
    if (window.ChortleState?.currentPage === 'template-selection-page') {
        // Force template re-render for responsive layout
        window.ChortleApp?.renderTemplates();
    }
    
    // Adjust video elements if active
    if (window.ChortleState?.stream) {
        // Video is active - might need adjustments
        logMobile('Video active during resize');
    }
}

// MOBILE FIX: Don't show browser warnings on mobile (they're disruptive)
function showBrowserWarning() {
    if (isMobileDevice) {
        logMobile('Skipping browser warning on mobile');
        return;
    }
    
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

// Show localStorage warning (desktop only)
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

// MOBILE FIX: Enhanced initialization error with mobile debugging
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
        max-width: 90%;
        width: 400px;
        text-align: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: ${isMobileDevice ? '14px' : '16px'};
    `;
    
    const debugInfo = isMobileDevice ? `
        <details style="margin-top: 10px; text-align: left;">
            <summary style="cursor: pointer;">Debug Info</summary>
            <div style="font-size: 12px; margin-top: 10px;">
                <strong>User Agent:</strong> ${navigator.userAgent}<br>
                <strong>Error:</strong> ${error.message}<br>
                <strong>Modules:</strong> ${checkModulesLoaded() ? 'OK' : 'MISSING'}<br>
                <strong>Page State:</strong> ${document.readyState}
            </div>
        </details>
    ` : '';
    
    errorDiv.innerHTML = `
        <h3 style="color: #721c24; margin-bottom: 10px;">Initialization Error</h3>
        <p style="color: #721c24; margin-bottom: 15px;">
            Chortle failed to start properly. Please refresh the page to try again.
        </p>
        ${debugInfo}
        <button onclick="window.location.reload()" 
                style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
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
                console.log('Version:', window.ChortleConfig?.APP?.version || 'UNKNOWN');
                console.log('Device:', isMobileDevice ? 'Mobile' : 'Desktop');
                console.log('Templates loaded:', Object.keys(window.ChortleTemplates?.templates || {}).length);
                console.log('Props enabled:', window.ChortleConfig?.FEATURES?.propsEnabled || false);
                console.log('Props initialized:', window.ChortleProps?.isInitialized || false);
                console.log('Current state:', window.ChortleState);
                console.log('Browser support:', window.ChortleApp?.checkBrowserSupport?.());
                console.log('Performance timings:', window.performance?.getEntriesByType?.('measure') || []);
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
                
                const encodedData = window.ChortleUtils?.encodeChortleData?.(testData);
                const testUrl = (window.ChortleUtils?.getBaseUrl?.() || '') + '#chortle=' + encodedData;
                
                console.log('Test URL:', testUrl);
                window.location.hash = '#chortle=' + encodedData;
                
                return testUrl;
            },
            
            // Reset everything
            reset: function() {
                window.ChortleApp?.resetApp?.();
                console.log('App reset complete');
            },
            
            // MOBILE FIX: Test button functionality
            testGetStartedButton: function() {
                const btn = document.getElementById('get-started-btn');
                console.log('Get Started Button:', {
                    found: !!btn,
                    visible: btn ? window.getComputedStyle(btn).display !== 'none' : false,
                    hasListener: btn ? getEventListeners(btn).click?.length > 0 : false
                });
                
                if (btn) {
                    btn.click();
                }
            },
            
            // Test native sharing
            testNativeSharing: async function() {
                const testUrl = 'https://example.com/test-chortle';
                const result = await window.ChortleUtils?.shareUrl?.(testUrl, 'Test Chortle Share');
                console.log('Share result:', result);
            },
            
            // Test props system
            testProps: function(templateKey = 'silly-story') {
                if (window.ChortleProps) {
                    return window.ChortleProps.testProps(templateKey);
                } else {
                    console.error('Props system not loaded');
                }
            },
            
            // Show all available debug functions
            help: function() {
                console.group('🛠️ Chortle Debug Commands');
                console.log('ChortleDebug.logInitialization() - Show initialization info');
                console.log('ChortleDebug.testTemplate() - Generate test chortle');
                console.log('ChortleDebug.testGetStartedButton() - Test button functionality');
                console.log('ChortleDebug.testProps() - Test props system');
                console.log('ChortleDebug.reset() - Reset app state');
                console.log('ChortleDebug.getState() - Get current app state');
                console.log('ChortleDebug.testNativeSharing() - Test sharing functionality');
                console.groupEnd();
            },
            
            getState: () => window.ChortleApp?.getState?.() || 'ChortleApp not available'
        });
        
        console.log('🛠️ Development helpers loaded. Use ChortleDebug.help() for commands.');
    }
}

// MOBILE FIX: Enhanced DOM ready detection with multiple fallbacks
function waitForDOMAndInitialize() {
    logMobile('Checking DOM readiness...');
    
    if (document.readyState === 'loading') {
        logMobile('DOM still loading, waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', () => {
            logMobile('DOMContentLoaded fired');
            setTimeout(() => {
                initializeChortle();
                setupDevelopmentHelpers();
            }, 100); // Small delay for mobile
        });
    } else {
        logMobile('DOM already ready, initializing immediately');
        // Small delay to ensure all scripts are fully loaded
        setTimeout(() => {
            initializeChortle();
            setupDevelopmentHelpers();
        }, 50);
    }
}

// MOBILE FIX: Additional fallback initialization
window.addEventListener('load', () => {
    logMobile('Window load event fired');
    // If initialization hasn't happened yet (backup)
    if (!window.ChortleInitialized) {
        logMobile('Initialization not complete, running backup initialization');
        setTimeout(() => {
            initializeChortle();
            setupDevelopmentHelpers();
        }, 200);
    }
});

// Start the initialization process
waitForDOMAndInitialize();

// Prevent multiple initialization but allow retry
window.ChortleInitialized = true;
