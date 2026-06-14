import { describe, test, expect } from 'vitest';

const plans = [
  { id: 'free', name: 'Eco Explorer', price: 0, features: ['Tracking', 'Daily Tips'] },
  { id: 'premium', name: 'Sustainability Titan', price: 12, features: ['Digital Twin', 'Predictive Analytics'] }
];

describe('Investment Plans Content & Structure', () => {
  test('Eco Explorer tier must be free', () => {
    const freePlan = plans.find(p => p.id === 'free');
    expect(freePlan.price).toBe(0);
  });

  test('Sustainability Titan tier must contain premium features', () => {
    const premiumPlan = plans.find(p => p.id === 'premium');
    expect(premiumPlan.features).toContain('Digital Twin');
    expect(premiumPlan.price).toBe(12);
  });
});
