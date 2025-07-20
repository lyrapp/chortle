/* Chortle v5.0 - Templates & Template Management */

window.ChortleTemplates = {
    // All Mad Lib templates
    templates: {
        'silly-story': {
            title: 'Silly Zoo Adventure',
            category: 'funny',
            description: 'A wacky day at the zoo with unexpected animals',
            template: `Yesterday, <span class="filled-word">{name}</span> went to the <span class="filled-word">{adjective1}</span> zoo. They saw a <span class="filled-word">{animal}</span> that <span class="filled-word">{verb1}</span> all the way to <span class="filled-word">{place}</span>. It was so <span class="filled-word">{adjective2}</span> that <span class="filled-word">{name}</span> watched it for <span class="filled-word">{number}</span> hours straight! The <span class="filled-word">{animal}</span> even waved goodbye when they left.`,
            fields: [
                { name: 'name', label: "A person's name", type: 'text' },
                { name: 'adjective1', label: 'An adjective', type: 'text' },
                { name: 'animal', label: 'An animal', type: 'text' },
                { name: 'verb1', label: 'A verb (past tense)', type: 'text' },
                { name: 'place', label: 'A place', type: 'text' },
                { name: 'adjective2', label: 'Another adjective', type: 'text' },
                { name: 'number', label: 'A number', type: 'number' }
            ]
        },
        
        'job-interview': {
            title: 'Awkward Job Interview',
            category: 'funny',
            description: 'The most ridiculous job interview ever',
            template: `"So, <span class="filled-word">{yourname}</span>, tell us about yourself." "Well, I'm really good at <span class="filled-word">{skill}</span> and I'm very <span class="filled-word">{adjective1}</span>. I want to be your next <span class="filled-word">{jobtitle}</span>!" The interviewer picked up a <span class="filled-word">{object}</span> and started <span class="filled-word">{verb1}</span> while scratching their <span class="filled-word">{bodypart}</span>. "You're hired!" they said.`,
            fields: [
                { name: 'yourname', label: 'Your name', type: 'text' },
                { name: 'skill', label: 'A weird skill', type: 'text' },
                { name: 'adjective1', label: 'An adjective', type: 'text' },
                { name: 'jobtitle', label: 'A silly job title', type: 'text' },
                { name: 'object', label: 'An object', type: 'text' },
                { name: 'verb1', label: 'A verb ending in -ing', type: 'text' },
                { name: 'bodypart', label: 'A body part', type: 'text' }
            ]
        },
        
        'vacation': {
            title: 'Dream Vacation Gone Wrong',
            category: 'adventure',
            description: 'A vacation that takes an unexpected turn',
            template: `Last summer, I took a trip to <span class="filled-word">{place}</span> by <span class="filled-word">{transport}</span>. The weather was <span class="filled-word">{adjective1}</span> and I ate <span class="filled-word">{food}</span> for breakfast every day. I spent most of my time <span class="filled-word">{activity}</span> with <span class="filled-word">{celebrity}</span>. It made me feel so <span class="filled-word">{feeling}</span> that I never wanted to come home!`,
            fields: [
                { name: 'place', label: 'A strange place', type: 'text' },
                { name: 'transport', label: 'A mode of transportation', type: 'text' },
                { name: 'adjective1', label: 'An adjective', type: 'text' },
                { name: 'food', label: 'A food', type: 'text' },
                { name: 'activity', label: 'An activity', type: 'text' },
                { name: 'celebrity', label: 'A celebrity', type: 'text' },
                { name: 'feeling', label: 'A feeling', type: 'text' }
            ]
        },
        
        'superhero': {
            title: 'Superhero Origin Story',
            category: 'adventure',
            description: 'How an ordinary person became extraordinary',
            template: `Meet <span class="filled-word">{heroname}</span>, the <span class="filled-word">{adjective1}</span> superhero! After being bitten by a radioactive <span class="filled-word">{object}</span>, they gained the power of <span class="filled-word">{power}</span>. Now they protect <span class="filled-word">{city}</span> from the evil villain <span class="filled-word">{villain}</span>. But beware - their one weakness is <span class="filled-word">{weakness}</span>!`,
            fields: [
                { name: 'heroname', label: 'A superhero name', type: 'text' },
                { name: 'power', label: 'A superpower', type: 'text' },
                { name: 'object', label: 'An ordinary object', type: 'text' },
                { name: 'villain', label: 'A villain name', type: 'text' },
                { name: 'weakness', label: 'A weakness', type: 'text' },
                { name: 'city', label: 'A city', type: 'text' },
                { name: 'adjective1', label: 'An adjective', type: 'text' }
            ]
        },
        
        'love-letter': {
            title: 'Romantic Love Letter',
            category: 'romance',
            description: 'A heartfelt (and hilarious) declaration of love',
            template: `My dearest <span class="filled-word">{crushname}</span>, you are more <span class="filled-word">{adjective1}</span> than a <span class="filled-word">{animal}</span> in <span class="filled-word">{season}</span>. When I first saw you <span class="filled-word">{verb1}</span> in the <span class="filled-word">{place}</span>, my heart started <span class="filled-word">{verb2}</span> like a <span class="filled-word">{machine}</span>. Will you <span class="filled-word">{romanticact}</span> with me under the <span class="filled-word">{adjective2}</span> moon? Forever yours, <span class="filled-word">{yourname}</span>`,
            fields: [
                { name: 'crushname', label: "Your crush's name", type: 'text' },
                { name: 'adjective1', label: 'A romantic adjective', type: 'text' },
                { name: 'animal', label: 'A graceful animal', type: 'text' },
                { name: 'season', label: 'A season', type: 'text' },
                { name: 'verb1', label: 'A verb ending in -ing', type: 'text' },
                { name: 'place', label: 'A romantic place', type: 'text' },
                { name: 'verb2', label: 'A verb ending in -ing', type: 'text' },
                { name: 'machine', label: 'A machine or appliance', type: 'text' },
                { name: 'romanticact', label: 'A romantic activity', type: 'text' },
                { name: 'adjective2', label: 'Another adjective', type: 'text' },
                { name: 'yourname', label: 'Your name', type: 'text' }
            ]
        },
        
        'first-date': {
            title: 'Disastrous First Date',
            category: 'romance',
            description: 'When romance goes hilariously wrong',
            template: `I picked up <span class="filled-word">{datename}</span> in my <span class="filled-word">{adjective1}</span> <span class="filled-word">{vehicle}</span>. We went to a <span class="filled-word">{adjective2}</span> restaurant where I accidentally <span class="filled-word">{verb1}</span> the <span class="filled-word">{food}</span> all over their <span class="filled-word">{clothing}</span>. Then we went <span class="filled-word">{activity}</span>, but I was so nervous I kept <span class="filled-word">{verb2}</span> every <span class="filled-word">{timeperiod}</span>. Surprisingly, they said yes to a second date!`,
            fields: [
                { name: 'datename', label: "Your date's name", type: 'text' },
                { name: 'adjective1', label: 'An adjective', type: 'text' },
                { name: 'vehicle', label: 'A vehicle', type: 'text' },
                { name: 'adjective2', label: 'Another adjective', type: 'text' },
                { name: 'verb1', label: 'A clumsy verb (past tense)', type: 'text' },
                { name: 'food', label: 'A messy food', type: 'text' },
                { name: 'clothing', label: 'An article of clothing', type: 'text' },
                { name: 'activity', label: 'A date activity', type: 'text' },
                { name: 'verb2', label: 'An embarrassing verb', type: 'text' },
                { name: 'timeperiod', label: 'A time period', type: 'text' }
            ]
        },
        
        'alien-invasion': {
            title: 'Alien Invasion Report',
            category: 'weird',
            description: 'Breaking news from outer space',
            template: `BREAKING NEWS: Aliens have landed in <span class="filled-word">{city}</span>! The <span class="filled-word">{adjective1}</span> creatures are <span class="filled-word">{color}</span> and have <span class="filled-word">{number}</span> <span class="filled-word">{bodypart}</span>. They arrived in a giant <span class="filled-word">{object}</span> and immediately started <span class="filled-word">{verb1}</span> all the <span class="filled-word">{pluralnoun}</span>. Their leader, who speaks only in <span class="filled-word">{language}</span>, demands <span class="filled-word">{demand}</span>. The president is reportedly <span class="filled-word">{verb2}</span> in response.`,
            fields: [
                { name: 'city', label: 'A city', type: 'text' },
                { name: 'adjective1', label: 'An adjective', type: 'text' },
                { name: 'color', label: 'A weird color', type: 'text' },
                { name: 'number', label: 'A number', type: 'number' },
                { name: 'bodypart', label: 'A body part (plural)', type: 'text' },
                { name: 'object', label: 'A large object', type: 'text' },
                { name: 'verb1', label: 'A verb ending in -ing', type: 'text' },
                { name: 'pluralnoun', label: 'A plural noun', type: 'text' },
                { name: 'language', label: 'A silly language', type: 'text' },
                { name: 'demand', label: 'An absurd demand', type: 'text' },
                { name: 'verb2', label: 'A verb ending in -ing', type: 'text' }
            ]
        },
        
        'cooking-disaster': {
            title: 'Cooking Show Catastrophe',
            category: 'funny',
            description: 'Gordon Ramsay would not approve',
            template: `Welcome to "<span class="filled-word">{showname}</span>" with Chef <span class="filled-word">{chefname}</span>! Today we're making <span class="filled-word">{adjective1}</span> <span class="filled-word">{dish}</span>. First, you take <span class="filled-word">{number}</span> cups of <span class="filled-word">{ingredient1}</span> and <span class="filled-word">{verb1}</span> it with a <span class="filled-word">{tool}</span>. Then add <span class="filled-word">{ingredient2}</span> until it turns <span class="filled-word">{color}</span>. Oh no! The kitchen is on fire! Quickly, <span class="filled-word">{verb2}</span> the <span class="filled-word">{ingredient3}</span>!`,
            fields: [
                { name: 'showname', label: 'A cooking show name', type: 'text' },
                { name: 'chefname', label: "Chef's name", type: 'text' },
                { name: 'adjective1', label: 'An adjective', type: 'text' },
                { name: 'dish', label: 'A type of food', type: 'text' },
                { name: 'number', label: 'A number', type: 'number' },
                { name: 'ingredient1', label: 'A weird ingredient', type: 'text' },
                { name: 'verb1', label: 'A cooking verb', type: 'text' },
                { name: 'tool', label: 'A kitchen tool', type: 'text' },
                { name: 'ingredient2', label: 'Another ingredient', type: 'text' },
                { name: 'color', label: 'An unappetizing color', type: 'text' },
                { name: 'verb2', label: 'An action verb', type: 'text' },
                { name: 'ingredient3', label: 'A final ingredient', type: 'text' }
            ]
        }
    },

    // Template management functions
    getTemplate: function(templateKey) {
        return this.templates[templateKey] || null;
    },

    getAllTemplates: function() {
        return this.templates;
    },

    getTemplatesByCategory: function(category) {
        if (category === 'all') {
            return this.templates;
        }

        const filtered = {};
        Object.keys(this.templates).forEach(key => {
            if (this.templates[key].category === category) {
                filtered[key] = this.templates[key];
            }
        });
        return filtered;
    },

    searchTemplates: function(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return this.templates;
        }

        const term = searchTerm.toLowerCase();
        const filtered = {};
        
        Object.keys(this.templates).forEach(key => {
            const template = this.templates[key];
            if (template.title.toLowerCase().includes(term) || 
                template.description.toLowerCase().includes(term)) {
                filtered[key] = template;
            }
        });
        
        return filtered;
    },

    filterTemplates: function(category, searchTerm) {
        let templates = this.getTemplatesByCategory(category);
        
        if (searchTerm && searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            const filtered = {};
            
            Object.keys(templates).forEach(key => {
                const template = templates[key];
                if (template.title.toLowerCase().includes(term) || 
                    template.description.toLowerCase().includes(term)) {
                    filtered[key] = template;
                }
            });
            
            templates = filtered;
        }
        
        return templates;
    },

    getCategories: function() {
        const categories = new Set();
        Object.values(this.templates).forEach(template => {
            categories.add(template.category);
        });
        return Array.from(categories).sort();
    },

    validateTemplate: function(templateKey) {
        const template = this.getTemplate(templateKey);
        if (!template) return false;
        
        // Check required properties
        if (!template.title || !template.category || !template.description || 
            !template.template || !Array.isArray(template.fields)) {
            return false;
        }
        
        // Check fields
        for (const field of template.fields) {
            if (!field.name || !field.label || !field.type) {
                return false;
            }
        }
        
        return true;
    },

    renderTemplate: function(templateKey, data) {
        const template = this.getTemplate(templateKey);
        if (!template) return null;
        
        let story = template.template;
        
        // Replace placeholders with data
        Object.keys(data).forEach(key => {
            if (key !== 'template') {
                const regex = new RegExp(`{${key}}`, 'g');
                story = story.replace(regex, data[key]);
            }
        });
        
        return story;
    },

    // Get template statistics
    getStats: function() {
        const templates = this.templates;
        const categories = this.getCategories();
        const stats = {
            total: Object.keys(templates).length,
            byCategory: {},
            averageFields: 0,
            totalFields: 0
        };
        
        // Count by category
        categories.forEach(category => {
            stats.byCategory[category] = Object.values(templates)
                .filter(t => t.category === category).length;
        });
        
        // Calculate field statistics
        const fieldCounts = Object.values(templates).map(t => t.fields.length);
        stats.totalFields = fieldCounts.reduce((sum, count) => sum + count, 0);
        stats.averageFields = Math.round(stats.totalFields / stats.total);
        stats.minFields = Math.min(...fieldCounts);
        stats.maxFields = Math.max(...fieldCounts);
        
        return stats;
    },

    // Add new template (for future expansion)
    addTemplate: function(key, template) {
        if (this.validateTemplate(template)) {
            this.templates[key] = template;
            return true;
        }
        return false;
    },

    // Get random template
    getRandomTemplate: function(category = 'all') {
        const templates = this.getTemplatesByCategory(category);
        const keys = Object.keys(templates);
        
        if (keys.length === 0) return null;
        
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return {
            key: randomKey,
            template: templates[randomKey]
        };
    }
};

// Export for debugging
if (window.ChortleDebug) {
    window.ChortleDebug.templates = window.ChortleTemplates;
}
