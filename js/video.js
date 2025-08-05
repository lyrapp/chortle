/* Chortle v5.2 - Video Recording & Playback with Scrolling Caption Overlay */

window.ChortleVideo = {
    // Caption system state
    captionChunks: [],
    currentChunkIndex: 0,
    captionInterval: null,

    // Initialize video system
    initialize: function() {
        this.setupEventListeners();
        console.log('Video system initialized with scrolling caption overlay support');
    },

    // Setup all video-related event listeners
    setupEventListeners: function() {
        // Camera setup
        const startCameraBtn = document.getElementById('start-camera');
        if (startCameraBtn) {
            startCameraBtn.addEventListener('click', () => this.startCamera());
        }

        // Recording controls
        const startRecordingBtn = document.getElementById('start-recording');
        if (startRecordingBtn) {
            startRecordingBtn.addEventListener('click', () => this.startRecording());
        }

        const stopRecordingBtn = document.getElementById('stop-recording');
        if (stopRecordingBtn) {
            stopRecordingBtn.addEventListener('click', () => this.stopRecording());
        }

        // Playback controls
        const reRecordBtn = document.getElementById('re-record');
        if (reRecordBtn) {
            reRecordBtn.addEventListener('click', () => this.reRecord());
        }

        const sendVideoBtn = document.getElementById('send-video');
        if (sendVideoBtn) {
            sendVideoBtn.addEventListener('click', () => this.sendVideo());
        }

        // Copy playback link
        const copyPlaybackBtn = document.getElementById('copy-playback-link');
        if (copyPlaybackBtn) {
            copyPlaybackBtn.addEventListener('click', () => this.copyPlaybackLink());
        }
    },

    // Start camera for recording with vertical video support
    startCamera: async function() {
        const button = document.getElementById('start-camera');
        button.classList.add('btn-loading');
        button.disabled = true;

        try {
            // UPDATED: Vertical video constraints optimized for mobile
            const constraints = {
                video: {
                    facingMode: 'user',
                    frameRate: { ideal: 30 }
                    // Let device choose natural dimensions
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100
                }
            };
            window.ChortleState.stream = await navigator.mediaDevices.getUserMedia(constraints);

            const preview = document.getElementById('camera-preview');
            preview.srcObject = window.ChortleState.stream;
            preview.play().catch(e => console.log('Autoplay prevented:', e));
            
            // Show recording area and make it full-screen
            document.getElementById('camera-setup').style.display = 'none';
            document.getElementById('recording-area').style.display = 'block';
            
            // Make recording area full-screen like Snapchat/TikTok
            const recordingArea = document.getElementById('recording-area');
            recordingArea.classList.add('fullscreen-recording');
            
            // Hide other page elements during recording
            document.querySelector('.header').style.display = 'none';
            const completedStory = document.getElementById('completed-story');
            if (completedStory) {
                completedStory.style.display = 'none';
            }
            
            // UPDATED: Setup scrolling caption overlay system
            this.setupScrollingCaptionOverlay();

            // NEW: Setup canvas recording with watermark
            this.setupCanvasRecording();

            console.log('Camera started with vertical recording format');

        } catch (err) {
            this.handleCameraError(err);
        } finally {
            button.classList.remove('btn-loading');
            button.disabled = false;
        }
    },

    setupScrollingCaptionOverlay: function() {
        const chortleData = this.getCurrentChortleData();
        if (!chortleData) {
            console.log('No chortle data found for caption overlay');
            return;
        }

        // Get the rendered Mad Lib text
        const template = chortleData.template;
        const templateData = { ...chortleData };
        delete templateData.template;

        const templateObj = window.ChortleTemplates.getTemplate(template);
        if (!templateObj) {
            console.log('Template not found for caption overlay');
            return;
        }

        const story = window.ChortleTemplates.renderTemplate(template, templateData);
        
        // UPDATED: Create scrollable chunks with filled word highlighting
        this.createScrollingCaptionChunks(story, templateData);
        
        // Create caption overlay element
        this.createCaptionOverlay();
    },

    // NEW: Create scrollable text chunks with Unicode-safe filled word detection
    createScrollingCaptionChunks: function(htmlStory, templateData) {
        // Convert HTML to plain text but keep track of filled words
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlStory;
        
        // Extract filled words for highlighting - IMPROVED with Unicode support
        const filledWords = new Set();
        const filledPhrases = []; // Track multi-word phrases
        
        // Common stop words that shouldn't be highlighted (Unicode-aware)
        const stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
            'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
            'should', 'may', 'might', 'can', 'must', 'shall', 'it', 'its', 'they',
            'them', 'their', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
            'she', 'we', 'me', 'him', 'her', 'us'
        ]);
        
        Object.values(templateData).forEach(value => {
            if (typeof value === 'string' && value.trim()) {
                const cleanValue = value.trim();
                // FIXED: Use Unicode-aware normalization and case conversion
                const normalizedValue = cleanValue.normalize('NFD').toLowerCase();
                filledPhrases.push(normalizedValue);
                
                // FIXED: Split on Unicode-aware word boundaries
                const words = cleanValue.split(/\s+/);
                words.forEach(word => {
                    // FIXED: Unicode-safe word cleaning - keep all letter/number characters
                    const cleanWord = word.replace(/[^\p{L}\p{N}]/gu, '').normalize('NFD').toLowerCase();
                    if (cleanWord.length >= 2 && !stopWords.has(cleanWord)) {
                        filledWords.add(cleanWord);
                    }
                });
            }
        });

        // Get plain text and split into chunks
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        // FIXED: Unicode-aware word splitting
        const words = plainText.split(/\s+/).filter(word => word.length > 0);
        
        // Create larger chunks for more natural reading
        this.captionChunks = [];
        const chunkSize = window.ChortleUtils.isMobile() ? 8 : 12;
        
        for (let i = 0; i < words.length; i += chunkSize) {
            const chunkWords = words.slice(i, i + chunkSize);
            const chunkText = chunkWords.join(' ');
            
            // Check if any words in this chunk are filled words
            const hasFilledWords = chunkWords.some(word => {
                // FIXED: Unicode-safe word cleaning for comparison
                const cleanWord = word.replace(/[^\p{L}\p{N}]/gu, '').normalize('NFD').toLowerCase();
                return filledWords.has(cleanWord);
            });
            
            this.captionChunks.push({
                text: chunkText,
                hasFilledWords: hasFilledWords,
                words: chunkWords.map(word => {
                    // FIXED: Unicode-safe word cleaning for comparison
                    const cleanWord = word.replace(/[^\p{L}\p{N}]/gu, '').normalize('NFD').toLowerCase();
                    return {
                        text: word,
                        isFilled: filledWords.has(cleanWord)
                    };
                }),
                filledPhrases: filledPhrases // Store for phrase matching
            });
        }
        
        this.currentChunkIndex = 0;
        console.log(`Created ${this.captionChunks.length} caption chunks for teleprompter-style scrolling`);
        console.log('Filled words to highlight:', Array.from(filledWords));
    },

    // NEW: Create caption overlay container
    createCaptionOverlay: function() {
        // Remove existing overlay if any
        const existingOverlay = document.getElementById('caption-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Create overlay container
        const overlay = document.createElement('div');
        overlay.id = 'caption-overlay';
        overlay.className = 'caption-overlay';
        
        // Create caption text element
        const captionText = document.createElement('div');
        captionText.id = 'caption-text';
        captionText.className = 'caption-text';
        
        overlay.appendChild(captionText);
        
        // Insert overlay into recording area with mobile-optimized positioning
        const recordingArea = document.getElementById('recording-area');
        
        if (recordingArea) {
            // Ensure recording area is positioned
            recordingArea.style.position = 'relative';
            
            // UPDATED: Better mobile caption positioning for vertical video
            overlay.style.position = 'absolute';
            overlay.style.zIndex = '10';
            overlay.style.pointerEvents = 'none';
            
            // Apply responsive positioning for vertical video
            if (window.ChortleUtils.isMobile()) {
                overlay.style.bottom = '140px'; // Above controls
                overlay.style.left = '10px';
                overlay.style.right = '10px';
                overlay.style.maxHeight = '100px';
            } else {
                overlay.style.bottom = '120px';
                overlay.style.left = '20px';
                overlay.style.right = '20px';
                overlay.style.maxHeight = '120px';
            }
            
            // Apply caption styling optimized for scrolling text
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            overlay.style.color = 'white';
            overlay.style.borderRadius = '12px';
            overlay.style.textAlign = 'center';
            overlay.style.overflow = 'hidden';
            overlay.style.display = 'none';
            overlay.style.backdropFilter = 'blur(5px)';
            overlay.style.transition = 'opacity 0.3s ease';
            
            // Mobile-specific styling for vertical video
            if (window.ChortleUtils.isMobile()) {
                overlay.style.padding = '12px 15px';
                overlay.style.fontSize = '1.1rem';
                overlay.style.lineHeight = '1.3';
                overlay.style.fontWeight = '600';
            } else {
                overlay.style.padding = '15px 20px';
                overlay.style.fontSize = '1.2rem';
                overlay.style.lineHeight = '1.4';
                overlay.style.fontWeight = '600';
            }
            
            recordingArea.appendChild(overlay);
            
            console.log('Scrolling caption overlay created with vertical video optimization');
        }
    },

    // NEW: Setup canvas for recording with watermark
    setupCanvasRecording: function() {
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.id = 'recording-canvas';
        canvas.style.display = 'none'; // Hidden from user
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match video
        const preview = document.getElementById('camera-preview');
        canvas.width = preview.videoWidth || 720;
        canvas.height = preview.videoHeight || 1280;
        
        // Store canvas references
        this.recordingCanvas = canvas;
        this.canvasContext = ctx;
        
        // Load watermark image
        this.loadWatermarkImage();
        
        console.log('Canvas recording setup complete');
    },

    // NEW: Load watermark image
    loadWatermarkImage: function() {
        const img = new Image();
        img.onload = () => {
            this.watermarkImage = img;
            console.log('Watermark image loaded');
        };
        img.onerror = () => {
            console.warn('Watermark image failed to load');
            this.watermarkImage = null;
        };
        img.src = 'chortle-wordmark.png';
    },

    // NEW: Start canvas recording loop
    startCanvasRecording: function() {
        const preview = document.getElementById('camera-preview');
        const canvas = this.recordingCanvas;
        const ctx = this.canvasContext;
        
        if (!preview || !canvas || !ctx) {
            console.error('Canvas recording setup incomplete');
            return null;
        }
        
        // Update canvas size to match video
        canvas.width = preview.videoWidth || 720;
        canvas.height = preview.videoHeight || 1280;
        
        // Start drawing loop
        const drawFrame = () => {
            if (!this.isRecording) return;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw video frame
            ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
            
            // Draw watermark if loaded
            if (this.watermarkImage) {
                this.drawWatermark(ctx, canvas.width, canvas.height);
            }
            
            // Continue drawing
            requestAnimationFrame(drawFrame);
        };
        
        this.isRecording = true;
        drawFrame();
        
        // Get stream from canvas
        const canvasStream = canvas.captureStream(30); // 30 FPS
        
        // Add audio from original stream
        const audioTracks = window.ChortleState.stream.getAudioTracks();
        audioTracks.forEach(track => {
            canvasStream.addTrack(track);
        });
        
        console.log('Canvas recording started with watermark');
        return canvasStream;
    },

    // NEW: Draw watermark on canvas
    drawWatermark: function(ctx, canvasWidth, canvasHeight) {
        if (!this.watermarkImage) return;
        
        // Calculate watermark size (20% of video width - much larger)
        const watermarkWidth = canvasWidth * 0.2;
        const watermarkHeight = (this.watermarkImage.height / this.watermarkImage.width) * watermarkWidth;
        
        // Position watermark (top left with padding)
        const x = 20;
        const y = 20;
        
        // Draw semi-transparent background
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(x - 10, y - 10, watermarkWidth + 20, watermarkHeight + 20);
        
        // Draw watermark image
        ctx.globalAlpha = 0.8;
        ctx.drawImage(this.watermarkImage, x, y, watermarkWidth, watermarkHeight);
        
        // Reset alpha
        ctx.globalAlpha = 1.0;
    },

    // NEW: Stop canvas recording
    stopCanvasRecording: function() {
        this.isRecording = false;
        console.log('Canvas recording stopped');
    },

    // NEW: Cleanup canvas
    cleanupCanvas: function() {
        this.stopCanvasRecording();
        
        if (this.recordingCanvas) {
            this.recordingCanvas.remove();
            this.recordingCanvas = null;
        }
        
        this.canvasContext = null;
        this.watermarkImage = null;
        
        console.log('Canvas cleanup complete');
    },

    // NEW: Show caption overlay with scrolling animation
    showCaptionOverlay: function() {
        const overlay = document.getElementById('caption-overlay');
        if (overlay && this.captionChunks.length > 0) {
            overlay.style.display = 'block';
            overlay.style.opacity = '1';
            
            // Start with first chunk
            this.updateCaptionText();
            
            // Start scrolling through chunks every 3.5 seconds
            this.captionInterval = setInterval(() => {
                this.nextCaptionChunk();
            }, 4500);
            
            console.log('Caption overlay shown - scrolling started');
        }
    },

    // NEW: Show logo watermark during recording
    showLogoWatermark: function() {
        const watermark = document.getElementById('logo-watermark');
        if (watermark) {
            watermark.style.display = 'block';
            console.log('Logo watermark shown');
        }
    },

    // NEW: Hide logo watermark
    hideLogoWatermark: function() {
        const watermark = document.getElementById('logo-watermark');
        if (watermark) {
            watermark.style.display = 'none';
            console.log('Logo watermark hidden');
        }
    },
    
    // NEW: Remove logo watermark
    removeLogoWatermark: function() {
        const watermark = document.getElementById('logo-watermark');
        if (watermark) {
            watermark.remove();
            console.log('Logo watermark removed');
        }
    },

    // NEW: Update caption text with current chunk
    updateCaptionText: function() {
        const captionTextEl = document.getElementById('caption-text');
        if (!captionTextEl || !this.captionChunks.length) return;
        
        // Get previous, current, and next chunks
        const prevIndex = this.currentChunkIndex > 0 ? this.currentChunkIndex - 1 : null;
        const currentIndex = this.currentChunkIndex;
        const nextIndex = this.currentChunkIndex < this.captionChunks.length - 1 ? this.currentChunkIndex + 1 : null;
        
        // Create 3-line karaoke display
        let karaokeHTML = '';
        
        // Previous line (dimmed)
        if (prevIndex !== null) {
            const prevChunk = this.captionChunks[prevIndex];
            karaokeHTML += `<div class="caption-line caption-previous">${this.formatChunkText(prevChunk, false)}</div>`;
        } else {
            karaokeHTML += `<div class="caption-line caption-previous" style="opacity: 0;">&nbsp;</div>`;
        }
        
        // Current line (highlighted)
        const currentChunk = this.captionChunks[currentIndex];
        karaokeHTML += `<div class="caption-line caption-current">${this.formatChunkText(currentChunk, true)}</div>`;
        
        // Next line (preview)
        if (nextIndex !== null) {
            const nextChunk = this.captionChunks[nextIndex];
            karaokeHTML += `<div class="caption-line caption-next">${this.formatChunkText(nextChunk, false)}</div>`;
        } else {
            karaokeHTML += `<div class="caption-line caption-next" style="opacity: 0;">&nbsp;</div>`;
        }
        
        // Apply with smooth transition
        captionTextEl.style.opacity = '0';
        setTimeout(() => {
            captionTextEl.innerHTML = karaokeHTML;
            captionTextEl.style.opacity = '1';
        }, 150);
    },

    // NEW: Format chunk text with Unicode-safe filled word highlighting
    formatChunkText: function(chunk, isCurrentLine) {
        if (!chunk) return '';
        
        if (!isCurrentLine) {
            // For non-current lines, just return plain text
            return chunk.words.map(w => w.text).join(' ');
        }
        
        // For current line, group consecutive highlighted words into phrases
        const words = chunk.words;
        const chunkText = words.map(w => w.text).join(' ');
        
        // FIXED: Unicode-safe phrase matching
        const normalizedChunkText = chunkText.normalize('NFD').toLowerCase();
        
        // First, mark which words should be highlighted
        const highlightMap = words.map((wordObj, index) => {
            // Check if this individual word should be highlighted
            if (wordObj.isFilled) return true;
            
            // Check for phrase matching with Unicode support
            if (chunk.filledPhrases) {
                for (const phrase of chunk.filledPhrases) {
                    if (phrase.includes(' ') && normalizedChunkText.includes(phrase)) {
                        const phraseWords = phrase.split(/\s+/);
                        // FIXED: Unicode-safe word comparison
                        const currentWord = wordObj.text.replace(/[^\p{L}\p{N}]/gu, '').normalize('NFD').toLowerCase();
                        if (phraseWords.includes(currentWord)) {
                            return true;
                        }
                    }
                }
            }
            
            return false;
        });
        
        // Now group consecutive highlighted words
        let formattedText = '';
        let i = 0;
        
        while (i < words.length) {
            if (highlightMap[i]) {
                // Start of highlighted phrase - collect all consecutive highlighted words
                let phraseWords = [];
                while (i < words.length && highlightMap[i]) {
                    phraseWords.push(words[i].text);
                    i++;
                }
                
                // Create single highlighted span for the entire phrase
                const phraseText = phraseWords.join(' ');
                formattedText += `<span style="color: #FE5946; background: rgba(254, 89, 70, 0.3); padding: 2px 6px; border-radius: 4px; font-weight: 700;">${phraseText}</span>`;
                
                // Add space after phrase if not at end
                if (i < words.length) {
                    formattedText += ' ';
                }
            } else {
                // Regular word - not highlighted
                formattedText += words[i].text;
                
                // Add space after word if not at end
                if (i < words.length - 1) {
                    formattedText += ' ';
                }
                i++;
            }
        }
        
        return formattedText;
    },

    // NEW: Move to next caption chunk
    nextCaptionChunk: function() {
        if (this.captionChunks.length === 0) return;
        
        // Move to next chunk
        this.currentChunkIndex++;
        
        // Check if we've reached the end
        if (this.currentChunkIndex >= this.captionChunks.length) {
            // Stop the caption scrolling - we've completed one full cycle
            this.stopCaptionScrolling();
            console.log('Caption overlay completed one full cycle - stopping');
            return;
        }
        
        // Update to show the next chunk
        this.updateCaptionText();
    },

    // NEW: Stop caption scrolling
    stopCaptionScrolling: function() {
        if (this.captionInterval) {
            clearInterval(this.captionInterval);
            this.captionInterval = null;
            console.log('Caption scrolling stopped');
        }
    },

    // UPDATED: Hide caption overlay
    hideCaptionOverlay: function() {
        this.stopCaptionScrolling();
        
        const overlay = document.getElementById('caption-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
            
            console.log('Caption overlay hidden');
        }
    },

    // UPDATED: Remove caption overlay
    removeCaptionOverlay: function() {
        this.stopCaptionScrolling();
        
        const overlay = document.getElementById('caption-overlay');
        if (overlay) {
            overlay.remove();
            console.log('Caption overlay removed');
        }
        
        // Reset caption state
        this.captionChunks = [];
        this.currentChunkIndex = 0;
    },

    // Handle camera access errors
    handleCameraError: function(err) {
        let errorMessage = 'Camera access is required to record your Chortle reading. ';

        switch (err.name) {
            case 'NotAllowedError':
                errorMessage += 'Please allow camera access and try again.';
                break;
            case 'NotFoundError':
                errorMessage += 'No camera found on this device.';
                break;
            case 'NotReadableError':
                errorMessage += 'Camera is being used by another app. Close other apps and try again.';
                break;
            default:
                errorMessage += 'Please check your camera settings and try again.';
        }

        window.ChortleApp.showError(errorMessage);
        console.error('Camera error:', err);
    },

    // UPDATED: Start recording video with scrolling captions
    startRecording: function() {
        window.ChortleState.recordedChunks = [];
        
        // FIXED: Initialize countdown timer properly
        window.ChortleState.recordingSeconds = window.ChortleConfig.APP.maxRecordingTime;

        // Request wake lock to prevent screen sleep
        window.ChortleUtils.requestWakeLock();

        // Create MediaRecorder with canvas stream (includes watermark)
        const canvasStream = this.startCanvasRecording();
        if (!canvasStream) {
            window.ChortleApp.showError('Failed to setup video recording with watermark');
            return;
        }
        
        const mimeType = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4';
        window.ChortleState.mediaRecorder = new MediaRecorder(canvasStream, { 
            mimeType,
            videoBitsPerSecond: 2500000 // 2.5 Mbps for good quality
        });

        // Handle data availability
        window.ChortleState.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                window.ChortleState.recordedChunks.push(event.data);
            }
        };

        // Handle recording stop
        window.ChortleState.mediaRecorder.onstop = () => {
            this.handleRecordingStop();
        };

        // Start recording
        window.ChortleState.mediaRecorder.start();

        // Update UI
        document.getElementById('start-recording').style.display = 'none';
        document.getElementById('stop-recording').style.display = 'inline-block';
        document.getElementById('recording-timer').style.display = 'inline-block';

        // UPDATED: Show scrolling caption overlay during recording
        this.showCaptionOverlay();

        // NEW: Show logo watermark during recording
        this.showLogoWatermark();

        // FIXED: Start countdown timer
        this.startTimer();

        // Haptic feedback
        window.ChortleUtils.vibrate(100);

        console.log('Recording started with scrolling caption overlay');
    },

    // FIXED: Start recording timer with proper countdown
    startTimer: function() {
        window.ChortleState.recordingTimer = setInterval(() => {
            window.ChortleState.recordingSeconds--;
            
            const minutes = Math.floor(window.ChortleState.recordingSeconds / 60);
            const seconds = window.ChortleState.recordingSeconds % 60;
            
            // Update timer display
            const timerEl = document.getElementById('recording-timer');
            if (timerEl) {
                timerEl.textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                // Add warning color when under 10 seconds
                if (window.ChortleState.recordingSeconds <= 10) {
                    timerEl.style.color = '#ff4444';
                    timerEl.style.borderColor = '#ff4444';
                } else {
                    timerEl.style.color = '#dc3545';
                    timerEl.style.borderColor = '#dc3545';
                }
            }
    
            // FIXED: Auto-stop when countdown reaches 0
            if (window.ChortleState.recordingSeconds <= 0) {
                console.log('Timer reached 0 - auto-stopping recording');
                this.stopRecording();
            }
        }, 1000);
    },

    // UPDATED: Stop recording
    stopRecording: function() {
        if (window.ChortleState.mediaRecorder && 
            window.ChortleState.mediaRecorder.state === 'recording') {
            window.ChortleState.mediaRecorder.stop();
        }

        // Clear timer
        if (window.ChortleState.recordingTimer) {
            clearInterval(window.ChortleState.recordingTimer);
            window.ChortleState.recordingTimer = null;
        }

        // Reset UI
        document.getElementById('start-recording').style.display = 'inline-block';
        document.getElementById('stop-recording').style.display = 'none';
        document.getElementById('recording-timer').style.display = 'none';

        // UPDATED: Hide scrolling caption overlay
        this.hideCaptionOverlay();

        // Stop canvas recording
        this.stopCanvasRecording();

        // Haptic feedback
        window.ChortleUtils.vibrate([100, 50, 100]);

        console.log('Recording stopped, scrolling caption overlay hidden');
    },

    // UPDATED: Handle recording stop event
    handleRecordingStop: function() {
        const mimeType = window.ChortleState.mediaRecorder.mimeType || 'video/webm';
        const blob = new Blob(window.ChortleState.recordedChunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(blob);

        // Show recorded video
        const recordedVideo = document.getElementById('recorded-video');
        recordedVideo.src = videoUrl;
        recordedVideo.videoBlob = blob; // Store blob for upload

        // Switch to playback view
        document.getElementById('recording-area').style.display = 'none';
        const playbackArea = document.getElementById('playback-area');
        playbackArea.style.display = 'block';
        playbackArea.classList.add('active');

        // Stop camera stream
        if (window.ChortleState.stream) {
            window.ChortleState.stream.getTracks().forEach(track => track.stop());
        }
        
        // Restore normal layout
        document.querySelector('.header').style.display = 'block';
        const recordingArea = document.getElementById('recording-area');
        recordingArea.classList.remove('fullscreen-recording');
        
        // UPDATED: Remove scrolling caption overlay
        this.removeCaptionOverlay();

        console.log('Recording completed and processed');
    },

    // UPDATED: Re-record video
    reRecord: function() {
        // Hide playback area
        document.getElementById('playback-area').style.display = 'none';
        
        // Reset to camera setup
        document.getElementById('camera-setup').style.display = 'block';
        document.getElementById('recording-area').style.display = 'none';
        
        // Reset recording state
        window.ChortleState.recordedChunks = [];
        
        // Clean up previous video
        const recordedVideo = document.getElementById('recorded-video');
        if (recordedVideo.src) {
            URL.revokeObjectURL(recordedVideo.src);
            recordedVideo.src = '';
            recordedVideo.videoBlob = null;
        }
    
        console.log('Re-recording setup - returning to camera start');
    },

    // UPDATED: Send video to creator with better error handling
    sendVideo: async function() {
        const recordedVideo = document.getElementById('recorded-video');
        const videoBlob = recordedVideo.videoBlob;

        if (!videoBlob) {
            window.ChortleApp.showError('No video to send!');
            return;
        }

        console.log('Starting video upload process...');
        console.log('Video blob size:', videoBlob.size, 'bytes');

        // Show upload progress
        document.getElementById('playback-area').style.display = 'none';
        document.getElementById('upload-progress').style.display = 'block';

        try {
            // Step 1: Create video container
            this.updateUploadProgress(10, 'Creating video container...');
            const videoContainer = await this.createVideoContainer();
            const videoId = videoContainer.videoId;
            
            console.log('Video container created, ID:', videoId);
            
            if (!videoId) {
                throw new Error('Video ID is null or undefined after container creation');
            }

            // Step 2: Upload video
            this.updateUploadProgress(20, 'Starting upload...');
            const uploadResult = await this.uploadVideoToApiVideo(videoBlob, videoId);
            console.log('Upload completed:', uploadResult);

            // Step 3: Finalize
            this.updateUploadProgress(95, 'Finalizing upload...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Step 4: Create playback link
            const chortleData = this.getCurrentChortleData();
            // Validate chortle data
            if (!chortleData || !chortleData.template) {
                console.error('Invalid or missing chortle data:', chortleData);
                throw new Error('Missing Chortle data - unable to create playback link');
            }
            console.log('Creating playback link with video ID:', videoId);
            
            const linkData = {
                videoId: videoId,
                chortle: chortleData,
                uploadTime: Date.now()
            };

            const encodedLinkData = window.ChortleUtils.encodeChortleData(linkData);
            if (!encodedLinkData) {
                throw new Error('Failed to encode link data');
            }
            
            const playbackUrl = window.ChortleUtils.getBaseUrl() + '#video=' + encodedLinkData;
            console.log('Generated playback URL:', playbackUrl);

            // UPDATED: Try native sharing first, then fall back to copy link
            this.updateUploadProgress(100, 'Upload complete!');
            document.getElementById('upload-progress').style.display = 'none';
            
            // Try to share using native Web Share API
            const shareResult = await window.ChortleUtils.shareUrl(
                playbackUrl, 
                'Watch my hilarious Chortle performance!'
            );

            if (shareResult.success && shareResult.method === 'native') {
                // Native sharing succeeded - show simple success message
                document.getElementById('video-sent').innerHTML = `
                    <h4>🎉 Video Shared!</h4>
                    <p>Your performance has been shared successfully!</p>
                    <p style="font-size: 0.9em; color: #666; margin-top: 10px;">Video ID: ${videoId}</p>
                `;
                document.getElementById('video-sent').style.display = 'block';
            } else {
                // Fall back to showing the copy link interface
                document.getElementById('playback-link').value = playbackUrl;
                document.getElementById('video-sent').style.display = 'block';
            }

            // Haptic feedback
            window.ChortleUtils.vibrate([200, 100, 200]);

            // Add processing note
            this.addProcessingNote();

        } catch (error) {
            console.error('Video upload process failed:', error);
            this.handleUploadError(error);
        }
    },

    // Create video container in api.video (FIXED with better error handling)
    createVideoContainer: async function() {
        console.log('Creating video container...');
        
        const response = await fetch('https://ws.api.video/videos', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${window.ChortleConfig.API_VIDEO.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `Chortle Reading - ${Date.now()}`,
                description: 'A hilarious Chortle reading created with Chortle!',
                public: true,
                mp4Support: true
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API response error:', response.status, errorText);
            throw new Error(`Failed to create video container: ${response.status} - ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Video container response:', responseData);
        
        // FIXED: Handle different possible response structures
        const videoId = responseData.videoId || responseData.id || responseData.video?.id;
        
        if (!videoId) {
            console.error('No video ID found in response:', responseData);
            throw new Error('No video ID returned from API');
        }
        
        console.log('Video container created with ID:', videoId);
        return { videoId: videoId, ...responseData };
    },

    // Upload video to api.video (FIXED with better error handling)
    uploadVideoToApiVideo: function(videoBlob, videoId) {
        console.log('Starting video upload to API, video ID:', videoId);
        
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', videoBlob, 'chortle-recording.webm');

            const uploadUrl = `https://ws.api.video/videos/${videoId}/source`;
            console.log('Upload URL:', uploadUrl);
            
            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = 20 + (event.loaded / event.total) * 70; // 20-90%
                    this.updateUploadProgress(percentComplete, `Uploading... ${Math.round(percentComplete - 20)}%`);
                    console.log('Upload progress:', Math.round(percentComplete - 20) + '%');
                }
            });

            xhr.addEventListener('load', () => {
                console.log('Upload completed with status:', xhr.status);
                
                if (xhr.status === 201) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        console.log('Upload response:', response);
                        resolve(response);
                    } catch (e) {
                        console.error('Failed to parse upload response:', xhr.responseText);
                        resolve({ success: true }); // Continue anyway
                    }
                } else {
                    console.error('Upload failed with status:', xhr.status, xhr.responseText);
                    reject(new Error(`Upload failed: ${xhr.status} - ${xhr.responseText}`));
                }
            });

            xhr.addEventListener('error', () => {
                console.error('Upload network error');
                reject(new Error('Upload failed due to network error'));
            });

            xhr.open('POST', uploadUrl);
            xhr.setRequestHeader('Authorization', `Bearer ${window.ChortleConfig.API_VIDEO.apiKey}`);
            xhr.send(formData);
        });
    },

    // Update upload progress (unchanged)
    updateUploadProgress: function(percent, message) {
        const progressFill = document.getElementById('upload-progress-fill');
        const uploadStatus = document.getElementById('upload-status');

        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }

        if (uploadStatus) {
            uploadStatus.textContent = message;
        }
    },

    // Handle upload errors (unchanged)
    handleUploadError: function(error) {
        console.error('Video upload failed:', error);
        
        document.getElementById('upload-progress').style.display = 'none';
        document.getElementById('playback-area').style.display = 'block';

        let errorMessage = 'Failed to upload video. ';
        
        if (error.message.includes('network')) {
            errorMessage += 'Please check your internet connection and try again.';
        } else if (error.message.includes('413')) {
            errorMessage += 'Video file is too large. Try recording a shorter video.';
        } else if (error.message.includes('401') || error.message.includes('403')) {
            errorMessage += 'API key issue. Please check the configuration.';
        } else {
            errorMessage += `Error details: ${error.message}`;
        }

        window.ChortleApp.showError(errorMessage);
    },

    // Get current chortle data from URL (FIXED to preserve data and validate)
    getCurrentChortleData: function() {
        // First try to get from stored state (if we've already processed it)
        if (window.ChortleState.currentChortleData) {
            console.log('Using stored chortle data:', window.ChortleState.currentChortleData);
            
            // Validate that it has the required template field
            if (window.ChortleState.currentChortleData.template) {
                return window.ChortleState.currentChortleData;
            } else {
                console.error('Stored chortle data missing template field');
            }
        }
        
        // Otherwise, get from URL hash
        const hash = window.location.hash;
        console.log('Checking hash for chortle data:', hash);
        
        if (hash.startsWith('#chortle=')) {
            try {
                const chortleData = hash.substring(9);
                const decodedData = window.ChortleUtils.decodeChortleData(chortleData);
                console.log('Decoded chortle data from hash:', decodedData);
                
                // Validate the decoded data has a template
                if (!decodedData || !decodedData.template) {
                    console.error('Decoded data missing template:', decodedData);
                    return null;
                }
                
                // Store it for future use
                window.ChortleState.currentChortleData = decodedData;
                
                return decodedData;
            } catch (e) {
                console.error('Failed to decode chortle data from hash:', e);
                return null;
            }
        }
        
        console.log('No chortle data found in hash or state');
        return null;
    },

    // Add processing note to video sent section (unchanged)
    addProcessingNote: function() {
        const videoSentDiv = document.getElementById('video-sent');
        const existingNote = videoSentDiv.querySelector('.processing-note');
        
        if (!existingNote) {
            const processingNote = document.createElement('p');
            processingNote.className = 'processing-note';
            processingNote.style.cssText = 'margin-top: 10px; font-size: 0.9em; color: #666; font-style: italic;';
            processingNote.textContent = 'Note: Video may take 30-60 seconds to process before it can be viewed.';
            videoSentDiv.appendChild(processingNote);
        }
    },

    // Copy playback link (unchanged)
    copyPlaybackLink: function() {
        const linkInput = document.getElementById('playback-link');
        const copyBtn = document.getElementById('copy-playback-link');

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

    // Show video playback for creators (FIXED with better error handling)
    showVideoPlayback: function(encodedData) {
        console.log('Showing video playback for encoded data:', encodedData);
        
        window.ChortleApp.showPage('video-playback-view');

        try {
            const linkData = window.ChortleUtils.decodeChortleData(encodedData);
            console.log('Decoded link data:', linkData);
            
            if (!linkData) {
                throw new Error('Failed to decode video link data');
            }
            
            const videoId = linkData.videoId;
            const chortleData = linkData.chortle;
            
            console.log('Video ID for playback:', videoId);
            console.log('Chortle data for playback:', chortleData);

            if (!videoId) {
                throw new Error('No video ID found in link data');
            }

            this.setupVideoPlayer(videoId);
            this.displayOriginalChortle(chortleData);

        } catch (error) {
            console.error('Error loading video playback:', error);
            window.ChortleApp.showError(`Video not found or link is invalid. Error: ${error.message}`);
        }
    },

    // Setup video player with multiple fallback options (unchanged)
    setupVideoPlayer: function(videoId) {
        const playerContainer = document.getElementById('api-video-player');

        // Show loading first
        playerContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; background: #f0f0f0; border-radius: 10px;">
                <p>Loading video...</p>
                <p style="font-size: 0.9em; color: #666; margin-top: 10px;">Video ID: ${videoId}</p>
                <div style="margin-top: 15px;">
                    <button id="try-direct-link" style="padding: 10px 20px; background: #2196f3; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Try Direct Video Link
                    </button>
                </div>
            </div>
        `;

        // Add direct link handler
        document.getElementById('try-direct-link').addEventListener('click', () => {
            this.loadDirectVideo(videoId, playerContainer);
        });

        // Try iframe embed first
        setTimeout(() => {
            this.tryVideoEmbed(videoId, playerContainer);
        }, 2000);
    },

    // Try iframe video embed (unchanged)
    tryVideoEmbed: function(videoId, container) {
        const embedUrl = `https://embed.api.video/vod/${videoId}`;
        
        container.innerHTML = `
            <iframe
                src="${embedUrl}"
                width="100%"
                height="400"
                frameborder="0"
                scrolling="no"
                allowfullscreen="true"
                style="border-radius: 10px;">
            </iframe>
        `;

        // Fallback after timeout
        setTimeout(() => {
            if (container.querySelector('iframe')) {
                this.showVideoFallback(videoId, container);
            }
        }, 5000);
    },

    // Load direct video if embed fails (unchanged)
    loadDirectVideo: function(videoId, container) {
        const directUrl = `https://vod.api.video/vod/${videoId}/mp4/source.mp4`;
        
        container.innerHTML = `
            <video controls style="width: 100%; max-width: 600px; border-radius: 10px;">
                <source src="${directUrl}" type="video/mp4">
                <p>Your browser doesn't support video playback.</p>
            </video>
            <p style="margin-top: 10px; font-size: 0.9em; color: #666;">Direct video link</p>
        `;
    },

    // Show fallback options if video loading fails (unchanged)
    showVideoFallback: function(videoId, container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; background: #fff3cd; border-radius: 10px; border: 1px solid #ffeaa7;">
                <h4>Video Processing</h4>
                <p>The video is still being processed by api.video.</p>
                <p style="margin: 15px 0;">Try this direct link:</p>
                <a href="https://vod.api.video/vod/${videoId}/mp4/source.mp4" 
                   target="_blank" 
                   style="color: #2196f3; text-decoration: underline;">
                   Open Video in New Tab
                </a>
                <p style="margin-top: 15px; font-size: 0.9em; color: #666;">
                   Or wait 1-2 minutes and refresh this page.
                </p>
            </div>
        `;
    },

    // Display original chortle text (unchanged)
    displayOriginalChortle: function(chortleData) {
        if (chortleData && chortleData.template) {
            const template = chortleData.template;
            const data = { ...chortleData };
            delete data.template;

            const templateObj = window.ChortleTemplates.getTemplate(template);
            if (templateObj) {
                const story = window.ChortleTemplates.renderTemplate(template, data);
                document.getElementById('original-chortle-text').innerHTML = story;
            }
        }
    },

    // UPDATED: Cleanup video resources
    cleanup: function() {
        // Stop camera stream
        if (window.ChortleState.stream) {
            window.ChortleState.stream.getTracks().forEach(track => track.stop());
            window.ChortleState.stream = null;
        }

        // Clear recording timer
        if (window.ChortleState.recordingTimer) {
            clearInterval(window.ChortleState.recordingTimer);
            window.ChortleState.recordingTimer = null;
        }

        // UPDATED: Stop caption scrolling and remove overlay
        this.removeCaptionOverlay();
        
        // NEW: Cleanup canvas recording
        this.cleanupCanvas();

        // Reset state
        window.ChortleState.mediaRecorder = null;
        window.ChortleState.recordedChunks = [];
        window.ChortleState.recordingSeconds = 0;

        console.log('Video cleanup complete with caption system reset');
    }
};

// Export for debugging
if (window.ChortleDebug) {
    window.ChortleDebug.video = window.ChortleVideo;
}
