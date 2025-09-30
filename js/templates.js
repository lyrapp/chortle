/* Chortle v3.0 - Daily Templates with Themes */

window.ChortleTemplates = {
    // Daily templates array - cycles through sequentially
    dailyTemplates: [
        // New daily templates (14)
        {
            key: 'office-drama',
            title: 'Office Drama',
            theme: 'Office Drama',
            category: 'funny',
            description: 'A typical day at the office with unexpected twists',
            icon: 'icons/office-drama.png',
            propImage: 'office-hat.png',
            template: `I walked into the office and saw my boss <span class="filled-word">{verb1}</span> with a <span class="filled-word">{object}</span>. My coworker <span class="filled-word">{name}</span> was hiding under their desk eating <span class="filled-word">{food}</span>. Suddenly, the printer started <span class="filled-word">{verb2}</span> and everyone began <span class="filled-word">{verb3}</span> toward the exit. It was just another <span class="filled-word">{adjective}</span> Tuesday at the office.`,
            fields: [
                { name: 'verb1', label: 'A silly verb - past tense', type: 'text', suggestions: ['wrestling', 'dancing', 'juggling'] },
                { name: 'object', label: 'An office object', type: 'text', suggestions: ['stapler', 'rubber duck', 'plant'] },
                { name: 'name', label: "A coworker's name", type: 'text', suggestions: ['Sarah', 'Mike', 'Alex'] },
                { name: 'food', label: 'A snack food', type: 'text', suggestions: ['donuts', 'pizza', 'crackers'] },
                { name: 'verb2', label: 'A mechanical verb', type: 'text', suggestions: ['singing', 'beeping', 'smoking'] },
                { name: 'verb3', label: 'A movement verb', type: 'text', suggestions: ['running', 'crawling', 'skipping'] },
                { name: 'adjective', label: 'An adjective', type: 'text', suggestions: ['normal', 'weird', 'chaotic'] }
            ]
        },
        {
            key: 'dating-disaster',
            title: 'Dating Disaster',
            theme: 'Dating Disaster',
            category: 'romance',
            description: 'When modern dating goes hilariously wrong',
            icon: 'icons/dating-disaster.png',
            propImage: 'heart-glasses.png',
            template: `My dating app match said they were <span class="filled-word">{adjective1}</span> and loved <span class="filled-word">{hobby}</span>. When we met, they showed up wearing <span class="filled-word">{clothing}</span> and carrying a <span class="filled-word">{object}</span>. During dinner, they kept <span class="filled-word">{verb1}</span> the <span class="filled-word">{food}</span> and talking about their pet <span class="filled-word">{animal}</span>. By the end of the night, I was ready to <span class="filled-word">{verb2}</span> myself home.`,
            fields: [
                { name: 'adjective1', label: 'A personality trait', type: 'text', suggestions: ['adventurous', 'mysterious', 'quirky'] },
                { name: 'hobby', label: 'A hobby', type: 'text', suggestions: ['collecting spoons', 'extreme knitting', 'yodeling'] },
                { name: 'clothing', label: 'An outfit', type: 'text', suggestions: ['a superhero costume', 'pajamas', 'formal wear'] },
                { name: 'object', label: 'A weird thing to bring', type: 'text', suggestions: ['a lamp', 'garden gnome', 'telescope'] },
                { name: 'verb1', label: 'An eating verb', type: 'text', suggestions: ['sniffing', 'juggling', 'photographing'] },
                { name: 'food', label: 'A restaurant food', type: 'text', suggestions: ['breadsticks', 'salad', 'dessert'] },
                { name: 'animal', label: 'A pet', type: 'text', suggestions: ['ferret', 'iguana', 'hamster'] },
                { name: 'verb2', label: 'A transportation verb', type: 'text', suggestions: ['sprint', 'crawl', 'roll'] }
            ]
        },
        {
            key: 'family-reunion',
            title: 'Family Reunion Chaos',
            theme: 'Family Reunion',
            category: 'funny',
            description: 'Family gatherings always get interesting',
            icon: 'icons/family-reunion.png',
            propImage: 'family-hat.png',
            template: `At our family reunion, my <span class="filled-word">{relative}</span> brought their new hobby of <span class="filled-word">{activity}</span>. Uncle <span class="filled-word">{name}</span> spent the whole time <span class="filled-word">{verb1}</span> in the <span class="filled-word">{place}</span> while eating <span class="filled-word">{food}</span>. The kids were running around <span class="filled-word">{verb2}</span> with <span class="filled-word">{pluralnoun}</span>. By the time we left, everyone was completely <span class="filled-word">{adjective}</span>.`,
            fields: [
                { name: 'relative', label: 'A family member', type: 'text', suggestions: ['cousin', 'aunt', 'grandma'] },
                { name: 'activity', label: 'A hobby', type: 'text', suggestions: ['bird watching', 'magic tricks', 'karaoke'] },
                { name: 'name', label: 'An uncle name', type: 'text', suggestions: ['Bob', 'Steve', 'Tony'] },
                { name: 'verb1', label: 'An activity verb', type: 'text', suggestions: ['hiding', 'napping', 'practicing'] },
                { name: 'place', label: 'A place at a reunion', type: 'text', suggestions: ['garage', 'kitchen', 'backyard'] },
                { name: 'food', label: 'A party food', type: 'text', suggestions: ['potato salad', 'cookies', 'chips'] },
                { name: 'verb2', label: 'A playful verb', type: 'text', suggestions: ['screaming', 'laughing', 'chasing'] },
                { name: 'pluralnoun', label: 'Things kids play with', type: 'text', suggestions: ['balloons', 'toys', 'sticks'] },
                { name: 'adjective', label: 'An exhausted feeling', type: 'text', suggestions: ['tired', 'confused', 'sticky'] }
            ]
        },
        {
            key: 'social-media-fail',
            title: 'Social Media Fail',
            theme: 'Social Media Fail',
            category: 'funny',
            description: 'When your attempt at internet fame backfires',
            icon: 'icons/social-media.png',
            propImage: 'phone-prop.png',
            template: `I thought I'd go viral by posting a video of me <span class="filled-word">{verb1}</span> while wearing <span class="filled-word">{clothing}</span>. Instead, everyone just commented about my <span class="filled-word">{bodypart}</span> looking <span class="filled-word">{adjective1}</span>. My mom shared it with <span class="filled-word">{number}</span> people and now I'm famous for being the person who accidentally <span class="filled-word">{verb2}</span> a <span class="filled-word">{object}</span>. I'm never posting anything <span class="filled-word">{adjective2}</span> again.`,
            fields: [
                { name: 'verb1', label: 'A performance verb', type: 'text', suggestions: ['dancing', 'singing', 'cooking'] },
                { name: 'clothing', label: 'An outfit', type: 'text', suggestions: ['my pajamas', 'a costume', 'workout clothes'] },
                { name: 'bodypart', label: 'A body part', type: 'text', suggestions: ['hair', 'eyebrows', 'elbows'] },
                { name: 'adjective1', label: 'A weird adjective', type: 'text', suggestions: ['purple', 'enormous', 'backwards'] },
                { name: 'number', label: 'A large number', type: 'number', suggestions: ['500', '27', '1000'] },
                { name: 'verb2', label: 'An accident verb', type: 'text', suggestions: ['broke', 'ate', 'lost'] },
                { name: 'object', label: 'Something breakable', type: 'text', suggestions: ['vase', 'phone', 'cake'] },
                { name: 'adjective2', label: 'A cautious adjective', type: 'text', suggestions: ['embarrassing', 'risky', 'public'] }
            ]
        },
        {
            key: 'grocery-shopping',
            title: 'Grocery Store Adventure',
            theme: 'Grocery Shopping',
            category: 'funny',
            description: 'A simple trip to the store becomes an odyssey',
            icon: 'icons/grocery.png',
            propImage: 'shopping-cart.png',
            template: `I went to the store to buy <span class="filled-word">{food1}</span> but ended up spending <span class="filled-word">{number}</span> hours in the <span class="filled-word">{section}</span> section. This <span class="filled-word">{adjective1}</span> person kept <span class="filled-word">{verb1}</span> all the <span class="filled-word">{food2}</span> while their kid was <span class="filled-word">{verb2}</span> in the cart. By the time I got to checkout, I had somehow bought a <span class="filled-word">{object}</span> and completely forgotten the <span class="filled-word">{adjective2}</span> thing I came for.`,
            fields: [
                { name: 'food1', label: 'A simple grocery item', type: 'text', suggestions: ['milk', 'bread', 'bananas'] },
                { name: 'number', label: 'A number of hours', type: 'number', suggestions: ['3', '7', '12'] },
                { name: 'section', label: 'A store section', type: 'text', suggestions: ['cereal', 'frozen foods', 'produce'] },
                { name: 'adjective1', label: 'A personality trait', type: 'text', suggestions: ['enthusiastic', 'confused', 'aggressive'] },
                { name: 'verb1', label: 'A shopping verb', type: 'text', suggestions: ['sniffing', 'squeezing', 'stacking'] },
                { name: 'food2', label: 'A grabbable food', type: 'text', suggestions: ['apples', 'chips', 'cookies'] },
                { name: 'verb2', label: 'A kid activity', type: 'text', suggestions: ['screaming', 'sleeping', 'eating'] },
                { name: 'object', label: 'An impulse buy', type: 'text', suggestions: ['magazine', 'plant', 'gadget'] },
                { name: 'adjective2', label: 'An important adjective', type: 'text', suggestions: ['important', 'essential', 'urgent'] }
            ]
        },
        {
            key: 'gym-disaster',
            title: 'Workout Fail',
            theme: 'Gym Disaster',
            category: 'funny',
            description: 'Fitness goals meet reality',
            icon: 'icons/gym.png',
            propImage: 'headband.png',
            template: `I decided to get fit and joined a <span class="filled-word">{adjective1}</span> gym. On my first day, I tried to <span class="filled-word">{exercise}</span> but ended up <span class="filled-word">{verb1}</span> into a <span class="filled-word">{object}</span>. The trainer, who looked like <span class="filled-word">{celebrity}</span>, just stared at me while I <span class="filled-word">{verb2}</span> on the floor. Now I work out at home with my <span class="filled-word">{pet}</span> because it's less <span class="filled-word">{adjective2}</span>.`,
            fields: [
                { name: 'adjective1', label: 'A gym adjective', type: 'text', suggestions: ['fancy', 'hardcore', 'crowded'] },
                { name: 'exercise', label: 'An exercise', type: 'text', suggestions: ['lift weights', 'use the treadmill', 'do yoga'] },
                { name: 'verb1', label: 'A clumsy verb', type: 'text', suggestions: ['falling', 'crashing', 'sliding'] },
                { name: 'object', label: 'Gym equipment', type: 'text', suggestions: ['exercise bike', 'mirror', 'water fountain'] },
                { name: 'celebrity', label: 'A fit celebrity', type: 'text', suggestions: ['The Rock', 'Wonder Woman', 'Thor'] },
                { name: 'verb2', label: 'An embarrassing verb', type: 'text', suggestions: ['wiggling', 'groaning', 'apologizing'] },
                { name: 'pet', label: 'A pet', type: 'text', suggestions: ['cat', 'dog', 'hamster'] },
                { name: 'adjective2', label: 'A comfort adjective', type: 'text', suggestions: ['embarrassing', 'intimidating', 'expensive'] }
            ]
        },
        {
            key: 'halloween-costume',
            title: 'Halloween Costume Crisis',
            theme: 'Halloween Prep',
            category: 'weird',
            description: 'Last-minute costume shopping gone wrong',
            icon: 'icons/halloween.png',
            propImage: 'pumpkin-hat.png',
            template: `I waited until October <span class="filled-word">{number}</span> to buy my Halloween costume. All that was left was a <span class="filled-word">{adjective1}</span> <span class="filled-word">{animal}</span> outfit and some <span class="filled-word">{object}</span> accessories. I tried to make it work by <span class="filled-word">{verb1}</span> the costume with <span class="filled-word">{material}</span>. When I showed up to the party, everyone thought I was supposed to be <span class="filled-word">{celebrity}</span> having a <span class="filled-word">{adjective2}</span> day.`,
            fields: [
                { name: 'number', label: 'A late October date', type: 'number', suggestions: ['29', '30', '31'] },
                { name: 'adjective1', label: 'A costume adjective', type: 'text', suggestions: ['sparkly', 'torn', 'oversized'] },
                { name: 'animal', label: 'An animal', type: 'text', suggestions: ['cow', 'chicken', 'dinosaur'] },
                { name: 'object', label: 'Costume accessories', type: 'text', suggestions: ['bells', 'feathers', 'glitter'] },
                { name: 'verb1', label: 'A crafting verb', type: 'text', suggestions: ['decorating', 'patching', 'bedazzling'] },
                { name: 'material', label: 'Craft materials', type: 'text', suggestions: ['duct tape', 'aluminum foil', 'newspaper'] },
                { name: 'celebrity', label: 'A famous person', type: 'text', suggestions: ['Elvis', 'Einstein', 'Beyoncé'] },
                { name: 'adjective2', label: 'A bad day adjective', type: 'text', suggestions: ['terrible', 'confusing', 'rough'] }
            ]
        },
        {
            key: 'kitchen-chaos',
            title: 'Cooking Show Disaster',
            theme: 'Kitchen Chaos',
            category: 'funny',
            description: 'Celebrity chef dreams meet kitchen reality',
            icon: 'icons/cooking-disaster.png',
            propImage: 'chef-hat.png',
            template: `I thought I'd impress my friends by making <span class="filled-word">{dish}</span> from scratch. I spent <span class="filled-word">{number}</span> hours <span class="filled-word">{verb1}</span> the <span class="filled-word">{ingredient1}</span> with a <span class="filled-word">{tool}</span>. Somehow I managed to burn the <span class="filled-word">{ingredient2}</span> while the <span class="filled-word">{ingredient3}</span> exploded all over my <span class="filled-word">{clothing}</span>. We ended up ordering <span class="filled-word">{fastfood}</span> and pretending my cooking was <span class="filled-word">{adjective}</span>.`,
            fields: [
                { name: 'dish', label: 'A complicated dish', type: 'text', suggestions: ['soufflé', 'lasagna', 'sushi'] },
                { name: 'number', label: 'A long time', type: 'number', suggestions: ['4', '6', '8'] },
                { name: 'verb1', label: 'A cooking action', type: 'text', suggestions: ['chopping', 'mixing', 'kneading'] },
                { name: 'ingredient1', label: 'A basic ingredient', type: 'text', suggestions: ['onions', 'flour', 'garlic'] },
                { name: 'tool', label: 'A kitchen tool', type: 'text', suggestions: ['whisk', 'spatula', 'rolling pin'] },
                { name: 'ingredient2', label: 'Something burnable', type: 'text', suggestions: ['sauce', 'bread', 'vegetables'] },
                { name: 'ingredient3', label: 'Something messy', type: 'text', suggestions: ['batter', 'oil', 'tomatoes'] },
                { name: 'clothing', label: 'An article of clothing', type: 'text', suggestions: ['shirt', 'apron', 'shoes'] },
                { name: 'fastfood', label: 'Takeout food', type: 'text', suggestions: ['pizza', 'Chinese food', 'burgers'] },
                { name: 'adjective', label: 'A positive adjective', type: 'text', suggestions: ['amazing', 'gourmet', 'perfect'] }
            ]
        },
        {
            key: 'transit-story',
            title: 'Public Transportation Tales',
            theme: 'Transit Story',
            category: 'funny',
            description: 'The wild world of buses and trains',
            icon: 'icons/transit.png',
            propImage: 'bus-hat.png',
            template: `I was riding the <span class="filled-word">{transportation}</span> when this <span class="filled-word">{adjective1}</span> person sat next to me and started <span class="filled-word">{verb1}</span> their <span class="filled-word">{object}</span>. At the next stop, someone got on carrying a <span class="filled-word">{animal}</span> and <span class="filled-word">{number}</span> bags of <span class="filled-word">{food}</span>. The whole time I was trying to <span class="filled-word">{verb2}</span> without looking <span class="filled-word">{adjective2}</span>. I've never been so happy to reach my destination.`,
            fields: [
                { name: 'transportation', label: 'Public transport', type: 'text', suggestions: ['bus', 'subway', 'train'] },
                { name: 'adjective1', label: 'A person adjective', type: 'text', suggestions: ['chatty', 'mysterious', 'loud'] },
                { name: 'verb1', label: 'An odd activity', type: 'text', suggestions: ['grooming', 'talking to', 'polishing'] },
                { name: 'object', label: 'A personal item', type: 'text', suggestions: ['phone', 'lunch', 'shoes'] },
                { name: 'animal', label: 'A portable pet', type: 'text', suggestions: ['cat', 'parrot', 'rabbit'] },
                { name: 'number', label: 'A number of bags', type: 'number', suggestions: ['5', '12', '20'] },
                { name: 'food', label: 'A strong-smelling food', type: 'text', suggestions: ['fish', 'onions', 'garlic'] },
                { name: 'verb2', label: 'A hiding verb', type: 'text', suggestions: ['disappear', 'blend in', 'escape'] },
                { name: 'adjective2', label: 'An awkward adjective', type: 'text', suggestions: ['rude', 'obvious', 'weird'] }
            ]
        },
        {
            key: 'pet-chaos',
            title: 'Pet Shenanigans',
            theme: 'Pet Chaos',
            category: 'funny',
            description: 'When your furry friend has other plans',
            icon: 'icons/pet.png',
            propImage: 'pet-collar.png',
            template: `My <span class="filled-word">{pet}</span> decided to <span class="filled-word">{verb1}</span> all over my <span class="filled-word">{furniture}</span> while I was <span class="filled-word">{activity}</span>. When I came back, they had somehow gotten into the <span class="filled-word">{room}</span> and eaten my entire <span class="filled-word">{food}</span>. Now they're <span class="filled-word">{verb2}</span> around the house like they're <span class="filled-word">{adjective1}</span> and I'm cleaning up <span class="filled-word">{pluralnoun}</span> for the <span class="filled-word">{number}</span>th time today. I love my <span class="filled-word">{adjective2}</span> little monster.`,
            fields: [
                { name: 'pet', label: 'A type of pet', type: 'text', suggestions: ['dog', 'cat', 'ferret'] },
                { name: 'verb1', label: 'A messy pet action', type: 'text', suggestions: ['shedding', 'drooling', 'scratching'] },
                { name: 'furniture', label: 'A piece of furniture', type: 'text', suggestions: ['couch', 'bed', 'chair'] },
                { name: 'activity', label: 'A daily activity', type: 'text', suggestions: ['showering', 'working', 'cooking'] },
                { name: 'room', label: 'A room in the house', type: 'text', suggestions: ['kitchen', 'bathroom', 'closet'] },
                { name: 'food', label: 'Human food', type: 'text', suggestions: ['sandwich', 'cake', 'leftovers'] },
                { name: 'verb2', label: 'A proud pet action', type: 'text', suggestions: ['prancing', 'strutting', 'bouncing'] },
                { name: 'adjective1', label: 'A proud feeling', type: 'text', suggestions: ['innocent', 'proud', 'victorious'] },
                { name: 'pluralnoun', label: 'Things pets mess up', type: 'text', suggestions: ['toys', 'papers', 'crumbs'] },
                { name: 'number', label: 'A frustrating number', type: 'number', suggestions: ['5', '10', '15'] },
                { name: 'adjective2', label: 'A loving adjective', type: 'text', suggestions: ['adorable', 'mischievous', 'crazy'] }
            ]
        },
        {
            key: 'weather-drama',
            title: 'Weather Woes',
            theme: 'Weather Drama',
            category: 'adventure',
            description: 'When Mother Nature has other plans',
            icon: 'icons/weather.png',
            propImage: 'umbrella.png',
            template: `The weather app said it would be <span class="filled-word">{adjective1}</span> so I wore my <span class="filled-word">{clothing}</span> and brought a <span class="filled-word">{object}</span>. Instead, it started <span class="filled-word">{weather}</span> so hard that I had to <span class="filled-word">{verb1}</span> under a <span class="filled-word">{shelter}</span> with <span class="filled-word">{number}</span> strangers. We all ended up <span class="filled-word">{verb2}</span> together while completely <span class="filled-word">{adjective2}</span> and sharing <span class="filled-word">{food}</span>. Sometimes bad weather makes for <span class="filled-word">{adjective3}</span> memories.`,
            fields: [
                { name: 'adjective1', label: 'A weather adjective', type: 'text', suggestions: ['sunny', 'mild', 'perfect'] },
                { name: 'clothing', label: 'Weather-inappropriate clothing', type: 'text', suggestions: ['sandals', 'shorts', 'tank top'] },
                { name: 'object', label: 'A weather accessory', type: 'text', suggestions: ['sunglasses', 'hat', 'water bottle'] },
                { name: 'weather', label: 'Bad weather', type: 'text', suggestions: ['raining', 'snowing', 'hailing'] },
                { name: 'verb1', label: 'A shelter verb', type: 'text', suggestions: ['hide', 'huddle', 'squeeze'] },
                { name: 'shelter', label: 'A place to hide', type: 'text', suggestions: ['bus stop', 'doorway', 'tree'] },
                { name: 'number', label: 'A number of people', type: 'number', suggestions: ['3', '7', '12'] },
                { name: 'verb2', label: 'A group bonding activity', type: 'text', suggestions: ['laughing', 'singing', 'complaining'] },
                { name: 'adjective2', label: 'A wet adjective', type: 'text', suggestions: ['soaked', 'freezing', 'miserable'] },
                { name: 'food', label: 'Emergency snacks', type: 'text', suggestions: ['gum', 'candy', 'crackers'] },
                { name: 'adjective3', label: 'A memory adjective', type: 'text', suggestions: ['unforgettable', 'hilarious', 'bonding'] }
            ]
        },
        {
            key: 'tech-troubles',
            title: 'Tech Support Nightmare',
            theme: 'Tech Troubles',
            category: 'funny',
            description: 'When technology stops cooperating',
            icon: 'icons/tech.png',
            propImage: 'headset.png',
            template: `My <span class="filled-word">{device}</span> started <span class="filled-word">{verb1}</span> every time I tried to <span class="filled-word">{action}</span>. I spent <span class="filled-word">{number}</span> hours on the phone with tech support while they had me <span class="filled-word">{verb2}</span> my <span class="filled-word">{object}</span> and <span class="filled-word">{verb3}</span> random buttons. The solution was to <span class="filled-word">{verb4}</span> it off and on again, but now all my <span class="filled-word">{data}</span> looks <span class="filled-word">{adjective}</span>. Technology is supposed to make life easier.`,
            fields: [
                { name: 'device', label: 'An electronic device', type: 'text', suggestions: ['computer', 'phone', 'tablet'] },
                { name: 'verb1', label: 'A tech malfunction', type: 'text', suggestions: ['freezing', 'beeping', 'flashing'] },
                { name: 'action', label: 'A tech action', type: 'text', suggestions: ['send email', 'open apps', 'print'] },
                { name: 'number', label: 'A frustrating number', type: 'number', suggestions: ['3', '5', '8'] },
                { name: 'verb2', label: 'A tech support verb', type: 'text', suggestions: ['unplug', 'restart', 'update'] },
                { name: 'object', label: 'A tech component', type: 'text', suggestions: ['router', 'cable', 'battery'] },
                { name: 'verb3', label: 'A random action', type: 'text', suggestions: ['press', 'hold', 'click'] },
                { name: 'verb4', label: 'The classic solution', type: 'text', suggestions: ['turn', 'shut', 'power'] },
                { name: 'data', label: 'Digital stuff', type: 'text', suggestions: ['photos', 'documents', 'contacts'] },
                { name: 'adjective', label: 'A corrupted adjective', type: 'text', suggestions: ['backwards', 'purple', 'sideways'] }
            ]
        },
        {
            key: 'weekend-plans',
            title: 'Weekend Adventure',
            theme: 'Weekend Plans',
            category: 'adventure',
            description: 'When your weekend takes an unexpected turn',
            icon: 'icons/weekend.png',
            propImage: 'vacation-hat.png',
            template: `I planned a <span class="filled-word">{adjective1}</span> weekend trip to <span class="filled-word">{place}</span> but ended up <span class="filled-word">{verb1}</span> in my <span class="filled-word">{clothing}</span> at a <span class="filled-word">{business}</span>. The person next to me was <span class="filled-word">{verb2}</span> their <span class="filled-word">{object}</span> while eating <span class="filled-word">{food}</span>. I spent my whole weekend <span class="filled-word">{verb3}</span> and feeling <span class="filled-word">{adjective2}</span>. Next time I'm just staying home with my <span class="filled-word">{comfort}</span>.`,
            fields: [
                { name: 'adjective1', label: 'A weekend adjective', type: 'text', suggestions: ['relaxing', 'adventurous', 'perfect'] },
                { name: 'place', label: 'A vacation destination', type: 'text', suggestions: ['beach', 'mountains', 'city'] },
                { name: 'verb1', label: 'An unexpected activity', type: 'text', suggestions: ['sitting', 'waiting', 'hiding'] },
                { name: 'clothing', label: 'Travel clothes', type: 'text', suggestions: ['pajamas', 'swimsuit', 'hiking boots'] },
                { name: 'business', label: 'An unexpected place', type: 'text', suggestions: ['laundromat', 'DMV', 'hospital'] },
                { name: 'verb2', label: 'A weird action', type: 'text', suggestions: ['knitting', 'organizing', 'training'] },
                { name: 'object', label: 'A personal possession', type: 'text', suggestions: ['collection', 'pet', 'hobby'] },
                { name: 'food', label: 'Weird food to eat there', type: 'text', suggestions: ['birthday cake', 'soup', 'ice cream'] },
                { name: 'verb3', label: 'A weekend-ruining activity', type: 'text', suggestions: ['complaining', 'worrying', 'regretting'] },
                { name: 'adjective2', label: 'A disappointed feeling', type: 'text', suggestions: ['confused', 'frustrated', 'exhausted'] },
                { name: 'comfort', label: 'A comfort item', type: 'text', suggestions: ['couch', 'blanket', 'streaming service'] }
            ]
        },
        {
            key: 'school-stress',
            title: 'Back to School Blues',
            theme: 'School Stress',
            category: 'funny',
            description: 'September reality check hits hard',
            icon: 'icons/school.png',
            propImage: 'graduation-hat.png',
            template: `Going back to school after summer meant dealing with my <span class="filled-word">{adjective1}</span> schedule and <span class="filled-word">{verb1}</span> to class with a <span class="filled-word">{object}</span>. My new teacher looks like <span class="filled-word">{celebrity}</span> and keeps making us <span class="filled-word">{verb2}</span> our <span class="filled-word">{schoolsupply}</span> every <span class="filled-word">{timeperiod}</span>. The cafeteria food tastes like <span class="filled-word">{food}</span> mixed with <span class="filled-word">{weirdingredient}</span>. I can't wait for <span class="filled-word">{adjective2}</span> vacation already.`,
            fields: [
                { name: 'adjective1', label: 'A schedule adjective', type: 'text', suggestions: ['crazy', 'packed', 'impossible'] },
                { name: 'verb1', label: 'A transportation verb', type: 'text', suggestions: ['running', 'biking', 'sprinting'] },
                { name: 'object', label: 'Something to carry', type: 'text', suggestions: ['backpack', 'coffee', 'lunch'] },
                { name: 'celebrity', label: 'A celebrity', type: 'text', suggestions: ['Gordon Ramsay', 'The Hulk', 'Elsa'] },
                { name: 'verb2', label: 'A classroom activity', type: 'text', suggestions: ['organize', 'label', 'decorate'] },
                { name: 'schoolsupply', label: 'School supplies', type: 'text', suggestions: ['notebooks', 'pencils', 'folders'] },
                { name: 'timeperiod', label: 'A time period', type: 'text', suggestions: ['hour', 'day', 'class'] },
                { name: 'food', label: 'A questionable food', type: 'text', suggestions: ['cardboard', 'rubber', 'mystery meat'] },
                { name: 'weirdingredient', label: 'A weird ingredient', type: 'text', suggestions: ['sadness', 'confusion', 'despair'] },
                { name: 'adjective2', label: 'A vacation adjective', type: 'text', suggestions: ['winter', 'spring', 'summer'] }
            ]
        },

        // Keep existing templates with theme field added
        {
            key: 'ghost-story',
            title: 'Ghost Story',
            theme: 'Spooky Tales',
            category: 'weird',
            description: 'A spooky tale of ghostly roommate troubles',
            icon: 'icons/ghost-story.png',
            propImage: 'ghost-hat.png',
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
        }
    ],

    // Current daily template index (will cycle through templates)
    currentDayIndex: 0,

    // Get today's template
    getTodaysTemplate: function() {
        const template = this.dailyTemplates[this.currentDayIndex];
        return {
            key: template.key,
            template: template
        };
    },

    // Get template by key (for backward compatibility)
    getTemplate: function(templateKey) {
        const found = this.dailyTemplates.find(t => t.key === templateKey);
        return found || null;
    },

    // Get all templates (for backward compatibility)
    getAllTemplates: function() {
        const result = {};
        this.dailyTemplates.forEach(template => {
            result[template.key] = template;
        });
        return result;
    },

    // Get templates by category (for backward compatibility)
    getTemplatesByCategory: function(category) {
        if (category === 'all') {
            return this.getAllTemplates();
        }

        const filtered = {};
        this.dailyTemplates.forEach(template => {
            if (template.category === category) {
                filtered[template.key] = template;
            }
        });
        return filtered;
    },

    // Search templates (for backward compatibility)
    searchTemplates: function(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return this.getAllTemplates();
        }

        const term = searchTerm.toLowerCase();
        const filtered = {};

        this.dailyTemplates.forEach(template => {
            if (template.title.toLowerCase().includes(term) ||
                template.description.toLowerCase().includes(term) ||
                template.theme.toLowerCase().includes(term)) {
                filtered[template.key] = template;
            }
        });

        return filtered;
    },

    // Filter templates (for backward compatibility)
    filterTemplates: function(category, searchTerm) {
        let templates = this.getTemplatesByCategory(category);

        if (searchTerm && searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            const filtered = {};

            Object.keys(templates).forEach(key => {
                const template = templates[key];
                if (template.title.toLowerCase().includes(term) ||
                    template.description.toLowerCase().includes(term) ||
                    template.theme.toLowerCase().includes(term)) {
                    filtered[key] = template;
                }
            });

            templates = filtered;
        }

        return templates;
    },

    // Get categories (for backward compatibility)
    getCategories: function() {
        const categories = new Set();
        this.dailyTemplates.forEach(template => {
            categories.add(template.category);
        });
        return Array.from(categories).sort();
    },

    // Validate template (for backward compatibility)
    validateTemplate: function(templateKey) {
        const template = this.getTemplate(templateKey);
        if (!template) return false;

        // Check required properties
        if (!template.title || !template.category || !template.description ||
            !template.template || !Array.isArray(template.fields) || !template.theme) {
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

    // Render template (for backward compatibility)
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
        const categories = this.getCategories();
        const stats = {
            total: this.dailyTemplates.length,
            byCategory: {},
            averageFields: 0,
            totalFields: 0
        };

        // Count by category
        categories.forEach(category => {
            stats.byCategory[category] = this.dailyTemplates
                .filter(t => t.category === category).length;
        });

        // Calculate field statistics
        const fieldCounts = this.dailyTemplates.map(t => t.fields.length);
        stats.totalFields = fieldCounts.reduce((sum, count) => sum + count, 0);
        stats.averageFields = Math.round(stats.totalFields / stats.total);
        stats.minFields = Math.min(...fieldCounts);
        stats.maxFields = Math.max(...fieldCounts);

        return stats;
    },

    // Add new template (for future expansion)
    addTemplate: function(key, template) {
        if (this.validateTemplate(key)) {
            template.key = key;
            this.dailyTemplates.push(template);
            return true;
        }
        return false;
    },

    // Get random template (for backward compatibility)
    getRandomTemplate: function(category = 'all') {
        const templates = this.getTemplatesByCategory(category);
        const keys = Object.keys(templates);

        if (keys.length === 0) return null;

        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return {
            key: randomKey,
            template: templates[randomKey]
        };
    },

    // Advance to next day's template (for testing/manual rotation)
    nextDay: function() {
        this.currentDayIndex = (this.currentDayIndex + 1) % this.dailyTemplates.length;
        return this.getTodaysTemplate();
    }
};

// Export for debugging
if (window.ChortleDebug) {
    window.ChortleDebug.templates = window.ChortleTemplates;
}