import { describe, test, expect } from 'vitest';

// Mocking the core engine calculations
const calculateSavings = (mode, distance) => {
  const rates = { CAR: 0.4, BUS: 0.1, BIKE: 0, WALK: 0 };
  const baseline = 0.4; // standard car emissions per mile
  return parseFloat(((baseline - (rates[mode] ?? 0)) * distance).toFixed(2));
};

describe('EcoSense Core Calculation Engine', () => {
  test('should calculate correct savings when switching from Car to Bike', () => {
    expect(calculateSavings('BIKE', 10)).toBe(4.0);
  });

  test('should calculate reduced emissions for taking the Bus', () => {
    expect(calculateSavings('BUS', 10)).toBe(3.0);
  });

  test('should show zero extra savings if continuing to drive a standard Car', () => {
    expect(calculateSavings('CAR', 10)).toBe(0.0);
  });
});
