/* Chortle v5.1 - History Storage System */

window.ChortleHistory = {
    // Storage key for localStorage
    STORAGE_KEY: 'chortle_history',
    
    // Chortle status constants
    STATUS: {
        PENDING: 'pending',       // Link shared, waiting for video
        COMPLETED: 'completed',   // Video received
        EXPIRED: 'expired'        // Old, likely abandoned
    },

    // Initialize history system
    initialize: function() {
        console.log('History system initialized');
        this.cleanupOldEntries();
    },

    // Get all chortle history
    getHistory: function() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading history:', error);
            return [];
        }
    },

    // Save chortle to history
    saveChortle: function(chortleData, shareUrl) {
        try {
            const history = this.getHistory();
            
            const entry = {
                id: this.generateId(),
                template: chortleData.template,
                templateTitle: this.getTemplateTitle(chortleData.template),
                fields: { ...chortleData },
                shareUrl: shareUrl,
                status: this.STATUS.PENDING,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
            };

            // Remove template from fields copy
            delete entry.fields.template;

            // Add to beginning of array (newest first)
            history.unshift(entry);

            // Limit to 50 entries max
            if (history.length > 50) {
                history.splice(50);
            }

            this.saveHistory(history);
            console.log('Chortle saved to history:', entry.id);
            
            return entry.id;
        } catch (error) {
            console.error('Error saving chortle to history:', error);
            return null;
        }
    },

    // Update chortle status
    updateStatus: function(chortleId, status, videoUrl = null) {
        try {
            const history = this.getHistory();
            const entry = history.find(item => item.id === chortleId);
            
            if (entry) {
                entry.status = status;
                entry.updatedAt = Date.now();
                
                if (videoUrl) {
                    entry.videoUrl = videoUrl;
                }
                
                this.saveHistory(history);
                console.log('Chortle status updated:', chortleId, status);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error updating chortle status:', error);
            return false;
        }
    },

    // Mark chortle as completed with video
    markCompleted: function(chortleId, videoUrl) {
        return this.updateStatus(chortleId, this.STATUS.COMPLETED, videoUrl);
    },

    // Get chortle by ID
    getChortle: function(chortleId) {
        const history = this.getHistory();
        return history.find(item => item.id === chortleId) || null;
    },

    // Get pending chortles
    getPending: function() {
        const history = this.getHistory();
        return history.filter(item => item.status === this.STATUS.PENDING);
    },

    // Get completed chortles
    getCompleted: function() {
        const history = this.getHistory();
        return history.filter(item => item.status === this.STATUS.COMPLETED);
    },

    // Delete chortle from history
    deleteChortle: function(chortleId) {
        try {
            const history = this.getHistory();
            const filteredHistory = history.filter(item => item.id !== chortleId);
            
            this.saveHistory(filteredHistory);
            console.log('Chortle deleted from history:', chortleId);
            return true;
        } catch (error) {
            console.error('Error deleting chortle:', error);
            return false;
        }
    },

    // Clear all history
    clearHistory: function() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            console.log('History cleared');
            return true;
        } catch (error) {
            console.error('Error clearing history:', error);
            return false;
        }
    },

    // Get statistics
    getStats: function() {
        const history = this.getHistory();
        const stats = {
            total: history.length,
            pending: 0,
            completed: 0,
            expired: 0,
            thisWeek: 0,
            thisMonth: 0
        };

        const now = Date.now();
        const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
        const monthAgo = now - (30 * 24 * 60 * 60 * 1000);

        history.forEach(entry => {
            // Count by status
            stats[entry.status]++;

            // Count by time
            if (entry.createdAt > weekAgo) {
                stats.thisWeek++;
            }
            if (entry.createdAt > monthAgo) {
                stats.thisMonth++;
            }
        });

        return stats;
    },

    // Clean up old/expired entries
    cleanupOldEntries: function() {
        try {
            const history = this.getHistory();
            const now = Date.now();
            let cleaned = false;

            // Mark expired entries
            history.forEach(entry => {
                if (entry.status === this.STATUS.PENDING && 
                    entry.expiresAt && 
                    now > entry.expiresAt) {
                    entry.status = this.STATUS.EXPIRED;
                    cleaned = true;
                }
            });

            // Remove very old entries (older than 30 days)
            const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
            const filteredHistory = history.filter(entry => {
                return entry.createdAt > thirtyDaysAgo;
            });

            if (cleaned || filteredHistory.length !== history.length) {
                this.saveHistory(filteredHistory);
                console.log('History cleanup completed');
            }
        } catch (error) {
            console.error('Error during history cleanup:', error);
        }
    },

    // Helper: Save history to localStorage
    saveHistory: function(history) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        } catch (error) {
            console.error('Error saving history to localStorage:', error);
            
            // If storage is full, remove oldest entries and try again
            if (error.name === 'QuotaExceededError') {
                console.warn('Storage quota exceeded, removing old entries');
                const reducedHistory = history.slice(0, 25); // Keep only 25 newest
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reducedHistory));
            }
        }
    },

    // Helper: Generate unique ID
    generateId: function() {
        return 'ch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Helper: Get template title
    getTemplateTitle: function(templateKey) {
        const template = window.ChortleTemplates.getTemplate(templateKey);
        return template ? template.title : 'Unknown Template';
    },

    // Helper: Format date for display
    formatDate: function(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
        const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
        const diffMins = Math.floor(diffMs / (60 * 1000));

        if (diffMins < 1) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    },

    // Helper: Get status display text
    getStatusText: function(status) {
        const statusMap = {
            [this.STATUS.PENDING]: 'Waiting for video',
            [this.STATUS.COMPLETED]: 'Video received',
            [this.STATUS.EXPIRED]: 'Expired'
        };
        
        return statusMap[status] || 'Unknown';
    },

    // Helper: Get status emoji
    getStatusEmoji: function(status) {
        const emojiMap = {
            [this.STATUS.PENDING]: '⏳',
            [this.STATUS.COMPLETED]: '✅',
            [this.STATUS.EXPIRED]: '⏰'
        };
        
        return emojiMap[status] || '❓';
    },

    // Debug: Export history as JSON
    exportHistory: function() {
        const history = this.getHistory();
        const dataStr = JSON.stringify(history, null, 2);
        
        console.log('History export:', dataStr);
        
        // Create downloadable file
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chortle-history-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },

    // Debug: Import history from JSON
    importHistory: function(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            if (Array.isArray(imported)) {
                this.saveHistory(imported);
                console.log('History imported successfully');
                return true;
            } else {
                throw new Error('Invalid format');
            }
        } catch (error) {
            console.error('Error importing history:', error);
            return false;
        }
    }
};

// Export for debugging
if (window.ChortleDebug) {
    window.ChortleDebug.history = window.ChortleHistory;
}
