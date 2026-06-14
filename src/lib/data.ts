import { Challenge, EcoModule, EcoLab } from '../types';

export const CHALLENGES: Challenge[] = [
  // --- DAILY ECO MISSIONS ---
  {
    id: 'daily-1',
    type: 'daily',
    title: '🚶 Green Commute Challenge',
    description: 'Use walking, cycling, public transport, or carpooling for your daily commute.',
    points: 50,
    category: 'transportation',
    icon: 'Map',
    difficulty: 'easy',
    reward: { xp: 50, coins: 5 },
    tasks: [
      { id: 't-d1-1', title: 'Log a green trip', description: 'Record one sustainable journey today.', points: 20, completed: false, category: 'daily' },
      { id: 't-d1-2', title: 'Avoid solo driving', description: 'Do not use a personal car alone.', points: 30, completed: false, category: 'daily' }
    ]
  },
  {
    id: 'daily-2',
    type: 'daily',
    title: '💧 Water Saver Challenge',
    description: 'Reduce water usage by at least 10% today.',
    points: 40,
    category: 'water',
    icon: 'Droplets',
    difficulty: 'easy',
    reward: { xp: 40 },
    tasks: [
      { id: 't-d2-1', title: 'Shorter shower', description: 'Keep your shower under 5 minutes.', points: 20, completed: false, category: 'daily' },
      { id: 't-d2-2', title: 'Turn off tap', description: 'Turn off the tap while brushing teeth.', points: 20, completed: false, category: 'daily' }
    ]
  },
  {
    id: 'daily-3',
    type: 'daily',
    title: '🔌 Energy Guardian Challenge',
    description: 'Switch off unused devices and save electricity.',
    points: 60,
    category: 'energy',
    icon: 'Zap',
    difficulty: 'easy',
    reward: { xp: 60 },
    tasks: [
      { id: 't-d3-1', title: 'Unplug vampires', description: 'Unplug 3 idle electronics.', points: 30, completed: false, category: 'daily' },
      { id: 't-d3-2', title: 'Natural light', description: 'Use natural light instead of bulbs during the day.', points: 30, completed: false, category: 'daily' }
    ]
  },

  // --- WEEKLY CHALLENGES ---
  {
    id: 'weekly-1',
    type: 'weekly',
    title: '🌍 Carbon Crusher Week',
    description: 'Reduce your estimated carbon footprint by 15%.',
    points: 500,
    category: 'general',
    icon: 'Wind',
    difficulty: 'hard',
    reward: { xp: 500, badge: 'Carbon Crusher' },
    tasks: [
      { id: 't-w1-1', title: 'Track all meals', description: 'Log diet every day for a week.', points: 150, completed: false, category: 'weekly' },
      { id: 't-w1-2', title: 'Optimize transport', description: 'Replace 5 car trips with walking/cycling.', points: 350, completed: false, category: 'weekly' }
    ]
  },
  {
    id: 'weekly-2',
    type: 'weekly',
    title: '🚫 No Plastic Week',
    description: 'Avoid plastic products for 7 days.',
    points: 700,
    category: 'waste',
    icon: 'Trash',
    difficulty: 'hard',
    reward: { xp: 700 },
    tasks: [
      { id: 't-w2-1', title: 'Zero plastic shopping', description: 'Buy groceries without any plastic packaging.', points: 300, completed: false, category: 'weekly' }
    ]
  },

  // --- MONTHLY MEGA CHALLENGES ---
  {
    id: 'monthly-1',
    type: 'monthly',
    title: '🏆 Net-Zero Hero',
    description: 'Reduce personal emissions by 30%.',
    points: 5000,
    category: 'general',
    icon: 'Star',
    difficulty: 'hard',
    reward: { xp: 5000, badge: 'Net-Zero Hero' },
    tasks: [
      { id: 't-m1-1', title: 'Monthly audit', description: 'Perform a full monthly carbon audit.', points: 5000, completed: false, category: 'milestone' }
    ]
  },

  // --- COMMUNITY CHALLENGES ---
  {
    id: 'comm-task-1',
    type: 'community',
    title: '🌳 Global Reforestation',
    description: 'Contribute to planting 10,000 trees globally.',
    points: 1000,
    category: 'general',
    icon: 'Leaf',
    difficulty: 'medium',
    reward: { xp: 1000, badge: 'Tree Champion' },
    tasks: [
      { id: 't-c1-1', title: 'Plant a tree', description: 'Plant one tree and upload proof.', points: 1000, completed: false, category: 'milestone' }
    ]
  }
];

