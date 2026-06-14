import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiKey = () => String(import.meta.env.VITE_GEMINI_API_KEY || '').trim();

// Lazy instance to prevent top-level crashes
let genAI: GoogleGenerativeAI | null = null;

export const getModel = () => {
  const key = getGeminiKey();
  if (!key || key === 'undefined' || key.length < 10) return null;

  if (!genAI) genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel(
    { model: "gemini-1.5-flash" },
    { apiVersion: "v1" }
  );
};

export const analyzeProductImage = async (imageBuffer: string) => {
  const model = getModel();
  if (!model) throw new Error("Gemini API key is not configured");

  const prompt = `
    Context: You are the "EcoSense AI" Product Sustainability Expert.
    Task: Deeply analyze the product image.

    CRITICAL INSTRUCTIONS:
    1. Actively look for BARCODES, INGREDIENTS LISTS, and NUTRITION LABELS in the image.
    2. If a barcode is present, use it as the primary identifier.
    3. If an ingredients list is present, analyze each component for environmental impact (e.g., palm oil, synthetic chemicals, carbon-heavy processing).
    4. If the image is blurry or missing these details, provide the best estimate based on visible branding.

    Output Requirements:
    - Identify the product name accurately.
    - Estimate Carbon Footprint (kg CO2e) per unit/100g.
    - Rate from A (Sustainable/Eco-friendly) to E (High Impact/Non-recyclable).
    - List 3 specific sustainable alternatives.
    - List 3 Pros (Eco-strengths) and 3 Cons (Eco-weaknesses).
    - Provide a breakdown of CO2 sources (e.g., "Manufacturing: 40%, Transport: 30%, Usage: 30%").

    Response Format: Strictly valid JSON:
    {
      "productName": string,
      "footprint": number,
      "rating": "A" | "B" | "C" | "D" | "E",
      "alternatives": string[],
      "pros": string[],
      "cons": string[],
      "summary": string,
      "breakdown": { "manufacturing": number, "transport": number, "usage": number }
    }
  `;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBuffer.split(',')[1],
          mimeType: "image/jpeg"
        }
      }
    ]);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch (error) {
    console.error("Product Analysis Error:", error);
    throw error;
  }
};

export const analyzeElectricityBill = async (imageBuffer: string) => {
  const model = getModel();
  if (!model) throw new Error("Gemini API key is not configured");

  const prompt = `
    Context: You are the "EcoSense AI" Energy Auditor.
    Task: Extract data from this electricity bill image.

    Instructions:
    1. Identify monthly usage in kWh.
    2. Identify total cost and currency.
    3. Calculate CO2 emissions based on usage (global average 0.475 kg/kWh if not specified).
    4. Provide 3 specific energy-saving tips based on the bill scale.

    Response Format: Strictly valid JSON:
    {
      "usageKwh": number,
      "cost": number,
      "currency": string,
      "emissions": number,
      "period": string,
      "tips": string[],
      "analysis": string
    }
  `;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBuffer.split(',')[1],
          mimeType: "image/jpeg"
        }
      }
    ]);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch (error) {
    console.error("Bill Analysis Error:", error);
    throw error;
  }
};

export const getSustainabilityAnalysis = async (userData: any) => {
  const model = getModel();
  if (!model) {
    return {
      hotspots: ["Energy", "Transport"],
      behavioralAnalysis: "Gemini API not configured.",
      currentImpact: "Unknown",
      recommendations: [],
      potentialScore: 70
    };
  }

  const prompt = `
    Context: You are the "EcoSense AI" Core Intelligence Engine.
    User Data: ${JSON.stringify(userData)}

    Task: Perform a deep-dive sustainability audit.
    1. Identify exact emission hotspots (Transportation, Energy, Diet, etc.) using global average CO2 factors.
    2. Analyze behavioral patterns and suggest the "Highest Impact" change.
    3. Provide an Environmental Impact Assessment (e.g., current annual CO2e tonnes).
    4. Recommend 3 specific, measurable sustainability missions from our database (mention Categories like 'transportation' or 'diet').
    5. Calculate a "Potential Score" if recommendations are followed.

    Response Format: Strictly valid JSON with keys:
    {
      "hotspots": string[],
      "behavioralAnalysis": string,
      "currentImpact": string,
      "recommendations": { "title": string, "impact": "Low" | "Medium" | "High", "description": string }[],
      "potentialScore": number
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Improved JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text.replace(/```json|```/gi, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Audit Error:", error);
    return {
      hotspots: ["Energy", "Transport"],
      behavioralAnalysis: "Unable to analyze currently.",
      currentImpact: "Unknown",
      recommendations: [],
      potentialScore: 70
    };
  }
};

export const generateActionPlan = async (userProfile: any) => {
  const model = getModel();
  if (!model) {
    return [
      {
        week: 1,
        title: "Gemini Not Configured",
        tasks: [
          { id: "ai_no_key_1", text: "Configure Gemini API key in Vercel", impact: "High", icon: "Zap" }
        ]
      }
    ];
  }

  const prompt = `
    Context: You are the "EcoSense AI" Sustainability Coach.
    User Profile: ${JSON.stringify(userProfile)}

    Task: Generate a personalized 4-week Carbon Footprint Reduction Action Plan.
    The plan must be specifically designed for the [Challenge 3] Carbon Footprint Awareness Platform.

    CHALLENGE OBJECTIVE: Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

    Tailor the plan to their specific habits:
    - Current Diet: ${userProfile?.dietType || 'Unknown'}
    - Transport: ${userProfile?.primaryTransport || 'Unknown'}
    - Living: ${userProfile?.housingType || 'Unknown'}

    Response Format: Strictly valid JSON with this structure:
    [
      {
        "week": 1,
        "title": "String (Thematic title for the week)",
        "tasks": [
          {
            "id": "String (unique e.g. 'ai_task_1')",
            "text": "String (Detailed task description)",
            "impact": "High" | "Medium" | "Low",
            "icon": "Car" | "Map" | "Zap" | "Flame" | "Utensils" | "Leaf" | "Trash",
            "challengeFocus": "How this relates to tracking or simple actions"
          }
        ]
      },
      ... up to week 4
    ]

    Constraints:
    - 3 tasks per week.
    - Icons must ONLY be from: Car, Map, Zap, Flame, Utensils, Leaf, Trash.
    - Tasks must be "Simple Actions" that are easy to log but have high impact.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Improved JSON extraction
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text.replace(/```json|```/gi, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Plan Generation Error:", error);
    // Fallback plan if AI fails
    return [
      {
        week: 1,
        title: "Sustainability Kickstart",
        tasks: [
          { id: "ai_fallback_1", text: "Audit home energy leaks", impact: "High", icon: "Zap" },
          { id: "ai_fallback_2", text: "Switch to a plant-based day", impact: "Medium", icon: "Utensils" },
          { id: "ai_fallback_3", text: "Walk for short commutes", impact: "Medium", icon: "Car" }
        ]
      }
    ];
  }
};
