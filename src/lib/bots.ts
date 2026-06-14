import { UserProfile, CommunityPost } from '../types';

export const BOT_NAMES = [
  "EcoBot-Alpha", "GreenGuardian", "SolarSage", "WindWarrior", "TerraTrustee",
  "AquaAlly", "LeafLover", "ZeroWasteBot", "CarbonCrusher", "NatureNut",
  "ForestFriend", "OceanOracle", "RecycleRobot", "SustainableSam", "PurePlanet",
  "EcoEnforcer", "GreenGhost", "BioBuddy", "CleanCrawler", "EarthEcho",
  "SkyScout", "RiverRunner", "PeakProtector", "SeedSower", "BloomBot",
  "RootRover", "OzoneOxygen", "TideTracker", "SolarSpark", "WindWhisper",
  "EcoExpert", "GreenGenius", "NatureNerd", "WildWatcher", "TreeTitan",
  "PetalPilot", "GardenGlow", "FieldFinder", "StreamStriker", "MarshMinder",
  "CoastCaretaker", "IslandIdol", "ValleyVanguard", "HillHelper", "PlainPatrol",
  "DesertDefender", "ArcticAce", "JungleJester", "CaveCoach", "CoralCommander"
];

export const generateBots = (): UserProfile[] => {
  return BOT_NAMES.map((name, index) => ({
    uid: `bot-${index}`,
    email: `${name.toLowerCase()}@ecosense.ai`,
    fullName: name,
    displayName: name,
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
    profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
    ecoProgress: 50 + Math.floor(Math.random() * 500),
    level: Math.floor(Math.random() * 50) + 1,
    experience: Math.floor(Math.random() * 50000),
    totalTasksCompleted: Math.floor(Math.random() * 200),
    badges: ['Eco Bot', 'Verified Bot'],
    joinedAt: 'January 1, 2024',
    isOnline: Math.random() > 0.3,
    lastSeen: new Date().toISOString(),
    isBot: true
  } as any));
};

export const BOT_COMMENTS = [
  "Great job on that! Every small action counts. 🌿",
  "This is exactly what the community needs more of. Keep it up!",
  "I've been trying something similar and it really works! ⚡",
  "Sustainability is a journey, and you're leading the way!",
  "Adding this to my daily routine. Thanks for the tip! ♻️",
  "Incredible progress! Let's reach those goals together.",
  "EcoSense AI is proud of your commitment! 🤖",
  "Did you know that small changes like this can save tons of CO2 annually?",
  "Let's keep the momentum going! #EcoWarrior",
  "Amazing! I'll share this with other bots in the network. 🌐"
];

export const generateBotPosts = (count: number): CommunityPost[] => {
  const posts: CommunityPost[] = [];
  for (let i = 0; i < count; i++) {
    const bot = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
    posts.push({
      id: `bot-post-${i}`,
      userId: `bot-${i}`,
      userName: bot,
      userImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${bot}`,
      content: `Hello Eco-Warriors! I just completed a major sustainability milestone. Remember: ${BOT_COMMENTS[Math.floor(Math.random() * BOT_COMMENTS.length)]}`,
      type: Math.random() > 0.5 ? 'achievement' : 'tip',
      likes: Array.from({ length: Math.floor(Math.random() * 20) }, (_, j) => `bot-${j}`),
      comments: [],
      timestamp: new Date(Date.now() - Math.random() * 10000000).toISOString(),
      tags: ['#EcoBot', '#Sustainability', '#AI'],
      isBot: true
    } as any);
  }
  return posts;
};
