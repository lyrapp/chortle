/* Chortle v5.2 - Templates with Example Words */

window.ChortleTemplates = {
    // All Chortle templates
templates: {
        'ghost-story': {
        title: 'Ghost Story',
        category: 'weird',
        description: 'A spooky tale of ghostly roommate troubles',
        icon: 'icons/ghost-story.png',
        template: `I've been living with a ghost in my <span class="filled-word">{place}</span>. Last night, he <span class="filled-word">{verb1}</span> so <span class="filled-word">{adverb}</span> that I <span class="filled-word">{verb2}</span> my <span class="filled-word">{bodypart1}</span>. He won't leave me alone and even <span class="filled-word">{verb3}</span> me as I am sleeping. I needed to get rid of him, so I bought a <span class="filled-word">{object}</span> to put in his <span class="filled-word">{adjective1}</span> <span class="filled-word">{bodypart2}</span>. After that, he was really <span class="filled-word">{adjective2}</span>. That'll teach him a lesson.`,
        fields: [
            { name: 'place', label: 'A place to live', type: 'text', suggestions: ['attic', 'basement', 'closet'] },
            { name: 'verb1', label: 'A spooky verb - past tense', type: 'text', suggestions: ['howled', 'rattled', 'floated'] },
            { name: 'adverb', label: 'An adverb', type: 'text', suggestions: ['loudly', 'mysteriously', 'annoyingly'] },
            { name: 'verb2', label: 'A reaction verb - past tense', type: 'text', suggestions: ['covered', 'grabbed', 'hid'] },
            { name: 'bodypart1', label: 'A body part', type: 'text', suggestions: ['ears', 'eyes', 'head'] },
            { name: 'verb3', label: 'A spooky verb - present tense', type: 'text', suggestions: ['haunts', 'bothers', 'tickles'] },
            { name: 'object', label: 'A magical object', type: 'text', suggestions: ['crystal', 'garlic clove', 'music box'] },
            { name: 'adjective1', label: 'An adjective', type: 'text', suggestions: ['ghostly', 'transparent', 'creepy'] },
            { name: 'bodypart2', label: 'Another body part', type: 'text', suggestions: ['hand', 'foot', 'nose'] },
            { name: 'adjective2', label: 'A feeling adjective', type: 'text', suggestions: ['angry', 'confused', 'embarrassed'] }
        ]
    },
    
    'sweet-dreams': {
        title: 'Sweet Dreams',
        category: 'weird',
        description: 'Share your wildest dreams with everyone',
        icon: 'icons/sweet-dreams.png',
        template: `Sometimes, I dream about <span class="filled-word">{noun}</span>. When I do, it makes me say <span class="filled-word">{exclamation}</span>! I just can't stop dreaming about it because it's so <span class="filled-word">{adjective1}</span> and makes my <span class="filled-word">{bodypart}</span> <span class="filled-word">{verb}</span>. I like to tell everyone my dreams, especially <span class="filled-word">{person}</span>, because they totally understand how <span class="filled-word">{adjective2}</span> I feel. I hope your dreams are as <span class="filled-word">{adjective3}</span> as mine.`,
        fields: [
            { name: 'noun', label: 'Something to dream about', type: 'text', suggestions: ['flying pizza', 'talking cats', 'chocolate rivers'] },
            { name: 'exclamation', label: 'An exclamation', type: 'text', suggestions: ['Wow!', 'Holy moly!', 'Great Scott!'] },
            { name: 'adjective1', label: 'An adjective', type: 'text', suggestions: ['magical', 'bizarre', 'wonderful'] },
            { name: 'bodypart', label: 'A body part', type: 'text', suggestions: ['toes', 'brain', 'heart'] },
            { name: 'verb', label: 'A verb', type: 'text', suggestions: ['tingle', 'dance', 'glow'] },
            { name: 'person', label: 'A person you know', type: 'text', suggestions: ['my best friend', 'my neighbor', 'my teacher'] },
            { name: 'adjective2', label: 'An emotion adjective', type: 'text', suggestions: ['excited', 'dreamy', 'weird'] },
            { name: 'adjective3', label: 'A positive adjective', type: 'text', suggestions: ['amazing', 'fantastic', 'wild'] }
        ]
    },    

    'silly-story': {
        title: 'Silly Zoo Adventure',
        category: 'funny',
        description: 'A wacky day at the zoo with unexpected animals',
        icon: 'icons/silly-story.png',
        template: `Yesterday, <span class="filled-word">{name}</span> went to the <span class="filled-word">{adjective1}</span> zoo. They saw a <span class="filled-word">{animal}</span> that <span class="filled-word">{verb1}</span> all the way to <span class="filled-word">{place}</span>. It was so <span class="filled-word">{adjective2}</span> that <span class="filled-word">{name}</span> watched it for <span class="filled-word">{number}</span> hours straight! The <span class="filled-word">{animal}</span> even waved goodbye when they left.`,
        fields: [
            { name: 'name', label: "A person's name", type: 'text', suggestions: ['Alex', 'Sam', 'Taylor'] },
            { name: 'adjective1', label: 'An adjective', type: 'text', suggestions: ['sparkly', 'weird', 'gigantic'] },
            { name: 'animal', label: 'An animal', type: 'text', suggestions: ['penguin', 'llama', 'octopus'] },
            { name: 'verb1', label: 'A verb - past tense', type: 'text', suggestions: ['danced', 'jumped', 'wiggled'] },
            { name: 'place', label: 'A place', type: 'text', suggestions: ['Mars', 'the kitchen', 'Tokyo'] },
            { name: 'adjective2', label: 'Another adjective', type: 'text', suggestions: ['hilarious', 'shocking', 'beautiful'] },
            { name: 'number', label: 'A number', type: 'number', suggestions: ['17', '99', '3'] }
        ]
    },
    
    'job-interview': {
        title: 'Awkward Job Interview',
        category: 'funny',
        description: 'The most ridiculous job interview ever',
        icon: 'icons/job-interview.png',
        template: `"So, <span class="filled-word">{yourname}</span>, tell us about yourself." "Well, I'm really good at <span class="filled-word">{skill}</span> and I'm very <span class="filled-word">{adjective1}</span>. I want to be your next <span class="filled-word">{jobtitle}</span>!" The interviewer picked up a <span class="filled-word">{object}</span> and started <span class="filled-word">{verb1}</span> while scratching their <span class="filled-word">{bodypart}</span>. "You're hired!" they said.`,
        fields: [
            { name: 'yourname', label: 'Your name', type: 'text', suggestions: ['Chris', 'Jordan', 'Casey'] },
            { name: 'skill', label: 'A weird skill', type: 'text', suggestions: ['juggling cats', 'eating pizza upside down', 'speed reading backwards'] },
            { name: 'adjective1', label: 'An adjective', type: 'text', suggestions: ['enthusiastic', 'clumsy', 'mysterious'] },
            { name: 'jobtitle', label: 'A silly job title', type: 'text', suggestions: ['Chief Banana Officer', 'Professional Napper', 'Unicorn Trainer'] },
            { name: 'object', label: 'An object', type: 'text', suggestions: ['rubber duck', 'calculator', 'sandwich'] },
            { name: 'verb1', label: 'A verb ending in -ing', type: 'text', suggestions: ['singing', 'hopping', 'thinking'] },
            { name: 'bodypart', label: 'A body part', type: 'text', suggestions: ['elbow', 'nose', 'knee'] }
        ]
    },
    
    'vacation': {
        title: 'Dream Vacation Gone Wrong',
        category: 'adventure',
        description: 'A vacation that takes an unexpected turn',
        icon: 'icons/vacation.png',
        template: `Last summer, I took a trip to <span class="filled-word">{place}</span> by <span class="filled-word">{transport}</span>. The weather was <span class="filled-word">{adjective1}</span> and I ate <span class="filled-word">{food}</span> for breakfast every day. I spent most of my time <span class="filled-word">{activity}</span> with <span class="filled-word">{celebrity}</span>. It made me feel so <span class="filled-word">{feeling}</span> that I never wanted to come home!`,
        fields: [
            { name: 'place', label: 'A strange place', type: 'text', suggestions: ['the Moon', 'a giant shoe', 'underwater'] },
            { name: 'transport', label: 'A mode of transportation', type: 'text', suggestions: ['rocket', 'shopping cart', 'ostrich'] },
            { name: 'adjective1', label: 'An adjective', type: 'text', suggestions: ['purple', 'bouncy', 'freezing'] },
            { name: 'food', label: 'A food', type: 'text', suggestions: ['pickles', 'cotton candy', 'soup'] },
            { name: 'activity', label: 'An activity', type: 'text', suggestions: ['wrestling', 'painting', 'singing'] },
            { name: 'celebrity', label: 'A celebrity', type: 'text', suggestions: ['Beyoncé', 'Spider-Man', 'your math teacher'] },
            { name: 'feeling', label: 'A feeling', type: 'text', suggestions: ['dizzy', 'excited', 'confused'] }
        ]
    },
    
    'superhero': {
        title: 'Superhero Origin Story',
        category: 'adventure',
        description: 'How an ordinary person became extraordinary',
        icon: 'icons/superhero.png',
        template: `Meet <span class="filled-word">{heroname}</span>, the <span class="filled-word">{adjective1}</span> superhero! After being bitten by a radioactive <span class="filled-word">{object}</span>, they gained the power of <span class="filled-word">{power}</span>. Now they protect <span class="filled-word">{city}</span> from the evil villain <span class="filled-word">{villain}</span>. But beware - their one weakness is <span class="filled-word">{weakness}</span>!`,
        fields: [
            { name: 'heroname', label: 'A superhero name', type: 'text', suggestions: ['Captain Awesome', 'The Flying Burrito', 'Dr. Thunder'] },
            { name: 'power', label: 'A superpower', type: 'text', suggestions: ['turning invisible', 'talking to squirrels', 'super speed'] },
            { name: 'object', label: 'An ordinary object', type: 'text', suggestions: ['toothbrush', 'doorknob', 'banana'] },
            { name: 'villain', label: 'A villain name', type: 'text', suggestions: ['Dr. Stinky', 'The Homework Monster', 'Evil Empress'] },
            { name: 'weakness', label: 'A weakness', type: 'text', suggestions: ['loud music', 'the color yellow', 'pizza'] },
            { name: 'city', label: 'A city', type: 'text', suggestions: ['New York', 'Atlantis', 'your hometown'] },
            { name: 'adjective1', label: 'An adjective', type: 'text', suggestions: ['mighty', 'sneaky', 'fabulous'] }
        ]
    },
    
    'love-letter': {
        title: 'Romantic Love Letter',
        category: 'romance',
        description: 'A heartfelt (and hilarious) declaration of love',
        icon: 'icons/love-letter.png',
        template: `My dearest <span class="filled-word">{crushname}</span>, you are more <span class="filled-word">{adjective1}</span> than a <span class="filled-word">{animal}</span> in <span class="filled-word">{season}</span>. When I first saw you <span class="filled-word">{verb1}</span> in the <span class="filled-word">{place}</span>, my heart started <span class="filled-word">{verb2}</span> like a <span class="filled-word">{machine}</span>. Will you <span class="filled-word">{romanticact}</span> with me under the <span class="filled-word">{adjective2}</span> moon? Forever yours, <span class="filled-word">{yourname}</span>`,
        fields: [
            { name: 'crushname', label: "Your crush's name", type: 'text', suggestions: ['Robin', 'Jamie', 'Pat'] },
            { name: 'adjective1', label: 'A romantic adjective', type: 'text', suggestions: ['beautiful', 'dazzling', 'adorable'] },
            { name: 'animal', label: 'A graceful animal', type: 'text', suggestions: ['swan', 'butterfly', 'dolphin'] },
            { name: 'season', label: 'A season', type: 'text', suggestions: ['spring', 'winter', 'summer'] },
            { name: 'verb1', label: 'A verb ending in -ing', type: 'text', suggestions: ['dancing', 'laughing', 'eating'] },
            { name: 'place', label: 'A romantic place', type: 'text', suggestions: ['library', 'coffee shop', 'park'] },
            { name: 'verb2', label: 'A verb ending in -ing', type: 'text', suggestions: ['beating', 'spinning', 'buzzing'] },
            { name: 'machine', label: 'A machine or appliance', type: 'text', suggestions: ['blender', 'washing machine', 'robot'] },
            { name: 'romanticact', label: 'A romantic activity', type: 'text', suggestions: ['share pizza', 'watch movies', 'build sandcastles'] },
            { name: 'adjective2', label: 'Another adjective', type: 'text', suggestions: ['magical', 'twinkling', 'cozy'] },
            { name: 'yourname', label: 'Your name', type: 'text', suggestions: ['Alex', 'Sam', 'Jordan'] }
        ]
    },
    
    'first-date': {
        title: 'Disastrous First Date',
        category: 'romance',
        description: 'When romance goes hilariously wrong',
        icon: 'icons/first-date.png',
        template: `I picked up <span class="filled-word">{datename}</span> in my <span class="filled-word">{adjective1}</span> <span class="filled-word">{vehicle}</span>. We went to a <span class="filled-word">{adjective2}</span> restaurant where I accidentally <span class="filled-word">{verb1}</span> the <span class="filled-word">{food}</span> all over their <span class="filled-word">{clothing}</span>. Then we went <span class="filled-word">{activity}</span>, but I was so nervous I kept <span class="filled-word">{verb2}</span> every <span class="filled-word">{timeperiod}</span>. Surprisingly, they said yes to a second date!`,
        fields: [
            { name: 'datename', label: "Your date's name", type: 'text', suggestions: ['Morgan', 'Riley', 'Avery'] },
            { name: 'adjective1', label: 'An adjective', type: 'text', suggestions: ['rusty', 'shiny', 'tiny'] },
            { name: 'vehicle', label: 'A vehicle', type: 'text', suggestions: ['bicycle', 'spaceship', 'shopping cart'] },
            { name: 'adjective2', label: 'Another adjective', type: 'text', suggestions: ['fancy', 'weird', 'upside-down'] },
            { name: 'verb1', label: 'A clumsy verb - past tense', type: 'text', suggestions: ['spilled', 'dropped', 'threw'] },
            { name: 'food', label: 'A messy food', type: 'text', suggestions: ['spaghetti', 'chocolate cake', 'soup'] },
            { name: 'clothing', label: 'An article of clothing', type: 'text', suggestions: ['shirt', 'hat', 'shoes'] },
            { name: 'activity', label: 'A date activity', type: 'text', suggestions: ['bowling', 'mini golf', 'to the zoo'] },
            { name: 'verb2', label: 'An embarrassing verb', type: 'text', suggestions: ['hiccupping', 'sneezing', 'giggling'] },
            { name: 'timeperiod', label: 'A time period', type: 'text', suggestions: ['5 minutes', 'hour', 'few seconds'] }
        ]
    },
    
    'alien-invasion': {
        title: 'Alien Invasion Report',
        category: 'weird',
        description: 'Breaking news from outer space',
        icon: 'icons/alien-invasion.png',
        template: `BREAKING NEWS: Aliens have landed in <span class="filled-word">{city}</span>! The <span class="filled-word">{adjective1}</span> creatures are <span class="filled-word">{color}</span> and have <span class="filled-word">{number}</span> <span class="filled-word">{bodypart}</span>. They arrived in a giant <span class="filled-word">{object}</span> and immediately started <span class="filled-word">{verb1}</span> all the <span class="filled-word">{pluralnoun}</span>. Their leader, who speaks only in <span class="filled-word">{language}</span>, demands <span class="filled-word">{demand}</span>. The president is reportedly <span class="filled-word">{verb2}</span> in response.`,
        fields: [
            { name: 'city', label: 'A city', type: 'text', suggestions: ['Miami', 'Tokyo', 'your town'] },
            { name: 'adjective1', label: 'An adjective', type: 'text', suggestions: ['slimy', 'fluffy', 'enormous'] },
            { name: 'color', label: 'A weird color', type: 'text', suggestions: ['neon green', 'polka-dotted', 'invisible'] },
            { name: 'number', label: 'A number', type: 'number', suggestions: ['47', '8', '200'] },
            { name: 'bodypart', label: 'A body part - plural', type: 'text', suggestions: ['eyes', 'arms', 'toes'] },
            { name: 'object', label: 'A large object', type: 'text', suggestions: ['coffee cup', 'school bus', 'giant shoe'] },
            { name: 'verb1', label: 'A verb ending in -ing', type: 'text', suggestions: ['stealing', 'tickling', 'organizing'] },
            { name: 'pluralnoun', label: 'A plural noun', type: 'text', suggestions: ['hamburgers', 'socks', 'homework'] },
            { name: 'language', label: 'A silly language', type: 'text', suggestions: ['backwards English', 'dolphin clicks', 'beatboxing'] },
            { name: 'demand', label: 'An absurd demand', type: 'text', suggestions: ['all the world\'s cheese', 'everyone to wear hats', 'free ice cream'] },
            { name: 'verb2', label: 'A verb ending in -ing', type: 'text', suggestions: ['hiding', 'practicing yoga', 'eating cereal'] }
        ]
    },
    
    'cooking-disaster': {
        title: 'Cooking Show Catastrophe',
        category: 'funny',
        description: 'Gordon Ramsay would not approve',
        icon: 'icons/cooking-disaster.png',
        template: `Welcome to "<span class="filled-word">{showname}</span>" with Chef <span class="filled-word">{chefname}</span>! Today we're making <span class="filled-word">{adjective1}</span> <span class="filled-word">{dish}</span>. First, you take <span class="filled-word">{number}</span> cups of <span class="filled-word">{ingredient1}</span> and <span class="filled-word">{verb1}</span> it with a <span class="filled-word">{tool}</span>. Then add <span class="filled-word">{ingredient2}</span> until it turns <span class="filled-word">{color}</span>. Oh no! The kitchen is on fire! Quickly, <span class="filled-word">{verb2}</span> the <span class="filled-word">{ingredient3}</span>!`,
        fields: [
            { name: 'showname', label: 'A cooking show name', type: 'text', suggestions: ['Kitchen Chaos', 'Cooking with Chaos', 'Disaster Chef'] },
            { name: 'chefname', label: "Chef's name", type: 'text', suggestions: ['Chef Butterfingers', 'Chef Smokey', 'Chef Oops'] },
            { name: 'adjective1', label: 'An adjective', type: 'text', suggestions: ['explosive', 'rainbow', 'crunchy'] },
            { name: 'dish', label: 'A type of food', type: 'text', suggestions: ['tacos', 'pizza', 'mystery soup'] },
            { name: 'number', label: 'A number', type: 'number', suggestions: ['17', '3', '99'] },
            { name: 'ingredient1', label: 'A weird ingredient', type: 'text', suggestions: ['glitter', 'rubber bands', 'dog treats'] },
            { name: 'verb1', label: 'A cooking verb', type: 'text', suggestions: ['whisk', 'smash', 'juggle'] },
            { name: 'tool', label: 'A kitchen tool', type: 'text', suggestions: ['spatula', 'hammer', 'magic wand'] },
            { name: 'ingredient2', label: 'Another ingredient', type: 'text', suggestions: ['hot sauce', 'marshmallows', 'confusion'] },
            { name: 'color', label: 'An unappetizing color', type: 'text', suggestions: ['grey', 'neon pink', 'transparent'] },
            { name: 'verb2', label: 'An action verb', type: 'text', suggestions: ['throw', 'hide', 'eat'] },
            { name: 'ingredient3', label: 'A final ingredient', type: 'text', suggestions: ['salt', 'mystery powder', 'hopes and dreams'] }
        ]
    }
},

    // Template management functions (unchanged from v5.1)
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