export const COMMUNITY_CHALLENGES = [
  {
    id: 'comm-1',
    title: '🌳 Plant 10,000 Trees',
    goal: 10000,
    current: 7854,
    reward: 'Global Community Badge',
    icon: 'Leaf'
  },
  {
    id: 'comm-2',
    title: '♻️ Save 1 Million Plastic Bottles',
    goal: 1000000,
    current: 624520,
    reward: 'Ocean Guardian Badge',
    icon: 'Droplets'
  },
  {
    id: 'comm-3',
    title: '🌍 Reduce 1000 Tons of CO₂',
    goal: 1000,
    current: 432,
    reward: 'Climate Warrior Badge',
    icon: 'Wind'
  }
];

export const BADGES = [
  { id: 'b1', name: '🌱 First Green Step', icon: '🌱', level: 1 },
  { id: 'b2', name: '♻️ Recycling Master', icon: '♻️', level: 5 },
  { id: 'b3', name: '🚴 Sustainable Traveler', icon: '🚴', level: 10 },
  { id: 'b4', name: '⚡ Energy Hero', icon: '⚡', level: 15 },
  { id: 'b5', name: '💧 Water Protector', icon: '💧', level: 20 },
  { id: 'b6', name: '🌳 Tree Champion', icon: '🌳', level: 30 },
  { id: 'b7', name: '🌎 Climate Warrior', icon: '🌎', level: 40 },
  { id: 'b8', name: '👑 Planet Guardian', icon: '👑', level: 50 }
];

