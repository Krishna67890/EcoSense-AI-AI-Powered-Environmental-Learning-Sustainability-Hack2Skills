import { describe, it, expect } from 'vitest';
import { CHALLENGES, MODULES, LABS, COMMUNITY_CHALLENGES, BADGES } from './data';

describe('Data Integrity', () => {
  describe('CHALLENGES', () => {
    it('should have unique IDs for all challenges', () => {
      const ids = CHALLENGES.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid points and rewards', () => {
      CHALLENGES.forEach(challenge => {
        expect(challenge.points).toBeGreaterThan(0);
        expect(challenge.reward.xp).toBeGreaterThanOrEqual(challenge.points);
      });
    });

    it('should have at least one task for each challenge', () => {
      CHALLENGES.forEach(challenge => {
        expect(challenge.tasks.length).toBeGreaterThan(0);
      });
    });
  });

  describe('MODULES', () => {
    it('should have unique IDs for all modules', () => {
      const ids = MODULES.map(m => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have exactly 10 quiz questions per module', () => {
      MODULES.forEach(module => {
        expect(module.quiz.length).toBe(10);
      });
    });

    it('should have valid correct answer indices for all quiz questions', () => {
      MODULES.forEach(module => {
        module.quiz.forEach(q => {
          expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
          expect(q.correctAnswer).toBeLessThan(q.options.length);
        });
      });
    });
  });

  describe('LABS', () => {
    it('should have unique IDs for all labs', () => {
      const ids = LABS.map(l => l.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have exactly 5 quiz questions per lab', () => {
      LABS.forEach(lab => {
        expect(lab.quiz.length).toBe(5);
      });
    });

    it('should have at least 4 experiment steps per lab', () => {
      LABS.forEach(lab => {
        expect(lab.experimentSteps.length).toBeGreaterThanOrEqual(4);
      });
    });
  });

  describe('COMMUNITY_CHALLENGES', () => {
    it('should have valid goals and current values', () => {
      COMMUNITY_CHALLENGES.forEach(cc => {
        expect(cc.goal).toBeGreaterThan(0);
        expect(cc.current).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('BADGES', () => {
    it('should have unique IDs for all badges', () => {
      const ids = BADGES.map(b => b.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
