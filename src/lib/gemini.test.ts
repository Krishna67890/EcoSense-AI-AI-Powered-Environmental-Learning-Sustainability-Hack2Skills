import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getModel, analyzeProductImage, analyzeElectricityBill, getSustainabilityAnalysis, generateActionPlan } from './gemini';

// Mocking the GoogleGenerativeAI library
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => {
      return {
        getGenerativeModel: vi.fn().mockReturnValue({
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: vi.fn().mockReturnValue('{"productName": "Eco Bottle", "footprint": 0.5, "rating": "A", "alternatives": ["Glass"], "pros": ["Eco"], "cons": ["None"], "summary": "Good"}')
            }
          })
        })
      };
    })
  };
});

describe('Gemini Service', () => {
  const originalEnv = import.meta.env;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('getModel should return null if API key is missing', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    const model = getModel();
    expect(model).toBeNull();
  });

  it('analyzeProductImage should parse JSON response correctly', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'valid_key_long_enough');
    const result = await analyzeProductImage('data:image/jpeg;base64,mockdata');
    expect(result.productName).toBe('Eco Bottle');
    expect(result.footprint).toBe(0.5);
    expect(result.rating).toBe('A');
  });

  it('getSustainabilityAnalysis should return fallback if model is null', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    const result = await getSustainabilityAnalysis({});
    expect(result.hotspots).toEqual(["Energy", "Transport"]);
    expect(result.behavioralAnalysis).toBe("Gemini API not configured.");
  });
});
