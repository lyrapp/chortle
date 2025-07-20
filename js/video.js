/* Chortle v5.0 - Video Recording & Playback */

window.ChortleVideo = {
    // Initialize video system
    initialize: function() {
        this.setupEventListeners();
        console.log('Video system initialized');
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

    // Start camera for recording
    startCamera: async function() {
        const button = document.getElementById('start-camera');
        button.classList.add('btn-loading');
        button.disabled = true;

        // Auto-scroll on mobile
        window.ChortleUtils.scrollToElement('video-section');

        try {
            // Mobile-optimized camera constraints
            const constraints = {
                video: {
                    width: window.ChortleUtils.isMobile() ? { ideal: 720 } : { ideal: 1280 },
                    height: window.ChortleUtils.isMobile() ? { ideal: 1280 } : { ideal: 720 },
                    facingMode: 'user',
                    frameRate: { ideal: 30 }
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            };

            window.ChortleState.stream = await navigator.mediaDevices.getUserMedia(constraints);

            const preview = document.getElementById('camera-preview');
            preview.srcObject = window.ChortleState.stream;
            preview.play().catch(e => console.log('Autoplay prevented:', e));

            // Show recording area
            document.getElementById('camera-setup').style.display = 'none';
            document.getElementById('recording-area').style.display = 'block';

            // Auto-scroll to recording controls on mobile
            setTimeout(() => {
                window.ChortleUtils.scrollToElement('recording-area');
            }, 500);

        } catch (err) {
            this.handleCameraError(err);
        } finally {
            button.classList.remove('btn-loading');
            button.disabled = false;
        }
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

    // Start recording video
    startRecording: function() {
        window.ChortleState.recordedChunks = [];
        window.ChortleState.recordingSeconds = 0;

        // Request wake lock to prevent screen sleep
        window.ChortleUtils.requestWakeLock();

        // Create MediaRecorder
        const mimeType = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4';
        window.ChortleState.mediaRecorder = new MediaRecorder(window.ChortleState.stream, { mimeType });

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

        // Start timer
        this.startTimer();

        // Haptic feedback
        window.ChortleUtils.vibrate(100);
    },

    // Start recording timer
    startTimer: function() {
        window.ChortleState.recordingTimer = setInterval(() => {
            window.ChortleState.recordingSeconds++;
            const minutes = Math.floor(window.ChortleState.recordingSeconds / 60);
            const seconds = window.ChortleState.recordingSeconds % 60;
            
            document.getElementById('recording-timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // Auto-stop at max recording time
            if (window.ChortleState.recordingSeconds >= window.ChortleConfig.APP.maxRecordingTime) {
                this.stopRecording();
            }
        }, 1000);
    },

    // Stop recording
    stopRecording: function() {
        if (window.ChortleState.mediaRecorder && 
            window.ChortleState.mediaRecorder.state === 'recording') {
            window.ChortleState.mediaRecorder.stop();
        }

        // Clear timer
        if (window.ChortleState.recordingTimer) {
            clearInterval(window.ChortleState.recordingTimer);
        }

        // Reset UI
        document.getElementById('start-recording').style.display = 'inline-block';
        document.getElementById('stop-recording').style.display = 'none';
        document.getElementById('recording-timer').style.display = 'none';

        // Haptic feedback
        window.ChortleUtils.vibrate([100, 50, 100]);
    },

    // Handle recording stop event
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
        document.getElementById('playback-area').style.display = 'block';

        // Auto-scroll on mobile
        setTimeout(() => {
            window.ChortleUtils.scrollToElement('playback-area');
        }, 300);

        // Stop camera stream
        if (window.ChortleState.stream) {
            window.ChortleState.stream.getTracks().forEach(track => track.stop());
        }
    },

    // Re-record video
    reRecord: function() {
        document.getElementById('playback-area').style.display = 'none';
        document.getElementById('recording-area').style.display = 'block';
        window.ChortleState.recordedChunks = [];

        // Auto-scroll on mobile
        window.ChortleUtils.scrollToElement('recording-area');
    },

    // Send video to creator
    sendVideo: async function() {
        const recordedVideo = document.getElementById('recorded-video');
        const videoBlob = recordedVideo.videoBlob;

        if (!videoBlob) {
            window.ChortleApp.showError('No video to send!');
            return;
        }

        // Show upload progress
        document.getElementById('playback-area').style.display = 'none';
        document.getElementById('upload-progress').style.display = 'block';

        try {
            // Step 1: Create video container
            this.updateUploadProgress(10, 'Creating video container...');
            const videoContainer = await this.createVideoContainer();
            const videoId = videoContainer.videoId;

            // Step 2: Upload video
            this.updateUploadProgress(20, 'Starting upload...');
            await this.uploadVideoToApiVideo(videoBlob, videoId);

            // Step 3: Finalize
            this.updateUploadProgress(95, 'Finalizing upload...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Step 4: Create playback link
            const chortleData = this.getCurrentChortleData();
            const linkData = {
                videoId: videoId,
                chortle: chortleData,
                uploadTime: Date.now()
            };

            const encodedLinkData = window.ChortleUtils.encodeChortleData(linkData);
            const playbackUrl = window.ChortleUtils.getBaseUrl() + '#video=' + encodedLinkData;

            // Show success
            this.updateUploadProgress(100, 'Upload complete!');
            document.getElementById('playback-link').value = playbackUrl;
            document.getElementById('upload-progress').style.display = 'none';
            document.getElementById('video-sent').style.display = 'block';

            // Auto-scroll and haptic feedback
            window.ChortleUtils.scrollToElement('video-sent');
            window.ChortleUtils.vibrate([200, 100, 200]);

            // Add processing note
            this.addProcessingNote();

        } catch (error) {
            this.handleUploadError(error);
        }
    },

    // Create video container in api.video
    createVideoContainer: async function() {
        const response = await fetch('https://ws.api.video/videos', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${window.ChortleConfig.API_VIDEO.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `Chortle Reading - ${Date.now()}`,
                description: 'A hilarious Mad Lib reading created with Chortle!',
                public: true,
                mp4Support: true
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create video container: ${response.status}`);
        }

        return await response.json();
    },

    // Upload video to api.video
    uploadVideoToApiVideo: function(videoBlob, videoId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', videoBlob, 'chortle-recording.webm');

            const uploadUrl = `https://ws.api.video/videos/${videoId}/source`;
            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = 20 + (event.loaded / event.total) * 70; // 20-90%
                    this.updateUploadProgress(percentComplete, `Uploading... ${Math.round(percentComplete - 20)}%`);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 201) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(`Upload failed: ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed due to network error'));
            });

            xhr.open('POST', uploadUrl);
            xhr.setRequestHeader('Authorization', `Bearer ${window.ChortleConfig.API_VIDEO.apiKey}`);
            xhr.send(formData);
        });
    },

    // Update upload progress
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

    // Handle upload errors
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

    // Get current chortle data from URL
    getCurrentChortleData: function() {
        const hash = window.location.hash;
        if (hash.startsWith('#chortle=')) {
            try {
                const chortleData = hash.substring(9);
                return window.ChortleUtils.decodeChortleData(chortleData);
            } catch (e) {
                return null;
            }
        }
        return null;
    },

    // Add processing note to video sent section
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

    // Copy playback link
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

    // Show video playback for creators
    showVideoPlayback: function(encodedData) {
        window.ChortleApp.showPage('video-playback-view');

        try {
            const linkData = window.ChortleUtils.decodeChortleData(encodedData);
            const videoId = linkData.videoId;
            const chortleData = linkData.chortle;

            this.setupVideoPlayer(videoId);
            this.displayOriginalChortle(chortleData);

        } catch (error) {
            console.error('Error loading video:', error);
            window.ChortleApp.showError('Video not found or link is invalid.');
        }
    },

    // Setup video player with multiple fallback options
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

    // Try iframe video embed
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

    // Load direct video if embed fails
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

    // Show fallback options if video loading fails
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

    // Display original chortle text
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

    // Cleanup video resources
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

        // Reset state
        window.ChortleState.mediaRecorder = null;
        window.ChortleState.recordedChunks = [];
        window.ChortleState.recordingSeconds = 0;
    }
};

// Export for debugging
if (window.ChortleDebug) {
    window.ChortleDebug.video = window.ChortleVideo;
}
