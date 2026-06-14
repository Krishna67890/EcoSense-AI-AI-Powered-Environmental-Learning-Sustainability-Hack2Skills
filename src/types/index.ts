export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  displayName?: string; // Kept for compatibility if needed, but fullName is preferred
  photoURL?: string;
  profileImage?: string; // Match requirement
  phoneNumber?: string;
  avatar?: string;
  onboardingCompleted: boolean;
  ecoProgress: number; // 2026 Requirement
  sustainabilityScore?: number; // Legacy support
  level: number;
  experience: number;
  totalTasksCompleted: number;
  twoFactorEnabled?: boolean;
  score?: number;
  rank?: number; // Match requirement
  reduction?: string;
  joinedAt: string;
  createdAt?: string;
  lastLogin?: string; // Match requirement
  loginCount?: number; // Match requirement
  badges?: string[];
  streak?: number;
  habits: HabitData;
  completedChallenges: string[];
  completedTasks: string[];
  moduleProgress: Record<string, number>; // moduleId -> progress percentage
  labProgress: Record<string, number>; // labId -> progress percentage
  notifications?: {
    id: string;
    message: string;
    type: 'success' | 'info' | 'achievement';
    timestamp: string;
  }[];
  lastSeen?: string;
  isOnline?: boolean;
  dietType?: string;
  primaryTransport?: string;
  housingType?: string;
  isBot?: boolean;
}

export interface HabitData {
  transportation: {
    dailyDistance: number; // km
    type: 'car' | 'bus' | 'train' | 'bike' | 'walk' | 'ev';
  };
  energy: {
    monthlyUsage: number; // kWh
    renewableSource: boolean;
  };
  diet: 'meat-heavy' | 'balanced' | 'vegetarian' | 'vegan';
  flights: number; // per year
  waste: 'low' | 'average' | 'high';
  water: number; // liters per day
  householdSize: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: 'daily' | 'weekly' | 'milestone';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: keyof HabitData | 'general' | 'community' | 'battle';
  type: 'daily' | 'weekly' | 'monthly' | 'community' | 'ai';
  icon: string;
  tasks: Task[];
  difficulty: 'easy' | 'medium' | 'hard';
  reward?: {
    xp: number;
    coins?: number;
    badge?: string;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface EcoModule {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: string;
  tasks: Task[];
  quiz?: QuizQuestion[];
}

export interface EcoLab {
  id: string;
  title: string;
  description: string;
  experimentSteps: string[];
  objective: string;
  progress: number;
  tasks?: Task[];
  quiz?: QuizQuestion[];
}

export interface CarbonFootprint {
  id: string;
  userId: string;
  timestamp: string;
  totalEmissions: number; // kg CO2e
  breakdown: {
    transportation: number;
    energy: number;
    food: number;
    flights: number;
    waste: number;
    water: number;
  };
}

export interface ActionPlanItem {
  id: string;
  week: number;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  completed: boolean;
  source: 'ai' | 'manual' | 'challenge';
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  type: 'achievement' | 'discussion' | 'tip';
  likes: string[];
  comments: {
    id: string;
    userId: string;
    userName: string;
    content: string;
    timestamp: string;
  }[];
  timestamp: string;
  image?: string;
  achievementId?: string;
  tags?: string[];
  isBot?: boolean;
}
