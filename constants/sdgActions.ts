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
    { id: 'sdg1-1', sdgId: 1, sdgTitle: 'No Poverty', action: 'Donate unused clothes', explanation: 'Giving your unused clothes to local charities helps those in need and reduces waste.', color: '#E5243B' },
    { id: 'sdg1-2', sdgId: 1, sdgTitle: 'No Poverty', action: 'Support a local food bank', explanation: 'Food banks provide essential nutrition to families struggling with poverty.', color: '#E5243B' },
    { id: 'sdg1-3', sdgId: 1, sdgTitle: 'No Poverty', action: 'Buy fair-trade coffee', explanation: 'Fair trade ensures that small-scale farmers get a fair price for their products.', color: '#E5243B' },
    { id: 'sdg1-4', sdgId: 1, sdgTitle: 'No Poverty', action: 'Educate yourself on poverty', explanation: 'Understanding the root causes of poverty is the first step toward effective action.', color: '#E5243B' },
    { id: 'sdg1-5', sdgId: 1, sdgTitle: 'No Poverty', action: 'Support microfinance', explanation: 'Small loans can help entrepreneurs in developing countries start businesses.', color: '#E5243B' },

    // SDG 2: Zero Hunger
    { id: 'sdg2-1', sdgId: 2, sdgTitle: 'Zero Hunger', action: 'Buy "ugly" produce', explanation: 'Buying imperfect-looking fruits and vegetables reduces food waste in the supply chain.', color: '#DDA63A' },
    { id: 'sdg2-2', sdgId: 2, sdgTitle: 'Zero Hunger', action: 'Stop wasting food', explanation: 'Plan your meals to reduce the amount of food you throw away.', color: '#DDA63A' },
    { id: 'sdg2-3', sdgId: 2, sdgTitle: 'Zero Hunger', action: 'Support local farmers', explanation: 'Buying local reduces the carbon footprint of your food and supports the community.', color: '#DDA63A' },
    { id: 'sdg2-4', sdgId: 2, sdgTitle: 'Zero Hunger', action: 'Donate non-perishables', explanation: 'Extra cans or pasta can make a big difference for someone in need.', color: '#DDA63A' },
    { id: 'sdg2-5', sdgId: 2, sdgTitle: 'Zero Hunger', action: 'Grow your own herbs', explanation: 'Starting a small garden helps you appreciate how food is produced.', color: '#DDA63A' },

    // SDG 3: Good Health and Well-being
    { id: 'sdg3-1', sdgId: 3, sdgTitle: 'Good Health and Well-being', action: 'Take a 30-minute walk', explanation: 'Regular physical activity is crucial for mental and physical health.', color: '#4C9F38' },
    { id: 'sdg3-2', sdgId: 3, sdgTitle: 'Good Health and Well-being', action: 'Meditate for 5 minutes', explanation: 'Mental health is just as important as physical health.', color: '#4C9F38' },
    { id: 'sdg3-3', sdgId: 3, sdgTitle: 'Good Health and Well-being', action: 'Drink enough water', explanation: 'Staying hydrated is essential for your body to function properly.', color: '#4C9F38' },
    { id: 'sdg3-4', sdgId: 3, sdgTitle: 'Good Health and Well-being', action: 'Get 8 hours of sleep', explanation: 'Rest is vital for your immune system and overall cognitive function.', color: '#4C9F38' },
    { id: 'sdg3-5', sdgId: 3, sdgTitle: 'Good Health and Well-being', action: 'Wash your hands regularly', explanation: 'Simple hygiene is the most effective way to prevent the spread of diseases.', color: '#4C9F38' },

    // SDG 4: Quality Education
    { id: 'sdg4-1', sdgId: 4, sdgTitle: 'Quality Education', action: 'Donate books you\'ve read', explanation: 'Sharing knowledge helps others learn and grow.', color: '#C5192D' },
    { id: 'sdg4-2', sdgId: 4, sdgTitle: 'Quality Education', action: 'Mentor someone', explanation: 'Teaching a skill to someone else empowers them for the future.', color: '#C5192D' },
    { id: 'sdg4-3', sdgId: 4, sdgTitle: 'Quality Education', action: 'Learn a new skill', explanation: 'Lifelong learning keeps your mind sharp and heart open.', color: '#C5192D' },
    { id: 'sdg4-4', sdgId: 4, sdgTitle: 'Quality Education', action: 'Support a school project', explanation: 'Donating to educational initiatives helps provide quality resources.', color: '#C5192D' },
    { id: 'sdg4-5', sdgId: 4, sdgTitle: 'Quality Education', action: 'Read to a child', explanation: 'Early literacy is a strong predictor of future success.', color: '#C5192D' },

    // SDG 5: Gender Equality
    { id: 'sdg5-1', sdgId: 5, sdgTitle: 'Gender Equality', action: 'Support a female-led business', explanation: 'Empowering women economically is a key step toward global equality.', color: '#FF3A21' },
    { id: 'sdg5-2', sdgId: 5, sdgTitle: 'Gender Equality', action: 'Call out gender bias', explanation: 'Challenging stereotypes helps create a more inclusive culture.', color: '#FF3A21' },
    { id: 'sdg5-3', sdgId: 5, sdgTitle: 'Gender Equality', action: 'Split chores equally', explanation: 'Equality starts at home with shared responsibilities.', color: '#FF3A21' },
    { id: 'sdg5-4', sdgId: 5, sdgTitle: 'Gender Equality', action: 'Champion equal pay', explanation: 'Advocate for fairness in the workplace for everyone.', color: '#FF3A21' },
    { id: 'sdg5-5', sdgId: 5, sdgTitle: 'Gender Equality', action: 'Listen to women\'s stories', explanation: 'Understanding diverse perspectives is key to empathy and change.', color: '#FF3A21' },

    // SDG 6: Clean Water and Sanitation
    { id: 'sdg6-1', sdgId: 6, sdgTitle: 'Clean Water and Sanitation', action: 'Shorten your shower by 2 mins', explanation: 'Small reductions in water usage can save thousands of liters over time.', color: '#26BDE2' },
    { id: 'sdg6-2', sdgId: 6, sdgTitle: 'Clean Water and Sanitation', action: 'Fix a leaky tap', explanation: 'A dripping faucet can waste a huge amount of water every day.', color: '#26BDE2' },
    { id: 'sdg6-3', sdgId: 6, sdgTitle: 'Clean Water and Sanitation', action: 'Turn off tap while brushing', explanation: 'You can save up to 6 liters of water per minute this way.', color: '#26BDE2' },
    { id: 'sdg6-4', sdgId: 6, sdgTitle: 'Clean Water and Sanitation', action: 'Use eco-friendly detergents', explanation: 'Synthetic chemicals in soap can harm aquatic ecosystems.', color: '#26BDE2' },
    { id: 'sdg6-5', sdgId: 6, sdgTitle: 'Clean Water and Sanitation', action: 'Don\'t flush toxins', explanation: 'Avoid flushing medicines and paint down the drain.', color: '#26BDE2' },

    // SDG 7: Affordable and Clean Energy
    { id: 'sdg7-1', sdgId: 7, sdgTitle: 'Affordable and Clean Energy', action: 'Unplug devices when not in use', explanation: 'Phantom energy use accounts for a significant portion of household electricity.', color: '#FCC30B' },
    { id: 'sdg7-2', sdgId: 7, sdgTitle: 'Affordable and Clean Energy', action: 'Switch to LED bulbs', explanation: 'LEDs use up to 80% less energy than traditional bulbs.', color: '#FCC30B' },
    { id: 'sdg7-3', sdgId: 7, sdgTitle: 'Affordable and Clean Energy', action: 'Wash clothes in cold water', explanation: 'Heating water is the most energy-intensive part of laundry.', color: '#FCC30B' },
    { id: 'sdg7-4', sdgId: 7, sdgTitle: 'Affordable and Clean Energy', action: 'Air-dry your clothes', explanation: 'Skip the dryer to save energy and make your clothes last longer.', color: '#FCC30B' },
    { id: 'sdg7-5', sdgId: 7, sdgTitle: 'Affordable and Clean Energy', action: 'Turn off lights when leaving', explanation: 'A simple habit that makes a big impact on your energy bill.', color: '#FCC30B' },

    // SDG 8: Decent Work and Economic Growth
    { id: 'sdg8-1', sdgId: 8, sdgTitle: 'Decent Work and Economic Growth', action: 'Buy fair-trade products', explanation: 'Fair trade ensures producers receive a living wage and work in safe conditions.', color: '#A21942' },
    { id: 'sdg8-2', sdgId: 8, sdgTitle: 'Decent Work and Economic Growth', action: 'Support small businesses', explanation: 'Local shops create jobs and keep money in the community.', color: '#A21942' },
    { id: 'sdg8-3', sdgId: 8, sdgTitle: 'Decent Work and Economic Growth', action: 'Be an ethical consumer', explanation: 'Research companies before you buy to ensure they treat workers well.', color: '#A21942' },
    { id: 'sdg8-4', sdgId: 8, sdgTitle: 'Decent Work and Economic Growth', action: 'Mentor a young professional', explanation: 'Helping others start their career contributes to economic growth.', color: '#A21942' },
    { id: 'sdg8-5', sdgId: 8, sdgTitle: 'Decent Work and Economic Growth', action: 'Invest responsibly', explanation: 'Put your money in funds that prioritize social and environmental good.', color: '#A21942' },

    // SDG 9: Industry, Innovation and Infrastructure
    { id: 'sdg9-1', sdgId: 9, sdgTitle: 'Industry, Innovation and Infrastructure', action: 'Use public transport today', explanation: 'Supporting public infrastructure reduces environmental impact and congestion.', color: '#FD6925' },
    { id: 'sdg9-2', sdgId: 9, sdgTitle: 'Industry, Innovation and Infrastructure', action: 'Recycle old electronics', explanation: 'E-waste contains valuable materials that can be reused in new tech.', color: '#FD6925' },
    { id: 'sdg9-3', sdgId: 9, sdgTitle: 'Industry, Innovation and Infrastructure', action: 'Support local innovation', explanation: 'Cheer on local startups that are solving modern problems.', color: '#FD6925' },
    { id: 'sdg9-4', sdgId: 9, sdgTitle: 'Industry, Innovation and Infrastructure', action: 'Use shared workspaces', explanation: 'Sharing resources and space is more efficient for businesses.', color: '#FD6925' },
    { id: 'sdg9-5', sdgId: 9, sdgTitle: 'Industry, Innovation and Infrastructure', action: 'Report infrastructure issues', explanation: 'Help keep your city safe by reporting broken pipes or lights.', color: '#FD6925' },

    // SDG 10: Reduced Inequality
    { id: 'sdg10-1', sdgId: 10, sdgTitle: 'Reduced Inequality', action: 'Learn about a different culture', explanation: 'Understanding and empathy are the foundations of reducing social inequality.', color: '#DD1367' },
    { id: 'sdg10-2', sdgId: 10, sdgTitle: 'Reduced Inequality', action: 'Speak up against bullying', explanation: 'Standing up for others helps foster a culture of respect.', color: '#DD1367' },
    { id: 'sdg10-3', sdgId: 10, sdgTitle: 'Reduced Inequality', action: 'Support refugees', explanation: 'Helping those who have fled conflict is a vital act of global solidarity.', color: '#DD1367' },
    { id: 'sdg10-4', sdgId: 10, sdgTitle: 'Reduced Inequality', action: 'Buy from diverse creators', explanation: 'Supporting underrepresented artists helps bridge the economic gap.', color: '#DD1367' },
    { id: 'sdg10-5', sdgId: 10, sdgTitle: 'Reduced Inequality', action: 'Challenge your own biases', explanation: 'Self-reflection is the first step toward becoming more inclusive.', color: '#DD1367' },

    // SDG 11: Sustainable Cities and Communities
    { id: 'sdg11-1', sdgId: 11, sdgTitle: 'Sustainable Cities and Communities', action: 'Pick up 3 pieces of litter', explanation: 'Taking care of your local environment helps build more sustainable communities.', color: '#FD9D24' },
    { id: 'sdg11-2', sdgId: 11, sdgTitle: 'Sustainable Cities and Communities', action: 'Use a reusable coffee cup', explanation: 'Reducing waste in your community keeps your neighborhood clean.', color: '#FD9D24' },
    { id: 'sdg11-3', sdgId: 11, sdgTitle: 'Sustainable Cities and Communities', action: 'Support local parks', explanation: 'Green spaces are essential for the health and well-being of city dwellers.', color: '#FD9D24' },
    { id: 'sdg11-4', sdgId: 11, sdgTitle: 'Sustainable Cities and Communities', action: 'Cycle or walk for short trips', explanation: 'Reducing car use improves air quality in your community.', color: '#FD9D24' },
    { id: 'sdg11-5', sdgId: 11, sdgTitle: 'Sustainable Cities and Communities', action: 'Join a neighborhood group', explanation: 'Collective action at the local level is powerful.', color: '#FD9D24' },

    // SDG 12: Responsible Consumption and Production
    { id: 'sdg12-1', sdgId: 12, sdgTitle: 'Responsible Consumption and Production', action: 'Skip single-use plastic', explanation: 'Reusable alternatives significantly reduce the amount of waste sent to landfills.', color: '#BF8B2E' },
    { id: 'sdg12-2', sdgId: 12, sdgTitle: 'Responsible Consumption and Production', action: 'Buy second-hand', explanation: 'Giving products a second life reduces the demand for new production.', color: '#BF8B2E' },
    { id: 'sdg12-3', sdgId: 12, sdgTitle: 'Responsible Consumption and Production', action: 'Compost your food scraps', explanation: 'Composting turns waste into valuable nutrients for the soil.', color: '#BF8B2E' },
    { id: 'sdg12-4', sdgId: 12, sdgTitle: 'Responsible Consumption and Production', action: 'Avoid fast fashion', explanation: 'Quality over quantity reduces the environmental impact of your wardrobe.', color: '#BF8B2E' },
    { id: 'sdg12-5', sdgId: 12, sdgTitle: 'Responsible Consumption and Production', action: 'Rent instead of buying', explanation: 'Sharing items like tools or formal wear is more sustainable.', color: '#BF8B2E' },

    // SDG 13: Climate Action
    { id: 'sdg13-1', sdgId: 13, sdgTitle: 'Climate Action', action: 'Go meat-free for a day', explanation: 'Reducing meat consumption is one of the most effective ways to lower your carbon footprint.', color: '#3F7E44' },
    { id: 'sdg13-2', sdgId: 13, sdgTitle: 'Climate Action', action: 'Wash clothes at 30°C', explanation: 'Lower temperature washes use significantly less energy than hot washes.', color: '#3F7E44' },
    { id: 'sdg13-3', sdgId: 13, sdgTitle: 'Climate Action', action: 'Plant a tree', explanation: 'Trees absorb CO2 and help combat global warming.', color: '#3F7E44' },
    { id: 'sdg13-4', sdgId: 13, sdgTitle: 'Climate Action', action: 'Switch to green energy', explanation: 'Choosing a renewable energy provider directly supports the transition.', color: '#3F7E44' },
    { id: 'sdg13-5', sdgId: 13, sdgTitle: 'Climate Action', action: 'Educate others on climate', explanation: 'Raising awareness is key to systemic change.', color: '#3F7E44' },

    // SDG 14: Life Below Water
    { id: 'sdg14-1', sdgId: 14, sdgTitle: 'Life Below Water', action: 'Avoid products with microbeads', explanation: 'Tiny plastics in cosmetics end up in the ocean and harm marine life.', color: '#0A97D9' },
    { id: 'sdg14-2', sdgId: 14, sdgTitle: 'Life Below Water', action: 'Pick up beach litter', explanation: 'Preventing plastic from entering the sea protects marine ecosystems.', color: '#0A97D9' },
    { id: 'sdg14-3', sdgId: 14, sdgTitle: 'Life Below Water', action: 'Eat sustainable seafood', explanation: 'Look for certifications like MSC to ensure overfishing is avoided.', color: '#0A97D9' },
    { id: 'sdg14-4', sdgId: 14, sdgTitle: 'Life Below Water', action: 'Reduce plastic bag use', explanation: 'Plastic bags are often mistaken for food by sea turtles.', color: '#0A97D9' },
    { id: 'sdg14-5', sdgId: 14, sdgTitle: 'Life Below Water', action: 'Support marine conservation', explanation: 'Donate to organizations that protect our oceans.', color: '#0A97D9' },

    // SDG 15: Life on Land
    { id: 'sdg15-1', sdgId: 15, sdgTitle: 'Life on Land', action: 'Plant a native seed', explanation: 'Supporting local biodiversity helps protect ecosystems and wildlife.', color: '#56C02B' },
    { id: 'sdg15-2', sdgId: 15, sdgTitle: 'Life on Land', action: 'Avoid using pesticides', explanation: 'Organic gardening protects bees and other vital pollinators.', color: '#56C02B' },
    { id: 'sdg15-3', sdgId: 15, sdgTitle: 'Life on Land', action: 'Use recycled paper', explanation: 'Choosing recycled paper reduces the pressure on our forests.', color: '#56C02B' },
    { id: 'sdg15-4', sdgId: 15, sdgTitle: 'Life on Land', action: 'Support reforestation', explanation: 'Forests are home to 80% of terrestrial biodiversity.', color: '#56C02B' },
    { id: 'sdg15-5', sdgId: 15, sdgTitle: 'Life on Land', action: 'Be careful with fires', explanation: 'Wildfires can devastate ecosystems and habitats.', color: '#56C02B' },

    // SDG 16: Peace, Justice and Strong Institutions
    { id: 'sdg16-1', sdgId: 16, sdgTitle: 'Peace, Justice and Strong Institutions', action: 'Report an online scam', explanation: 'Helping keep digital spaces safe contributes to a more just and stable society.', color: '#00689D' },
    { id: 'sdg16-2', sdgId: 16, sdgTitle: 'Peace, Justice and Strong Institutions', action: 'Learn about human rights', explanation: 'Knowledge of your rights is the first step in defending them.', color: '#00689D' },
    { id: 'sdg16-3', sdgId: 16, sdgTitle: 'Peace, Justice and Strong Institutions', action: 'Vote in elections', explanation: 'Participating in democracy is fundamental to strong institutions.', color: '#00689D' },
    { id: 'sdg16-4', sdgId: 16, sdgTitle: 'Peace, Justice and Strong Institutions', action: 'Support transparency', explanation: 'Advocate for open and honest governance in your community.', color: '#00689D' },
    { id: 'sdg16-5', sdgId: 16, sdgTitle: 'Peace, Justice and Strong Institutions', action: 'Practice peaceful conflict resolution', explanation: 'Start small by resolving personal disputes through dialogue.', color: '#00689D' },

    // SDG 17: Partnerships for the Goals
    { id: 'sdg17-1', sdgId: 17, sdgTitle: 'Partnerships for the Goals', action: 'Share this app with a friend', explanation: 'Collaborative action is essential to achieving all 17 Sustainable Development Goals.', color: '#19486A' },
    { id: 'sdg17-2', sdgId: 17, sdgTitle: 'Partnerships for the Goals', action: 'Collaborate on a project', explanation: 'Working together multiplies our impact on the world.', color: '#19486A' },
    { id: 'sdg17-3', sdgId: 17, sdgTitle: 'Partnerships for the Goals', action: 'Support global NGOs', explanation: 'International cooperation is key to solving global challenges.', color: '#19486A' },
    { id: 'sdg17-4', sdgId: 17, sdgTitle: 'Partnerships for the Goals', action: 'Share best practices', explanation: 'Teaching others what works helps everyone reach the goals faster.', color: '#19486A' },
    { id: 'sdg17-5', sdgId: 17, sdgTitle: 'Partnerships for the Goals', action: 'Participate in local forums', explanation: 'Contributing your voice to global discussions starts locally.', color: '#19486A' },
];
