export interface SdgAction {
    id: string;
    sdgId: number;
    sdgTitle: string;
    action: string;
    explanation: string;
    color: string;
}

export const SDG_ACTIONS: SdgAction[] = [
    // SDG 1: No Poverty
    {
        id: 'sdg1-1',
        sdgId: 1,
        sdgTitle: 'No Poverty',
        action: 'Donate clothes you no longer wear',
        explanation:
            'A bag of good-quality clothes can directly help someone who needs basics now — and it keeps usable items out of the trash.',
        color: '#E5243B',
    },
    {
        id: 'sdg1-2',
        sdgId: 1,
        sdgTitle: 'No Poverty',
        action: 'Donate €2–€5 to a local food bank (once)',
        explanation:
            'Small donations add up. Food banks can often turn cash donations into more meals than individual shopping can.',
        color: '#E5243B',
    },
    {
        id: 'sdg1-3',
        sdgId: 1,
        sdgTitle: 'No Poverty',
        action: 'Choose Fairtrade coffee or tea',
        explanation:
            'Fairtrade is designed to improve incomes and working conditions for farmers and workers in supply chains.',
        color: '#E5243B',
    },
    {
        id: 'sdg1-4',
        sdgId: 1,
        sdgTitle: 'No Poverty',
        action: 'Learn one fact about poverty today',
        explanation:
            'Understanding causes (like housing, debt, and access to work) helps you support solutions that actually work.',
        color: '#E5243B',
    },
    {
        id: 'sdg1-5',
        sdgId: 1,
        sdgTitle: 'No Poverty',
        action: 'Support microloans (e.g., donate to a microfinance charity)',
        explanation:
            'Microloans and micro-grants can help people start or grow small businesses when they lack access to regular banking.',
        color: '#E5243B',
    },

    // SDG 2: Zero Hunger
    {
        id: 'sdg2-1',
        sdgId: 2,
        sdgTitle: 'Zero Hunger',
        action: 'Buy “ugly” fruits or veggies',
        explanation:
            'Buying imperfect produce helps reduce food waste earlier in the supply chain — perfectly good food still gets eaten.',
        color: '#DDA63A',
    },
    {
        id: 'sdg2-2',
        sdgId: 2,
        sdgTitle: 'Zero Hunger',
        action: 'Use up leftovers today',
        explanation:
            'Leftovers saved = food waste avoided. One saved portion can mean one less meal thrown away — and less money wasted.',
        color: '#DDA63A',
    },
    {
        id: 'sdg2-3',
        sdgId: 2,
        sdgTitle: 'Zero Hunger',
        action: 'Buy one item from a local farmer or market',
        explanation:
            'Local food can mean fewer transport steps and more money staying in your community.',
        color: '#DDA63A',
    },
    {
        id: 'sdg2-4',
        sdgId: 2,
        sdgTitle: 'Zero Hunger',
        action: 'Donate 1–3 shelf-stable items',
        explanation:
            'A few basics (like rice, beans, pasta, or canned veggies) can become multiple meals for someone else.',
        color: '#DDA63A',
    },
    {
        id: 'sdg2-5',
        sdgId: 2,
        sdgTitle: 'Zero Hunger',
        action: 'Grow herbs on your windowsill',
        explanation:
            'Growing even one herb makes food more affordable over time and helps you value how food is produced.',
        color: '#DDA63A',
    },

    // SDG 3: Good Health and Well-being
    {
        id: 'sdg3-1',
        sdgId: 3,
        sdgTitle: 'Good Health and Well-being',
        action: 'Take a 30-minute walk',
        explanation:
            '30 minutes of movement supports heart health, mood, and stress levels — and it’s free.',
        color: '#4C9F38',
    },
    {
        id: 'sdg3-2',
        sdgId: 3,
        sdgTitle: 'Good Health and Well-being',
        action: 'Do 5 minutes of slow breathing',
        explanation:
            'A short breathing break can lower stress in the moment and help you reset your focus.',
        color: '#4C9F38',
    },
    {
        id: 'sdg3-3',
        sdgId: 3,
        sdgTitle: 'Good Health and Well-being',
        action: 'Drink an extra glass of water',
        explanation:
            'Hydration supports energy, concentration, and physical performance — especially if you tend to forget to drink.',
        color: '#4C9F38',
    },
    {
        id: 'sdg3-4',
        sdgId: 3,
        sdgTitle: 'Good Health and Well-being',
        action: 'Set a bedtime alarm (aim for 7–9 hours)',
        explanation:
            'Sleep supports immune function, mood, and learning. A bedtime reminder is a simple way to protect it.',
        color: '#4C9F38',
    },
    {
        id: 'sdg3-5',
        sdgId: 3,
        sdgTitle: 'Good Health and Well-being',
        action: 'Wash your hands at key moments',
        explanation:
            'Handwashing is one of the simplest ways to reduce the spread of infections (especially before eating and after the toilet).',
        color: '#4C9F38',
    },

    // SDG 4: Quality Education
    {
        id: 'sdg4-1',
        sdgId: 4,
        sdgTitle: 'Quality Education',
        action: "Donate a book you've finished",
        explanation:
            'A book you no longer use can become someone else’s learning tool — especially via local libraries, schools, or swap shelves.',
        color: '#C5192D',
    },
    {
        id: 'sdg4-2',
        sdgId: 4,
        sdgTitle: 'Quality Education',
        action: 'Help someone with a skill for 10 minutes',
        explanation:
            'Explaining one small skill (CV tips, math, language, coding, cooking) can boost someone’s confidence and options.',
        color: '#C5192D',
    },
    {
        id: 'sdg4-3',
        sdgId: 4,
        sdgTitle: 'Quality Education',
        action: 'Learn one new thing today',
        explanation:
            'Even 10 minutes of learning (a short video, article, or lesson) builds skills over time.',
        color: '#C5192D',
    },
    {
        id: 'sdg4-4',
        sdgId: 4,
        sdgTitle: 'Quality Education',
        action: 'Support a classroom project (share or donate)',
        explanation:
            'Schools and teachers often use small donations or shared resources to improve lessons and materials.',
        color: '#C5192D',
    },
    {
        id: 'sdg4-5',
        sdgId: 4,
        sdgTitle: 'Quality Education',
        action: 'Read with a child (or record a story)',
        explanation:
            'Reading time supports language development, attention, and curiosity — and it builds connection.',
        color: '#C5192D',
    },

    // SDG 5: Gender Equality
    {
        id: 'sdg5-1',
        sdgId: 5,
        sdgTitle: 'Gender Equality',
        action: 'Buy from a women-owned business',
        explanation:
            'Spending money is a vote. Supporting women-owned businesses helps economic equality grow.',
        color: '#FF3A21',
    },
    {
        id: 'sdg5-2',
        sdgId: 5,
        sdgTitle: 'Gender Equality',
        action: 'Call out a biased joke or comment',
        explanation:
            'One calm “That’s not okay” can shift norms — especially when it happens in the moment.',
        color: '#FF3A21',
    },
    {
        id: 'sdg5-3',
        sdgId: 5,
        sdgTitle: 'Gender Equality',
        action: 'Split chores fairly at home',
        explanation:
            'Fair division of unpaid work is part of equality — and it reduces invisible workload for one person.',
        color: '#FF3A21',
    },
    {
        id: 'sdg5-4',
        sdgId: 5,
        sdgTitle: 'Gender Equality',
        action: 'Share a resource about equal pay',
        explanation:
            'Sharing one reliable resource helps awareness — and normalizes conversations about fairness at work.',
        color: '#FF3A21',
    },
    {
        id: 'sdg5-5',
        sdgId: 5,
        sdgTitle: 'Gender Equality',
        action: 'Listen and amplify a woman’s perspective',
        explanation:
            'Making space for different experiences builds empathy — and improves decisions in teams, schools, and communities.',
        color: '#FF3A21',
    },

    // SDG 6: Clean Water and Sanitation
    {
        id: 'sdg6-1',
        sdgId: 6,
        sdgTitle: 'Clean Water and Sanitation',
        action: 'Take a shower 2 minutes shorter',
        explanation:
            'An average shower flow can be around 11 liters per minute in Europe. Cutting 2 minutes can save about 22 liters.',
        color: '#26BDE2',
    },
    {
        id: 'sdg6-2',
        sdgId: 6,
        sdgTitle: 'Clean Water and Sanitation',
        action: 'Fix (or report) a leaky tap',
        explanation:
            'A tap dripping about once per second can waste roughly 5 liters a day — over 1,800 liters a year.',
        color: '#26BDE2',
    },
    {
        id: 'sdg6-3',
        sdgId: 6,
        sdgTitle: 'Clean Water and Sanitation',
        action: 'Turn off the tap while brushing',
        explanation:
            'Taps can run around 6 liters per minute. Turning it off while brushing can save dozens of liters over a week.',
        color: '#26BDE2',
    },
    {
        id: 'sdg6-4',
        sdgId: 6,
        sdgTitle: 'Clean Water and Sanitation',
        action: 'Use eco-friendly detergent (or use less)',
        explanation:
            'Using fewer harsh chemicals helps reduce pollution that ends up in rivers and oceans.',
        color: '#26BDE2',
    },
    {
        id: 'sdg6-5',
        sdgId: 6,
        sdgTitle: 'Clean Water and Sanitation',
        action: 'Don’t flush medicines or chemicals',
        explanation:
            'Medicines and paint can pollute water systems. Bring leftovers to a collection point instead.',
        color: '#26BDE2',
    },

    // SDG 7: Affordable and Clean Energy
    {
        id: 'sdg7-1',
        sdgId: 7,
        sdgTitle: 'Affordable and Clean Energy',
        action: 'Unplug one device you’re not using',
        explanation:
            'Standby power adds up. Unplugging even one charger or device reduces “always-on” electricity use.',
        color: '#FCC30B',
    },
    {
        id: 'sdg7-2',
        sdgId: 7,
        sdgTitle: 'Affordable and Clean Energy',
        action: 'Replace one bulb with an LED (when possible)',
        explanation:
            'LEDs use at least ~75% less energy than incandescent bulbs and last much longer.',
        color: '#FCC30B',
    },
    {
        id: 'sdg7-3',
        sdgId: 7,
        sdgTitle: 'Affordable and Clean Energy',
        action: 'Wash clothes at a lower temperature',
        explanation:
            'Heating water is a big part of laundry energy. Lower-temp washes reduce that energy demand.',
        color: '#FCC30B',
    },
    {
        id: 'sdg7-4',
        sdgId: 7,
        sdgTitle: 'Affordable and Clean Energy',
        action: 'Air-dry one load of laundry',
        explanation:
            'Skipping the dryer saves energy immediately — plus air-drying can help clothes last longer.',
        color: '#FCC30B',
    },
    {
        id: 'sdg7-5',
        sdgId: 7,
        sdgTitle: 'Affordable and Clean Energy',
        action: 'Turn off lights when leaving a room',
        explanation:
            'A tiny habit, repeated daily, reduces wasted electricity without changing your lifestyle.',
        color: '#FCC30B',
    },

    // SDG 8: Decent Work and Economic Growth
    {
        id: 'sdg8-1',
        sdgId: 8,
        sdgTitle: 'Decent Work and Economic Growth',
        action: 'Buy one Fairtrade product',
        explanation:
            'Fairtrade aims to improve wages and working conditions in supply chains.',
        color: '#A21942',
    },
    {
        id: 'sdg8-2',
        sdgId: 8,
        sdgTitle: 'Decent Work and Economic Growth',
        action: 'Support a small local business',
        explanation:
            'Local businesses keep money circulating locally and help support jobs in your area.',
        color: '#A21942',
    },
    {
        id: 'sdg8-3',
        sdgId: 8,
        sdgTitle: 'Decent Work and Economic Growth',
        action: 'Choose one “better” brand today (5-minute check)',
        explanation:
            'A quick check (returns policy, labor standards page, certifications) helps you buy more ethically.',
        color: '#A21942',
    },
    {
        id: 'sdg8-4',
        sdgId: 8,
        sdgTitle: 'Decent Work and Economic Growth',
        action: 'Send one helpful career tip to someone',
        explanation:
            'One introduction, template, or piece of advice can lower barriers for someone entering the workforce.',
        color: '#A21942',
    },
    {
        id: 'sdg8-5',
        sdgId: 8,
        sdgTitle: 'Decent Work and Economic Growth',
        action: 'Check if your bank/investments have sustainable options',
        explanation:
            'Where money goes matters. Looking for funds that avoid harm (and support good) is a practical first step.',
        color: '#A21942',
    },

    // SDG 9: Industry, Innovation and Infrastructure
    {
        id: 'sdg9-1',
        sdgId: 9,
        sdgTitle: 'Industry, Innovation and Infrastructure',
        action: 'Use public transport (or carpool) for one trip',
        explanation:
            'Fewer cars on the road reduces congestion and emissions — and supports public infrastructure.',
        color: '#FD6925',
    },
    {
        id: 'sdg9-2',
        sdgId: 9,
        sdgTitle: 'Industry, Innovation and Infrastructure',
        action: 'Collect old electronics for proper recycling',
        explanation:
            'E-waste contains valuable metals. Recycling helps recover materials and reduces toxic waste.',
        color: '#FD6925',
    },
    {
        id: 'sdg9-3',
        sdgId: 9,
        sdgTitle: 'Industry, Innovation and Infrastructure',
        action: 'Support a local innovator (share their work)',
        explanation:
            'Sharing a local startup or maker helps them reach users, funding, and partnerships.',
        color: '#FD6925',
    },
    {
        id: 'sdg9-4',
        sdgId: 9,
        sdgTitle: 'Industry, Innovation and Infrastructure',
        action: 'Share resources instead of buying new',
        explanation:
            'Borrowing or sharing tools is efficient infrastructure in action: fewer items produced, same usefulness.',
        color: '#FD6925',
    },
    {
        id: 'sdg9-5',
        sdgId: 9,
        sdgTitle: 'Industry, Innovation and Infrastructure',
        action: 'Report one infrastructure issue (if you notice it)',
        explanation:
            'Reporting broken lights, potholes, or leaks helps keep your city safer and prevents bigger damage.',
        color: '#FD6925',
    },

    // SDG 10: Reduced Inequality
    {
        id: 'sdg10-1',
        sdgId: 10,
        sdgTitle: 'Reduced Inequality',
        action: 'Learn about a culture you don’t know well',
        explanation:
            'Curiosity reduces stereotypes. One short story, article, or video can increase empathy.',
        color: '#DD1367',
    },
    {
        id: 'sdg10-2',
        sdgId: 10,
        sdgTitle: 'Reduced Inequality',
        action: 'Speak up against bullying (even once)',
        explanation:
            'A small intervention can stop harm and show support to the person targeted.',
        color: '#DD1367',
    },
    {
        id: 'sdg10-3',
        sdgId: 10,
        sdgTitle: 'Reduced Inequality',
        action: 'Donate an item to a refugee support organization',
        explanation:
            'Practical donations (winter items, hygiene products) can meet immediate needs for people rebuilding their lives.',
        color: '#DD1367',
    },
    {
        id: 'sdg10-4',
        sdgId: 10,
        sdgTitle: 'Reduced Inequality',
        action: 'Buy from a diverse creator',
        explanation:
            'Supporting underrepresented creators helps reduce opportunity gaps — directly through income and visibility.',
        color: '#DD1367',
    },
    {
        id: 'sdg10-5',
        sdgId: 10,
        sdgTitle: 'Reduced Inequality',
        action: 'Challenge one bias you notice in yourself',
        explanation:
            'Noticing bias is progress. Small mindset shifts influence how we treat people in daily life.',
        color: '#DD1367',
    },

    // SDG 11: Sustainable Cities and Communities
    {
        id: 'sdg11-1',
        sdgId: 11,
        sdgTitle: 'Sustainable Cities and Communities',
        action: 'Pick up 3 pieces of litter',
        explanation:
            'Clean streets and parks improve community health and reduce plastic entering waterways.',
        color: '#FD9D24',
    },
    {
        id: 'sdg11-2',
        sdgId: 11,
        sdgTitle: 'Sustainable Cities and Communities',
        action: 'Use a reusable cup or bottle',
        explanation:
            'One reusable swap prevents a single-use item today — and normalizes low-waste habits.',
        color: '#FD9D24',
    },
    {
        id: 'sdg11-3',
        sdgId: 11,
        sdgTitle: 'Sustainable Cities and Communities',
        action: 'Support a local green space (share or volunteer)',
        explanation:
            'Parks cool cities, support biodiversity, and improve mental health — community support keeps them thriving.',
        color: '#FD9D24',
    },
    {
        id: 'sdg11-4',
        sdgId: 11,
        sdgTitle: 'Sustainable Cities and Communities',
        action: 'Walk or cycle for a short trip',
        explanation:
            'Replacing one short car trip reduces emissions and improves local air quality.',
        color: '#FD9D24',
    },
    {
        id: 'sdg11-5',
        sdgId: 11,
        sdgTitle: 'Sustainable Cities and Communities',
        action: 'Join a neighborhood group (or say hi to a neighbor)',
        explanation:
            'Social connection is part of a resilient community — small local networks help in emergencies too.',
        color: '#FD9D24',
    },

    // SDG 12: Responsible Consumption and Production
    {
        id: 'sdg12-1',
        sdgId: 12,
        sdgTitle: 'Responsible Consumption and Production',
        action: 'Say no to one single-use plastic item',
        explanation:
            'Skipping one disposable item reduces waste today — and pushes demand toward reusable options.',
        color: '#BF8B2E',
    },
    {
        id: 'sdg12-2',
        sdgId: 12,
        sdgTitle: 'Responsible Consumption and Production',
        action: 'Buy one thing second-hand',
        explanation:
            'Second-hand keeps products in use longer and reduces demand for new production.',
        color: '#BF8B2E',
    },
    {
        id: 'sdg12-3',
        sdgId: 12,
        sdgTitle: 'Responsible Consumption and Production',
        action: 'Compost food scraps (or start a small bin)',
        explanation:
            'Composting turns food waste into nutrients instead of methane-producing landfill waste.',
        color: '#BF8B2E',
    },
    {
        id: 'sdg12-4',
        sdgId: 12,
        sdgTitle: 'Responsible Consumption and Production',
        action: 'Avoid fast fashion for one purchase',
        explanation:
            'Buying fewer, better items reduces waste and the pollution linked to textile production.',
        color: '#BF8B2E',
    },
    {
        id: 'sdg12-5',
        sdgId: 12,
        sdgTitle: 'Responsible Consumption and Production',
        action: 'Borrow or rent instead of buying',
        explanation:
            'Sharing items (tools, party outfits, special gear) saves money and reduces production waste.',
        color: '#BF8B2E',
    },

    // SDG 13: Climate Action
    {
        id: 'sdg13-1',
        sdgId: 13,
        sdgTitle: 'Climate Action',
        action: 'Go meat-free for one day',
        explanation:
            'Eating plant-based for a day is a practical way to reduce your diet-related footprint.',
        color: '#3F7E44',
    },
    {
        id: 'sdg13-2',
        sdgId: 13,
        sdgTitle: 'Climate Action',
        action: 'Wash clothes at 30°C (or cold)',
        explanation:
            'Lower temperatures reduce energy use because heating water is a major part of laundry energy.',
        color: '#3F7E44',
    },
    {
        id: 'sdg13-3',
        sdgId: 13,
        sdgTitle: 'Climate Action',
        action: 'Plant something (a tree, shrub, or balcony plant)',
        explanation:
            'Plants store carbon and support biodiversity. Even a small planted area adds up over time.',
        color: '#3F7E44',
    },
    {
        id: 'sdg13-4',
        sdgId: 13,
        sdgTitle: 'Climate Action',
        action: 'Check if you can switch to green electricity',
        explanation:
            'Choosing renewable electricity supports cleaner grids — and is often a simple contract change.',
        color: '#3F7E44',
    },
    {
        id: 'sdg13-5',
        sdgId: 13,
        sdgTitle: 'Climate Action',
        action: 'Share one climate-friendly tip with someone',
        explanation:
            'Social proof matters. One practical tip can spread habits faster than facts alone.',
        color: '#3F7E44',
    },

    // SDG 14: Life Below Water
    {
        id: 'sdg14-1',
        sdgId: 14,
        sdgTitle: 'Life Below Water',
        action: 'Avoid products with microbeads',
        explanation:
            'Microplastics can flow into waterways and persist for a long time, harming marine life.',
        color: '#0A97D9',
    },
    {
        id: 'sdg14-2',
        sdgId: 14,
        sdgTitle: 'Life Below Water',
        action: 'Pick up litter near water (or any street litter)',
        explanation:
            'Less litter on land means less plastic that can end up in rivers and oceans.',
        color: '#0A97D9',
    },
    {
        id: 'sdg14-3',
        sdgId: 14,
        sdgTitle: 'Life Below Water',
        action: 'Choose a more sustainable seafood option (or skip seafood today)',
        explanation:
            'Overfishing harms ecosystems. Choosing certified options or skipping seafood reduces pressure on stocks.',
        color: '#0A97D9',
    },
    {
        id: 'sdg14-4',
        sdgId: 14,
        sdgTitle: 'Life Below Water',
        action: 'Say no to plastic bags',
        explanation:
            'Plastic bags can enter oceans and are dangerous for marine animals that mistake them for food.',
        color: '#0A97D9',
    },
    {
        id: 'sdg14-5',
        sdgId: 14,
        sdgTitle: 'Life Below Water',
        action: 'Support marine conservation (share or donate)',
        explanation:
            'Even small support helps fund beach cleanups, wildlife protection, and conservation projects.',
        color: '#0A97D9',
    },

    // SDG 15: Life on Land
    {
        id: 'sdg15-1',
        sdgId: 15,
        sdgTitle: 'Life on Land',
        action: 'Plant a native seed or pollinator-friendly plant',
        explanation:
            'Native plants support local insects and birds — small biodiversity wins start at home.',
        color: '#56C02B',
    },
    {
        id: 'sdg15-2',
        sdgId: 15,
        sdgTitle: 'Life on Land',
        action: 'Skip pesticides today',
        explanation:
            'Avoiding pesticides helps protect bees and other pollinators that ecosystems depend on.',
        color: '#56C02B',
    },
    {
        id: 'sdg15-3',
        sdgId: 15,
        sdgTitle: 'Life on Land',
        action: 'Choose recycled paper (one product)',
        explanation:
            'Recycled paper reduces demand for virgin wood pulp and can lower pressure on forests.',
        color: '#56C02B',
    },
    {
        id: 'sdg15-4',
        sdgId: 15,
        sdgTitle: 'Life on Land',
        action: 'Support reforestation (share or donate)',
        explanation:
            'Reforestation helps restore habitats and can store carbon over time.',
        color: '#56C02B',
    },
    {
        id: 'sdg15-5',
        sdgId: 15,
        sdgTitle: 'Life on Land',
        action: 'Be careful with fire and litter in nature',
        explanation:
            'Small actions (no glass, no cigarette butts, no open fire in risk areas) help prevent wildfires and habitat damage.',
        color: '#56C02B',
    },

    // SDG 16: Peace, Justice and Strong Institutions
    {
        id: 'sdg16-1',
        sdgId: 16,
        sdgTitle: 'Peace, Justice and Strong Institutions',
        action: 'Report an online scam or suspicious message',
        explanation:
            'Reporting scams helps protect others and makes online spaces safer for everyone.',
        color: '#00689D',
    },
    {
        id: 'sdg16-2',
        sdgId: 16,
        sdgTitle: 'Peace, Justice and Strong Institutions',
        action: 'Learn one basic human right',
        explanation:
            'Knowing your rights helps you protect yourself and support others when something is unfair.',
        color: '#00689D',
    },
    {
        id: 'sdg16-3',
        sdgId: 16,
        sdgTitle: 'Peace, Justice and Strong Institutions',
        action: 'Check how local decisions are made where you live',
        explanation:
            'Understanding how your municipality works makes it easier to participate and hold leaders accountable.',
        color: '#00689D',
    },
    {
        id: 'sdg16-4',
        sdgId: 16,
        sdgTitle: 'Peace, Justice and Strong Institutions',
        action: 'Ask for clarity when something feels unclear',
        explanation:
            'Transparency starts small: asking “Can you explain how this decision was made?” encourages accountability.',
        color: '#00689D',
    },
    {
        id: 'sdg16-5',
        sdgId: 16,
        sdgTitle: 'Peace, Justice and Strong Institutions',
        action: 'Practice calm conflict resolution',
        explanation:
            'Using “I” statements and listening first can reduce escalation and improve trust in your relationships.',
        color: '#00689D',
    },

    // SDG 17: Partnerships for the Goals
    {
        id: 'sdg17-1',
        sdgId: 17,
        sdgTitle: 'Partnerships for the Goals',
        action: 'Share this app with one friend',
        explanation:
            'More people taking small actions daily creates momentum — and makes impact feel less lonely.',
        color: '#19486A',
    },
    {
        id: 'sdg17-2',
        sdgId: 17,
        sdgTitle: 'Partnerships for the Goals',
        action: 'Collaborate on a tiny project (even a cleanup)',
        explanation:
            'Doing it together makes it easier to start — and increases follow-through.',
        color: '#19486A',
    },
    {
        id: 'sdg17-3',
        sdgId: 17,
        sdgTitle: 'Partnerships for the Goals',
        action: 'Support a global NGO (share or donate)',
        explanation:
            'Global challenges need teamwork. Small support can fund real work on health, education, and climate.',
        color: '#19486A',
    },
    {
        id: 'sdg17-4',
        sdgId: 17,
        sdgTitle: 'Partnerships for the Goals',
        action: 'Share one thing that worked for you',
        explanation:
            'Practical tips spread faster than big theories. Your “how” can help someone else start.',
        color: '#19486A',
    },
    {
        id: 'sdg17-5',
        sdgId: 17,
        sdgTitle: 'Partnerships for the Goals',
        action: 'Join one local community moment (online or offline)',
        explanation:
            'Local action is where partnerships begin — one conversation can lead to real collaboration.',
        color: '#19486A',
    },
];