export const MODULES: EcoModule[] = [
  {
    id: 'mod-climate-change',
    title: '🌍 Climate Change Essentials',
    description: 'Understand the science, impacts, and solutions to the global climate crisis.',
    content: 'Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels like coal, oil, and gas, which produces heat-trapping gases.',
    duration: '20 mins',
    tasks: [
      { id: 't-m1-1', title: 'Watch Climate 101', description: 'Watch a verified documentary on climate science.', points: 50, completed: false, category: 'milestone' },
      { id: 't-m1-2', title: 'Read IPCC Summary', description: 'Read the summary for policymakers from the latest IPCC report.', points: 50, completed: false, category: 'milestone' }
    ],
    quiz: [
      { question: 'What is the primary cause of climate change since the 1800s?', options: ['Volcanic eruptions', 'Ocean currents', 'Human activities (fossil fuels)', 'Solar activity'], correctAnswer: 2 },
      { question: 'Which gas is the most abundant greenhouse gas?', options: ['Oxygen', 'Methane', 'Carbon dioxide', 'Nitrogen'], correctAnswer: 2 },
      { question: 'What does IPCC stand for?', options: ['Intergovernmental Panel on Climate Change', 'International Plant for Climate Control', 'Independent Policy for Climate Change', 'Integrated Program for Climate Coordination'], correctAnswer: 0 },
      { question: 'What is the "Greenhouse Effect"?', options: ['Plants growing faster', 'Heat being trapped in the atmosphere', 'The moon reflecting sunlight', 'Ocean levels rising'], correctAnswer: 1 },
      { question: 'Which sector contributes most to global GHG emissions?', options: ['Agriculture', 'Transport', 'Energy (Electricity/Heat)', 'Manufacturing'], correctAnswer: 2 },
      { question: 'What is the goal of the Paris Agreement?', options: ['Ban all plastics', 'Limit global warming to well below 2°C', 'End poverty', 'Stop volcanic activity'], correctAnswer: 1 },
      { question: 'What happens to oceans as they absorb CO2?', options: ['They become more acidic', 'They become less salty', 'They freeze faster', 'They shrink in size'], correctAnswer: 0 },
      { question: 'Which Arctic animal is most threatened by melting sea ice?', options: ['Penguins', 'Polar bears', 'Seals', 'Arctic foxes'], correctAnswer: 1 },
      { question: 'What is "Carbon Sequestration"?', options: ['Burning coal', 'Mining for carbon', 'Capturing and storing CO2', 'A type of renewable energy'], correctAnswer: 2 },
      { question: 'What can individuals do to combat climate change?', options: ['Increase plastic use', 'Reduce energy consumption', 'Drive more often', 'Ignore the issue'], correctAnswer: 1 }
    ]
  },
  {
    id: 'mod-renewable-energy',
    title: '⚡ Renewable Energy Mastery',
    description: 'Explore solar, wind, hydro, and other clean energy sources for a net-zero future.',
    content: 'Renewable energy is energy from sources that are naturally replenishing but flow-limited. They are virtually inexhaustible in duration but limited in the amount of energy that is available per unit of time.',
    duration: '25 mins',
    tasks: [
      { id: 't-m2-1', title: 'Identify Local Sources', description: 'Research where your local electricity comes from.', points: 50, completed: false, category: 'milestone' },
      { id: 't-m2-2', title: 'Solar Potential Check', description: 'Use an online tool to check your home\'s solar potential.', points: 50, completed: false, category: 'milestone' }
    ],
    quiz: [
      { question: 'Which of these is a renewable energy source?', options: ['Natural Gas', 'Coal', 'Solar', 'Nuclear'], correctAnswer: 2 },
      { question: 'How do solar panels (PV) work?', options: ['Reflecting light to space', 'Converting light directly into electricity', 'Using heat to boil water', 'By burning sunlight'], correctAnswer: 1 },
      { question: 'What is the main advantage of wind energy?', options: ['It has no emissions during operation', 'It works without wind', 'It is silent', 'It takes up no space'], correctAnswer: 0 },
      { question: 'What is geothermal energy?', options: ['Energy from the sun', 'Energy from moving water', 'Energy from the Earth\'s internal heat', 'Energy from the wind'], correctAnswer: 2 },
      { question: 'What is "Energy Efficiency"?', options: ['Using more energy', 'Only using batteries', 'Using less energy to perform the same task', 'Stopping all energy use'], correctAnswer: 2 },
      { question: 'Which country is a leader in wind energy?', options: ['China', 'USA', 'Denmark', 'Germany'], correctAnswer: 0 },
      { question: 'What is a "Smart Grid"?', options: ['A grid made of solar panels', 'An electricity network that uses digital technology', 'A grid that doesn\'t use wires', 'A very small power plant'], correctAnswer: 1 },
      { question: 'What is the main challenge with solar/wind?', options: ['They produce CO2', 'Intermittency (not always available)', 'They are too expensive', 'They are dangerous'], correctAnswer: 1 },
      { question: 'What is hydropower?', options: ['Energy from steam', 'Energy from moving water', 'Energy from hydrogen', 'Energy from rain'], correctAnswer: 1 },
      { question: 'Which energy source is known as "concentrated sunlight"?', options: ['Photovoltaics (PV)', 'Concentrated Solar Power (CSP)', 'Wind Power', 'Biomass Energy'], correctAnswer: 1 }
    ]
  },
  {
    id: 'mod-recycling',
    title: '♻️ Recycling & Waste Management',
    description: 'Master the art of reducing, reusing, and recycling to minimize landfill impact.',
    content: 'Recycling is the process of collecting and processing materials that would otherwise be thrown away as trash and turning them into new products.',
    duration: '15 mins',
    tasks: [
      { id: 't-m3-1', title: 'Waste Audit', description: 'Analyze your trash for 3 days to see what can be recycled.', points: 50, completed: false, category: 'milestone' },
      { id: 't-m3-2', title: 'Local Rules', description: 'Find and print your local recycling guidelines.', points: 50, completed: false, category: 'milestone' }
    ],
    quiz: [
      { question: 'What are the 3 Rs of waste management?', options: ['Read, Rise, Run', 'Recover, Redo, Relive', 'Reduce, Reuse, Recycle', 'Refine, Reform, Rebuild'], correctAnswer: 2 },
      { question: 'Which of these is generally NOT recyclable?', options: ['Glass bottles', 'Aluminum cans', 'Food-soiled pizza boxes', 'Newspapers'], correctAnswer: 2 },
      { question: 'What is composting?', options: ['Natural process of recycling organic waste', 'Burning trash', 'Mixing plastic and metal', 'Burying electronics'], correctAnswer: 0 },
      { question: 'What is "Upcycling"?', options: ['Throwing things away', 'Recycling down into raw materials', 'Creating something of higher value from old items', 'Cycling uphill'], correctAnswer: 2 },
      { question: 'How long does a plastic bottle take to decompose?', options: ['10 years', '100 years', '450 years', '1000 years'], correctAnswer: 2 },
      { question: 'What does the recycling symbol with a number mean?', options: ['Number of times recycled', 'Type of plastic resin', 'Quality of item', 'Retail price'], correctAnswer: 1 },
      { question: 'Which material can be recycled infinitely?', options: ['Plastic', 'Paper', 'Aluminum', 'Cardboard'], correctAnswer: 2 },
      { question: 'What is "E-waste"?', options: ['Extra waste', 'Environmental waste', 'Electronic waste', 'Easy waste'], correctAnswer: 2 },
      { question: 'What should you do before recycling a jar?', options: ['Break it', 'Paint it', 'Rinse it out', 'Put the lid on tight'], correctAnswer: 2 },
      { question: 'What is a "Circular Economy"?', options: ['An economy based on circles', 'System aimed at eliminating waste and continual use of resources', 'Trading in circles', 'Global shipping'], correctAnswer: 1 }
    ]
  },
  {
    id: 'mod-transportation',
    title: '🚗 Sustainable Transportation',
    description: 'Learn how to move efficiently while reducing your travel-related carbon footprint.',
    content: 'Sustainable transport refers to the broad subject of transport that is sustainable in the senses of social, environmental and climate impacts.',
    duration: '18 mins',
    tasks: [
      { id: 't-m4-1', title: 'Public Transit Route', description: 'Plan a trip using only public transport.', points: 50, completed: false, category: 'milestone' },
      { id: 't-m4-2', title: 'Tire Pressure Check', description: 'Check your car\'s tire pressure to optimize fuel efficiency.', points: 50, completed: false, category: 'milestone' }
    ],
    quiz: [
      { question: 'Which mode of transport has the lowest CO2 per km?', options: ['Gasoline Car', 'Commercial Plane', 'Bicycle', 'City Bus'], correctAnswer: 2 },
      { question: 'What is "Carpooling"?', options: ['Sharing a car journey with others', 'Swimming in a car', 'Washing your car', 'Buying a new car'], correctAnswer: 0 },
      { question: 'What is an EV?', options: ['Extra Vehicle', 'Efficient Vessel', 'Electric Vehicle', 'Engine Valve'], correctAnswer: 2 },
      { question: 'Which fuel is considered "biofuel"?', options: ['Petroleum Diesel', 'Ethanol from corn', 'Liquid Propane', 'Aviation Kerosene'], correctAnswer: 1 },
      { question: 'What is "Active Transport"?', options: ['Fast driving', 'Transport using physical activity (walking/cycling)', 'Rocket transport', 'Public buses'], correctAnswer: 1 },
      { question: 'How does idling affect fuel economy?', options: ['Improves it', 'No effect', 'Decreases it (wastes fuel)', 'Makes the car faster'], correctAnswer: 2 },
      { question: 'What is the "Last Mile" problem?', options: ['The last mile of a race', 'Difficulty of getting from a transport hub to destination', 'Running out of gas', 'Slow speed limits'], correctAnswer: 1 },
      { question: 'Which is more efficient for long distances?', options: ['High-speed Train', 'Short-haul flight', 'Individual car', 'SUV'], correctAnswer: 0 },
      { question: 'What is "Telecommuting"?', options: ['Using a telephone', 'Working from home', 'Traveling by phone', 'Commuting by bus'], correctAnswer: 1 },
      { question: 'What is "Eco-driving"?', options: ['Driving techniques that save fuel', 'Driving an EV', 'Driving in the woods', 'Driving slowly'], correctAnswer: 0 }
    ]
  },
  {
    id: 'mod-water',
    title: '💧 Water Conservation',
    description: 'Every drop counts. Discover strategies to save water at home and in industry.',
    content: 'Water conservation includes all the policies, strategies and activities to sustainably manage the natural resource of fresh water.',
    duration: '12 mins',
    tasks: [
      { id: 't-m5-1', title: 'Leak Detection', description: 'Check all faucets and toilets for leaks.', points: 50, completed: false, category: 'milestone' },
      { id: 't-m5-2', title: 'Shower Timer', description: 'Set a 5-minute timer for your next 3 showers.', points: 50, completed: false, category: 'milestone' }
    ],
    quiz: [
      { question: 'What percentage of Earth\'s water is fresh and accessible?', options: ['10%', '70%', 'Less than 1%', '50%'], correctAnswer: 2 },
      { question: 'Which activity uses the most water indoors?', options: ['Drinking', 'Cooking', 'Flushing toilets', 'Washing hands'], correctAnswer: 2 },
      { question: 'What is "Greywater"?', options: ['Dirty sewage', 'Gently used water from sinks/showers', 'Rainwater', 'Ocean water'], correctAnswer: 1 },
      { question: 'What is "Xeriscaping"?', options: ['Landscape that requires little water', 'A type of irrigation', 'Painting rocks', 'Watering at night'], correctAnswer: 0 },
      { question: 'How much water can a leaky faucet waste per year?', options: ['10 gallons', '3,000+ gallons', '100 gallons', '50 gallons'], correctAnswer: 1 },
      { question: 'What is a "Low-Flow" showerhead?', options: ['A broken showerhead', 'A showerhead for cold water', 'Device that reduces water flow rate', 'A very small showerhead'], correctAnswer: 2 },
      { question: 'When is the best time to water plants?', options: ['Midday', 'Late afternoon', 'Early morning or late evening', 'When it is raining'], correctAnswer: 2 },
      { question: 'What is a "Water Footprint"?', options: ['A footprint in the mud', 'Total volume of fresh water used by a person/product', 'Amount of rain in a year', 'Depth of a lake'], correctAnswer: 1 },
      { question: 'Which food requires the most water to produce?', options: ['Apples', 'Beef', 'Potatoes', 'Bread'], correctAnswer: 1 },
      { question: 'What is "Desalination"?', options: ['Adding salt to water', 'Removing salt from seawater', 'Filtering mud', 'Boiling water'], correctAnswer: 1 }
    ]
  },
  {
    id: 'mod-green-homes',
    title: '🏠 Green Homes & Living',
    description: 'Transform your living space into an eco-friendly sanctuary.',
    content: 'A green home is a type of house designed to be environmentally friendly and sustainable. And also focuses on the efficient use of "energy, water, and building materials."',
    duration: '22 mins',
    tasks: [
      { id: 't-m6-1', title: 'Bulb Swap', description: 'Replace one incandescent bulb with an LED.', points: 50, completed: false, category: 'milestone' },
      { id: 't-m6-2', title: 'Insulation Check', description: 'Check for drafts around windows and doors.', points: 50, completed: false, category: 'milestone' }
    ],
    quiz: [
      { question: 'What is the most energy-efficient lighting?', options: ['Incandescent', 'Halogen', 'LED', 'CFL'], correctAnswer: 2 },
      { question: 'What does "Energy Star" label mean?', options: ['The product is famous', 'The product meets strict efficiency guidelines', 'The product uses stars for power', 'The product is made of glass'], correctAnswer: 1 },
      { question: 'What is "Passive Solar Design"?', options: ['Using windows/walls to collect/distribute solar heat', 'Using solar panels', 'A solar panel that doesn\'t move', 'Night-time solar'], correctAnswer: 0 },
      { question: 'What is "Thermal Insulation"?', options: ['Heating the house', 'Materials that reduce heat transfer', 'Cooling the house', 'A type of window'], correctAnswer: 1 },
      { question: 'Which thermostat is best for saving energy?', options: ['Manual Dial', 'Programmable/Smart', 'Analog Lever', 'Standard Switch'], correctAnswer: 1 },
      { question: 'What is a "VOC" in paint?', options: ['Vibrant Organic Color', 'Volatile Organic Compound', 'Very Old Chemical', 'Value of Coating'], correctAnswer: 1 },
      { question: 'What is the benefit of "Dual-Pane" windows?', options: ['Better insulation and noise reduction', 'They look better', 'They are cheaper', 'Easier to clean'], correctAnswer: 0 },
      { question: 'What is "Net Zero Energy"?', options: ['Using no energy', 'Building that produces as much energy as it consumes', 'Having zero energy in batteries', 'A cheap energy bill'], correctAnswer: 1 },
      { question: 'Which floor material is most sustainable?', options: ['Synthetic Carpet', 'Vinyl Tiles', 'Bamboo', 'Laminate Wood'], correctAnswer: 2 },
      { question: 'What is "Draft Stripping"?', options: ['Removing old paint', 'Sealing air leaks around doors/windows', 'Drawing house plans', 'Stripping electrical wires'], correctAnswer: 1 }
    ]
  },
  {
    id: 'mod-food',
    title: '🌱 Sustainable Food Choices',
    description: 'Eat your way to a healthier planet by choosing low-impact foods.',
    content: 'Sustainable food is food that is healthy for consumers and animals, does not harm the environment, and is humane for workers.',
    duration: '15 mins',
    tasks: [
      { id: 't-m7-1', title: 'Meatless Monday', description: 'Go meat-free for an entire day.', points: 50, completed: false, category: 'milestone' },
      { id: 't-m7-2', title: 'Local Farmers Market', description: 'Visit a local market and buy 3 seasonal items.', points: 50, completed: false, category: 'milestone' }
    ],
    quiz: [
      { question: 'Which diet generally has the lowest carbon footprint?', options: ['Meat-heavy', 'Vegan', 'Pescatarian', 'Paleo'], correctAnswer: 1 },
      { question: 'What are "Food Miles"?', options: ['Miles you walk to eat', 'Distance food travels from producer to consumer', 'Weight of food in miles', 'Speed of eating'], correctAnswer: 1 },
      { question: 'What is "Seasonal Eating"?', options: ['Eating only in winter', 'Eating food when it naturally grows in your area', 'Eating 4 times a day', 'Eating spicy food'], correctAnswer: 1 },
      { question: 'Why is beef production high impact?', options: ['Methane emissions and land use', 'Cows are big', 'Water is used for cows to swim', 'Cows eat too much grass'], correctAnswer: 0 },
      { question: 'What is "Organic Food"?', options: ['Food produced without synthetic pesticides/fertilizers', 'Food with more organs', 'Food that is very expensive', 'Food from the ocean'], correctAnswer: 0 },
      { question: 'What is "Food Waste"?', options: ['Food that tastes bad', 'Scraps from cooking', 'Discarded food fit for consumption', 'Empty packaging'], correctAnswer: 2 },
      { question: 'Which labeling indicates sustainable seafood?', options: ['Certified Fresh', 'Wild-caught', 'MSC (Marine Stewardship Council)', 'Sea Salted'], correctAnswer: 2 },
      { question: 'What is "Regenerative Agriculture"?', options: ['Farming that restores soil health', 'Using more chemicals', 'Growing food in labs', 'Using robots'], correctAnswer: 0 },
      { question: 'How much of global GHG comes from food systems?', options: ['5%', 'About 25-30%', '10%', '80%'], correctAnswer: 1 },
      { question: 'What is a benefit of a "Kitchen Garden"?', options: ['Lower food miles and fresh produce', 'Higher food miles', 'More plastic use', 'No real benefit'], correctAnswer: 0 }
    ]
  },
  {
    id: 'mod-carbon-reduction',
    title: '🌎 Carbon Footprint Reduction',
    description: 'Synthesize everything you\'ve learned to live a carbon-neutral life.',
    content: 'A carbon footprint is the total amount of greenhouse gases (including carbon dioxide and methane) that are generated by our actions.',
    duration: '25 mins',
    tasks: [
      { id: 't-m8-1', title: 'Calculate Full Footprint', description: 'Use the EcoSense AI calculator for a detailed audit.', points: 50, completed: false, category: 'milestone' },
      { id: 't-m8-2', title: 'Personal Roadmap', description: 'Create a 6-month plan to reduce emissions by 20%.', points: 50, completed: false, category: 'milestone' }
    ],
    quiz: [
      { question: 'What is a "Carbon Offset"?', options: ['Ignoring emissions', 'Compensating for emissions by funding projects elsewhere', 'A type of carbon fiber', 'Measuring carbon'], correctAnswer: 1 },
      { question: 'What does "Carbon Neutral" mean?', options: ['Net zero carbon emissions', 'No carbon exists', 'Carbon is not used', 'Carbon is colored grey'], correctAnswer: 0 },
      { question: 'What is the average global carbon footprint per person?', options: ['1 ton', '4 tons', '20 tons', '100 tons'], correctAnswer: 1 },
      { question: 'Which lifestyle change has the biggest impact?', options: ['Recycling paper', 'Using a reusable straw', 'Avoiding one long-haul flight', 'Turning off the TV'], correctAnswer: 2 },
      { question: 'What is "Scope 1" emissions?', options: ['Indirect emissions', 'Direct emissions from owned sources', 'Emissions from suppliers', 'Emissions from neighbors'], correctAnswer: 1 },
      { question: 'What is the "Social Cost of Carbon"?', options: ['Price of coal', 'Tax on diamonds', 'Economic damage caused by CO2 emissions', 'Cost of a BBQ'], correctAnswer: 2 },
      { question: 'What is a "Carbon Tax"?', options: ['Fee on carbon emissions', 'Tax on jewelry', 'Tax on cars only', 'A government subsidy'], correctAnswer: 0 },
      { question: 'How can you reduce "Digital Carbon"?', options: ['Delete old emails/files', 'Buy more phones', 'Leave the PC on', 'Watch more 4K video'], correctAnswer: 0 },
      { question: 'What is "Net Zero" by 2050?', options: ['Global goal to balance emissions and removals', 'A scientific experiment', 'A movie title', 'The end of the world'], correctAnswer: 0 },
      { question: 'Why is tracking important?', options: ['To feel bad', 'To show off', 'You can\'t manage what you don\'t measure', 'It isn\'t important'], correctAnswer: 2 }
    ]
  }
];

