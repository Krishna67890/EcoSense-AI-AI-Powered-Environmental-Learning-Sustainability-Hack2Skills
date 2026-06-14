export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  category: 'module' | 'lab' | 'mission' | 'milestone';
  taskId?: string; // Links to module.id or lab.id
}

const icons = ['🌱', '💡', '🚲', '🥗', '💧', '♻️', '🌍', '🛡️', '⚡', '🏹', '💎', '🔥', '🌊', '🌲', '☀️', '🌕'];

export const BADGES: Badge[] = Array.from({ length: 50 }).map((_, i) => {
  const isModule = i < 25;
  const isLab = i >= 25 && i < 45;

  let category: Badge['category'] = 'mission';
  let taskId: string | undefined;
  let title = "";
  let requirement = "";

  if (isModule) {
    category = 'module';
    taskId = `mod-${i + 1}`; // Placeholder IDs matching data.ts structure
    title = `Scholar ${i + 1}`;
    requirement = `Complete Knowledge Module #${i + 1}`;
  } else if (isLab) {
    category = 'lab';
    taskId = `lab-${i - 24}`;
    title = `Scientist ${i - 24}`;
    requirement = `Solve Eco Lab #${i - 24}`;
  } else {
    category = 'milestone';
    title = `Eco Legend ${i - 44}`;
    requirement = `Reach XP Milestone ${ (i - 44) * 5000}`;
  }

  // Override specific known titles from data.ts if needed
  const specificTitles = [
    "Climate Scholar", "Energy Expert", "Waste Manager", "Transport Pro",
    "Water Saver", "Green Architect", "Nutritionist", "Footprint Specialist"
  ];

  if (i < specificTitles.length) {
    title = specificTitles[i];
  }

  return {
    id: `badge-${i + 1}`,
    title,
    description: `A prestigious badge for your dedication to ${title.toLowerCase()}.`,
    icon: icons[i % icons.length],
    requirement,
    category,
    taskId
  };
});
