export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  category: 'task' | 'milestone' | 'social';
}

export const BADGES: Badge[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `badge-${i + 1}`,
  title: [
    "Carbon Commuter", "Energy Saver", "Green Eater", "Waste Warrior",
    "Water Guardian", "Eco Scout", "Nature Lover", "Climate Hero"
  ][i % 8] + ` Rank ${Math.floor(i / 8) + 1}`,
  description: `Awarded for completing unique task #${i + 1} in your sustainability journey.`,
  icon: ['🌱', '💡', '🚲', '🥗', '💧', '♻️', '🌍', '🛡️'][i % 8],
  requirement: `Complete ${i + 1} total missions`,
  category: 'task'
}));
