/* Chortle v5.0 - Wizard System */

window.ChortleWizard = {
    // Initialize wizard for a template
    setup: function(templateKey) {
        const template = window.ChortleTemplates.getTemplate(templateKey);
        if (!template) {
            console.error('Template not found:', templateKey);
            return false;
        }

        // Reset wizard state
        window.ChortleState.currentTemplate = templateKey;
        window.ChortleState.currentStep = 0;
        window.ChortleState.wizardData = { template: templateKey };

        // Update wizard header
        document.getElementById('wizard-template-name').textContent = `Write: ${template.title}`;

        // Generate wizard steps
        this.generateSteps(template);

        // Setup event listeners
        this.setupEventListeners(template);

        // Show first step
        this.showStep(0);

        return true;
    },

    // Generate wizard steps HTML
    generateSteps: function(template) {
        const stepsContainer = document.getElementById('wizard-steps');
        stepsContainer.innerHTML = '';

        template.fields.forEach((field, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'wizard-step';
            stepDiv.dataset.step = index;

            stepDiv.innerHTML = `
                <div class="step-content">
                    <div class="step-question">${field.label}:</div>
                    <input type="${field.type}" 
                           class="step-input" 
                           data-field="${field.name}" 
                           placeholder="Enter your answer..." 
                           required>
                </div>
                <div class="step-navigation">
                    <button class="nav-btn btn-back" ${index === 0 ? 'style="visibility: hidden;"' : ''}>
                        ← Back
                    </button>
                    <button class="nav-btn btn-next" disabled>
                        ${index === template.fields.length - 1 ? 'Finish' : 'Next →'}
                    </button>
                </div>
            `;

            stepsContainer.appendChild(stepDiv);
        });
    },

    // Setup event listeners for wizard
    // Setup event listeners for wizard
setupEventListeners: function(template) {
    // Input validation
    document.querySelectorAll('.step-input').forEach(input => {
        input.addEventListener('input', () => this.validateCurrentStep());
        
        // Enter key navigation
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const nextBtn = input.closest('.wizard-step').querySelector('.btn-next');
                if (!nextBtn.disabled) {
                    nextBtn.click();
                }
            }
        });

        // Mobile keyboard handling (disabled auto-scroll)
        input.addEventListener('focus', (e) => {
            // Auto-scroll disabled to prevent unwanted page jumps
        });
    });

    // Back button navigation
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.ChortleState.currentStep > 0) {
                this.showStep(window.ChortleState.currentStep - 1);
            }
        });
    });

    // Next button navigation
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            this.handleNext(template);
        });
    });
},

    // Handle next button click
    handleNext: function(template) {
        const currentStepElement = document.querySelector(`[data-step="${window.ChortleState.currentStep}"]`);
        const input = currentStepElement.querySelector('.step-input');
        const fieldName = input.dataset.field;
        const value = input.value.trim();

        // Save data
        window.ChortleState.wizardData[fieldName] = value;

        // Log progress
        console.log(`Wizard: Collected ${fieldName} = "${value}"`);

        if (window.ChortleState.currentStep < template.fields.length - 1) {
            // Move to next step
            this.showStep(window.ChortleState.currentStep + 1);
        } else {
            // Wizard complete
            console.log('Wizard complete, final data:', window.ChortleState.wizardData);
            this.complete();
        }
    },

    // Show specific wizard step
    showStep: function(stepIndex) {
        // Hide all steps
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.querySelector(`[data-step="${stepIndex}"]`);
        if (!currentStepElement) {
            console.error('Step not found:', stepIndex);
            return;
        }

        currentStepElement.classList.add('active');
        window.ChortleState.currentStep = stepIndex;

        // Update progress
        this.updateProgress();

        // Focus input with delay for animation
        const input = currentStepElement.querySelector('.step-input');
        setTimeout(() => {
            input.focus();
        }, 100);

        // Restore existing value if any
        const fieldName = input.dataset.field;
        if (window.ChortleState.wizardData[fieldName]) {
            input.value = window.ChortleState.wizardData[fieldName];
            this.validateCurrentStep();
        }

    // Auto-scroll disabled to prevent unwanted page movement
        },

    // Update progress bar
    updateProgress: function() {
        const template = window.ChortleTemplates.getTemplate(window.ChortleState.currentTemplate);
        if (!template) return;

        const progress = ((window.ChortleState.currentStep + 1) / template.fields.length) * 100;
        
        document.getElementById('wizard-progress-fill').style.width = `${progress}%`;
        document.getElementById('wizard-progress-text').textContent = 
            `Step ${window.ChortleState.currentStep + 1} of ${template.fields.length}`;
    },

    // Validate current step
    validateCurrentStep: function() {
        const currentStepElement = document.querySelector(`[data-step="${window.ChortleState.currentStep}"]`);
        if (!currentStepElement) return;

        const input = currentStepElement.querySelector('.step-input');
        const nextBtn = currentStepElement.querySelector('.btn-next');

        if (!input || !nextBtn) return;

        const isValid = input.value.trim().length > 0;
        
        // Enable/disable next button
        nextBtn.disabled = !isValid;

        // Update input styling
        if (isValid) {
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
        }

        return isValid;
    },

    // Complete wizard and move to share page
    complete: function() {
        console.log('Wizard completing with data:', window.ChortleState.wizardData);
        
        // Validate all data is collected
        const template = window.ChortleTemplates.getTemplate(window.ChortleState.currentTemplate);
        if (!template) {
            console.error('Template not found during completion');
            return;
        }

        // Check all fields are filled
        const missingFields = template.fields.filter(field => {
            return !window.ChortleState.wizardData[field.name] || 
                   window.ChortleState.wizardData[field.name].trim() === '';
        });

        if (missingFields.length > 0) {
            console.error('Missing fields:', missingFields.map(f => f.name));
            this.showError('Please fill in all fields before continuing.');
            return;
        }

        // Move to share page
        window.ChortleApp.showPage('share-page');
    },

    // Navigate to specific step (for back button)
    goToStep: function(stepIndex) {
        const template = window.ChortleTemplates.getTemplate(window.ChortleState.currentTemplate);
        if (!template || stepIndex < 0 || stepIndex >= template.fields.length) {
            return false;
        }

        this.showStep(stepIndex);
        return true;
    },

    // Get wizard progress as percentage
    getProgress: function() {
        const template = window.ChortleTemplates.getTemplate(window.ChortleState.currentTemplate);
        if (!template) return 0;

        return ((window.ChortleState.currentStep + 1) / template.fields.length) * 100;
    },

    // Get completed fields count
    getCompletedFieldsCount: function() {
        const template = window.ChortleTemplates.getTemplate(window.ChortleState.currentTemplate);
        if (!template) return 0;

        let completed = 0;
        template.fields.forEach(field => {
            if (window.ChortleState.wizardData[field.name] && 
                window.ChortleState.wizardData[field.name].trim() !== '') {
                completed++;
            }
        });

        return completed;
    },

    // Check if wizard is complete
    isComplete: function() {
        const template = window.ChortleTemplates.getTemplate(window.ChortleState.currentTemplate);
        if (!template) return false;

        return this.getCompletedFieldsCount() === template.fields.length;
    },

    // Show error message
    showError: function(message) {
        window.ChortleApp.showError(message);
    },

    // Reset wizard
    reset: function() {
        window.ChortleState.currentTemplate = null;
        window.ChortleState.currentStep = 0;
        window.ChortleState.wizardData = {};

        // Clear wizard container
        const stepsContainer = document.getElementById('wizard-steps');
        if (stepsContainer) {
            stepsContainer.innerHTML = '';
        }

        // Reset progress
        document.getElementById('wizard-progress-fill').style.width = '0%';
        document.getElementById('wizard-progress-text').textContent = 'Step 0 of 0';
        document.getElementById('wizard-template-name').textContent = 'Template Name';
    },

    // Get wizard data for sharing
    getWizardData: function() {
        return { ...window.ChortleState.wizardData };
    },

    // Set wizard data (for editing)
    setWizardData: function(data) {
        window.ChortleState.wizardData = { ...data };
    },

    // Wizard debugging
    debug: function() {
        return {
            currentTemplate: window.ChortleState.currentTemplate,
            currentStep: window.ChortleState.currentStep,
            wizardData: window.ChortleState.wizardData,
            progress: this.getProgress(),
            completedFields: this.getCompletedFieldsCount(),
            isComplete: this.isComplete()
        };
    }
};

// Export for debugging
if (window.ChortleDebug) {
    window.ChortleDebug.wizard = window.ChortleWizard;
}