export const LABS: EcoLab[] = [
  {
    id: 'lab-carbon-basics',
    title: '🧪 Lab 1: Carbon Footprint Basics',
    description: 'Interactive simulator to understand how daily choices translate to kg of CO2.',
    objective: 'Visualize the invisible impact of your routine.',
    progress: 0,
    experimentSteps: [
      'Log into the Carbon Simulator.',
      'Input your typical breakfast and commute.',
      'Adjust variables (e.g., car vs. bike) to see real-time shifts.',
      'Analyze the final "Daily Impact Report".'
    ],
    quiz: [
      { question: 'Which daily activity usually has the highest impact?', options: ['Walking', 'Driving a gasoline car', 'Drinking water', 'Reading a book'], correctAnswer: 1 },
      { question: 'How much CO2 does a typical car emit per mile?', options: ['~400g', '0g', '10kg', '1g'], correctAnswer: 0 },
      { question: 'The simulator showed that diet matters. Which is highest?', options: ['Lentils', 'Chicken', 'Beef', 'Tofu'], correctAnswer: 2 },
      { question: 'What happened when you "switched" to a bike?', options: ['Emissions stayed same', 'Emissions increased', 'Emissions dropped to near zero', 'Emissions doubled'], correctAnswer: 2 },
      { question: 'What is the primary goal of this lab?', options: ['To build a bicycle', 'To understand emission sources', 'To play a video game', 'To calculate fuel prices'], correctAnswer: 1 }
    ]
  },
  {
    id: 'lab-transport-sim',
    title: '🚲 Lab 2: Transportation Impact Simulator',
    description: 'Compare different travel modes across various distances and terrains.',
    objective: 'Identify the most efficient mode for your specific needs.',
    progress: 0,
    experimentSteps: [
      'Select a 50km journey.',
      'Run the simulation for: SUV, EV, Bus, and Train.',
      'Record the energy consumption for each.',
      'Identify the "Efficiency Winner".'
    ],
    quiz: [
      { question: 'Which was most efficient for the 50km journey?', options: ['Gasoline SUV', 'Electric Train', 'Solo EV', 'Empty Bus'], correctAnswer: 1 },
      { question: 'What does "Occupancy" mean in transport efficiency?', options: ['Vehicle speed', 'Number of people sharing the vehicle', 'Fuel tank capacity', 'Vehicle color'], correctAnswer: 1 },
      { question: 'Why did the EV score better than the SUV?', options: ['It is smaller', 'Higher energy conversion efficiency', 'It has no tires', 'It is quieter'], correctAnswer: 1 },
      { question: 'What is "Regenerative Braking"?', options: ['Energy recovery during deceleration', 'A type of ceramic brake', 'Emergency braking', 'Manual downshifting'], correctAnswer: 0 },
      { question: 'The lab showed that public transit is better because:', options: ['It is faster', 'Emissions are shared among many passengers', 'It is cheaper', 'It is more comfortable'], correctAnswer: 1 }
    ]
  },
  {
    id: 'lab-home-energy',
    title: '🏠 Lab 3: Home Energy Optimizer',
    description: 'Virtually audit a home and apply energy-saving upgrades.',
    objective: 'Maximize home efficiency through strategic upgrades.',
    progress: 0,
    experimentSteps: [
      'Inspect the virtual "Drafty House".',
      'Apply insulation to the attic and walls.',
      'Upgrade from incandescent to LED bulbs.',
      'Install a smart thermostat and observe energy curve.'
    ],
    quiz: [
      { question: 'Which upgrade had the fastest ROI?', options: ['Solar panels', 'LED bulbs', 'New windows', 'Interior painting'], correctAnswer: 1 },
      { question: 'What does "Attic Insulation" prevent?', options: ['Rain leaks', 'Heat loss through the roof', 'Pest infestation', 'Sound pollution'], correctAnswer: 1 },
      { question: 'How much energy does an LED save vs. Incandescent?', options: ['10%', '30%', '75-80%', '0%'], correctAnswer: 2 },
      { question: 'A smart thermostat saves energy by:', options: ['Increasing power voltage', 'Optimizing heating/cooling schedules', 'Measuring light levels', 'Turning off the TV'], correctAnswer: 1 },
      { question: 'What is "Vampire Power"?', options: ['Power from batteries', 'High voltage surges', 'Energy used by devices in standby', 'Renewable energy'], correctAnswer: 2 }
    ]
  },
  {
    id: 'lab-waste-reduction',
    title: '♻️ Lab 4: Waste Reduction Planner',
    description: 'Analyze a week of household waste and design a zero-waste strategy.',
    objective: 'Reduce landfill contribution by 90%.',
    progress: 0,
    experimentSteps: [
      'Categorize the virtual "Trash Bin" contents.',
      'Separate recyclables and organics.',
      'Identify 3 items that could have been "Refused".',
      'Simulate the decomposition time for remaining items.'
    ],
    quiz: [
      { question: 'Which item takes the longest to decompose?', options: ['Paper Bag', 'Plastic Bottle', 'Banana Peel', 'Wool Sock'], correctAnswer: 1 },
      { question: 'Organics in a landfill produce what potent gas?', options: ['Oxygen', 'Nitrogen', 'Methane', 'Helium'], correctAnswer: 2 },
      { question: 'What is the "Refuse" in the 5 Rs?', options: ['Throwing away garbage', 'Saying no to unnecessary items', 'Refilling containers', 'Recycling plastic'], correctAnswer: 1 },
      { question: 'Which material is easiest to recycle?', options: ['Styrofoam', 'Aluminum', 'Soft plastics', 'Multi-layer cartons'], correctAnswer: 1 },
      { question: 'The lab showed that composting can reduce trash by:', options: ['5%', '15%', 'Up to 30% or more', '0%'], correctAnswer: 2 }
    ]
  },
  {
    id: 'lab-water-cons',
    title: '💧 Lab 5: Water Conservation Simulator',
    description: 'Simulate a drought and manage limited water resources.',
    objective: 'Ensure survival and sustainability under water stress.',
    progress: 0,
    experimentSteps: [
      'Allocate water to: Drinking, Sanitation, Gardening, and Industry.',
      'Trigger a 50% supply reduction.',
      'Implement "Greywater Recycling" and "Drip Irrigation".',
      'Balance the budget without depleting the aquifer.'
    ],
    quiz: [
      { question: 'Which sector uses the most freshwater globally?', options: ['Domestic', 'Agriculture', 'Industry', 'Tourism'], correctAnswer: 1 },
      { question: 'What is "Drip Irrigation"?', options: ['Wasting water', 'Precise water delivery to plant roots', 'Flood irrigation', 'Watering from a bucket'], correctAnswer: 1 },
      { question: 'Greywater can be safely used for:', options: ['Drinking water', 'Cooking', 'Irrigating non-edible plants', 'Dishwashing'], correctAnswer: 2 },
      { question: 'What is an "Aquifer"?', options: ['Underground layer of water-bearing rock', 'A type of sink tap', 'A water treatment plant', 'A storm drain'], correctAnswer: 0 },
      { question: 'In the lab, which action saved the most water?', options: ['Drinking less water', 'Fixing leaks and irrigation efficiency', 'Avoiding showers', 'Buying bottled water'], correctAnswer: 1 }
    ]
  },
  {
    id: 'lab-renewable-explorer',
    title: '☀️ Lab 6: Renewable Energy Explorer',
    description: 'Design a microgrid for a remote village using solar and wind.',
    objective: 'Provide 24/7 clean power at the lowest cost.',
    progress: 0,
    experimentSteps: [
      'Measure wind speeds and solar irradiance in the virtual village.',
      'Place turbines and PV arrays.',
      'Add battery storage for nighttime.',
      'Run the "Grid Stability Test".'
    ],
    quiz: [
      { question: 'Why is storage (batteries) needed?', options: ['To provide power when sun/wind is absent', 'To make the grid heavy', 'To increase voltage', 'It is not needed'], correctAnswer: 0 },
      { question: 'What is "Irradiance"?', options: ['Rainfall frequency', 'Power per unit area received from the Sun', 'Wind speed', 'Battery capacity'], correctAnswer: 1 },
      { question: 'A Microgrid is:', options: ['Local energy grid with control capability', 'A very small power plant', 'A grid for electric cars only', 'A broken electrical grid'], correctAnswer: 0 },
      { question: 'What happens if you have too much solar and no storage?', options: ['Battery explodes', 'Energy is wasted (curtailment)', 'The sun gets hotter', 'The grid speeds up'], correctAnswer: 1 },
      { question: 'The lab showed that wind and solar are often:', options: ['Incompatible', 'Dangerous', 'Complementary (wind blows at night)', 'Inefficient'], correctAnswer: 2 }
    ]
  },
  {
    id: 'lab-climate-impact',
    title: '🌊 Lab 7: Climate Change Impact Simulator',
    description: 'Simulate 100 years of global warming and see the effects on sea levels.',
    objective: 'Observe the correlation between CO2 and Temperature.',
    progress: 0,
    experimentSteps: [
      'Increase CO2 ppm levels from 280 to 600.',
      'Watch the Arctic ice melt and sea levels rise.',
      'Observe the "Albedo Effect" in real-time.',
      'Implement "Afforestation" to slow the curve.'
    ],
    quiz: [
      { question: 'What is the "Albedo Effect"?', options: ['A type of ocean current', 'Reflection of sunlight by ice/snow', 'Absorption of heat by trees', 'Rising sea levels'], correctAnswer: 1 },
      { question: 'What happens to Albedo as ice melts?', options: ['It increases', 'It decreases (leading to more warming)', 'Stays the same', 'Turns the ocean blue'], correctAnswer: 1 },
      { question: 'What was the pre-industrial CO2 level?', options: ['400 ppm', '100 ppm', '280 ppm', '1000 ppm'], correctAnswer: 2 },
      { question: 'Sea level rise is caused by melting land ice and:', options: ['Heavy rainfall', 'Thermal expansion of warming water', 'Increased fish population', 'Stronger ocean waves'], correctAnswer: 1 },
      { question: 'In the lab, what helped most to slow the warming trend?', options: ['Building sea walls', 'Aggressive emission cuts and reforestation', 'Moving cities inland', 'Using more air conditioning'], correctAnswer: 1 }
    ]
  },
  {
    id: 'lab-net-zero',
    title: '🏁 Lab 8: Net-Zero Strategy Builder',
    description: 'Act as a city mayor and reach Net-Zero by 2050.',
    objective: 'Balance economic growth with environmental survival.',
    progress: 0,
    experimentSteps: [
      'Set the city\'s energy policy.',
      'Invest in green public transit.',
      'Mandate "Green Roofs" and "Carbon Taxes".',
      'Monitor the "Citizen Happiness" vs. "Carbon Level" charts.'
    ],
    quiz: [
      { question: 'What is "Net-Zero"?', options: ['Zero emissions total', 'Balance between emitted and removed GHGs', 'No electricity use', 'Zero cost energy'], correctAnswer: 1 },
      { question: 'What is a "Green Roof"?', options: ['A roof covered with vegetation', 'A roof painted green', 'A roof made of solar panels only', 'A metal roof'], correctAnswer: 0 },
      { question: 'Carbon Taxes help by:', options: ['Buying more coal', 'Providing financial incentive to reduce emissions', 'Making the city richer', 'Building more highways'], correctAnswer: 1 },
      { question: 'Citizen happiness in the lab was improved by:', options: ['Better air quality and green spaces', 'Higher taxes', 'More traffic', 'Less public transit'], correctAnswer: 0 },
      { question: 'The final takeaway of the lab is:', options: ['Technology alone is enough', 'Coordination between policy and tech is key', 'It is impossible', 'Policy alone is enough'], correctAnswer: 1 }
    ]
  }
];
