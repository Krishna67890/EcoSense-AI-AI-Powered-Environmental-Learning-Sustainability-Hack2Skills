import { describe, it, expect } from 'vitest';
import { generateBots, BOT_NAMES } from './bots';

describe('Bots Utility', () => {
  it('should generate the correct number of bots based on BOT_NAMES', () => {
    const bots = generateBots();
    expect(bots.length).toBe(BOT_NAMES.length);
  });

  it('should mark all generated bots with isBot: true', () => {
    const bots = generateBots();
    bots.forEach(bot => {
      expect(bot.isBot).toBe(true);
    });
  });

  it('should assign a unique UID to each bot', () => {
    const bots = generateBots();
    const uids = bots.map(b => b.uid);
    const uniqueUids = new Set(uids);
    expect(uniqueUids.size).toBe(uids.length);
  });

  it('should generate bots with valid profile images from Dicebear', () => {
    const bots = generateBots();
    bots.forEach(bot => {
      expect(bot.profileImage).toContain('https://api.dicebear.com/7.x/bottts/svg');
    });
  });
});
