import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Function to analyze food safety from image
export async function analyzeFoodSafety(imageOrText: string, petType: string) {
  try {
    // Handle text-only query if not an image
    if (!imageOrText.startsWith('data:image')) {
      return await analyzeTextQuery(imageOrText, petType);
    }

    // Handle image analysis
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Convert base64 image to proper format
    const imageData = imageOrText.split(',')[1];
    
    const prompt = `Analyze this food image and determine if it's safe for a ${petType}. 
    Provide your response in the following format:

    1. Food Name:
    [Name of the food item]

    2. Safety Level:
    [Safe/Unsafe/Caution]

    3. Detailed Explanation:
    [Comprehensive explanation about why it's safe or unsafe for the pet]

    4. Nutritional Information (per 100g):
    - Protein: [number]%
    - Fats: [number]%
    - Carbohydrates: [number]%
    - Fiber: [number]%
    - Calories: [number] kcal
    - Vitamins & Minerals: [List key nutrients separated by commas]

    5. Health Benefits:
    [List any health benefits for the pet]

    6. Risks & Concerns:
    [List any potential risks or concerns]

    7. Safe Alternatives:
    [If unsafe or requires caution, list safe alternatives]

    Please ensure all nutritional values are provided as numbers with appropriate units.`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    return parseAnalysisResult(text);
  } catch (error) {
    console.error('Error in analyzeFoodSafety:', error);
    throw error;
  }
}

// Function to handle text-only queries
async function analyzeTextQuery(question: string, petType: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const result = await model.generateContent([
      {
        text: `You are a pet diet expert. Answer this question about pet food safety: "${question}". 
        Analyze if it's safe for ${petType}s. Include nutritional benefits or concerns. 
        If unsafe, suggest safe alternatives.`
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    return {
      foodName: "Text Query",
      safetyLevel: determineSafetyLevel(text),
      explanation: text,
      alternatives: extractAlternatives(text),
    };
  } catch (error) {
    console.error('Error in analyzeTextQuery:', error);
    throw error;
  }
}

// Helper function to determine safety level from text
function determineSafetyLevel(text: string): 'Safe' | 'Caution' | 'Unsafe' | 'Error' {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('safe') && !lowerText.includes('unsafe') && !lowerText.includes('not safe')) {
    return 'Safe';
  } else if (lowerText.includes('caution') || lowerText.includes('moderate') || lowerText.includes('careful')) {
    return 'Caution';
  } else if (lowerText.includes('unsafe') || lowerText.includes('not safe') || lowerText.includes('toxic') || lowerText.includes('dangerous')) {
    return 'Unsafe';
  }
  return 'Caution';
}

// Helper function to extract alternatives from text
function extractAlternatives(text: string): string[] {
  const alternatives: string[] = [];
  const lines = text.split('\n');
  let inAlternativesSection = false;

  for (const line of lines) {
    if (line.toLowerCase().includes('alternative') || line.toLowerCase().includes('instead')) {
      inAlternativesSection = true;
      continue;
    }
    if (inAlternativesSection && line.trim()) {
      const alt = line.replace(/^[-•*]\s*/, '').trim();
      if (alt) alternatives.push(alt);
    }
  }

  return alternatives;
}

interface NutritionalInfo {
  protein: number;
  fats: number;
  carbs: number;
  fiber: number;
  calories: number;
  vitamins: string[];
}

interface ParsedAnalysis {
  foodName: string;
  safetyLevel: 'Safe' | 'Caution' | 'Unsafe' | 'Error';
  explanation: string;
  nutrition: NutritionalInfo;
  healthBenefits: string[];
  risks: string[];
  alternatives: string[];
}

function parseAnalysisResult(text: string): ParsedAnalysis {
  const sections = text.split('\n\n');
  let foodName = 'Unknown Food';
  let safetyLevel: 'Safe' | 'Caution' | 'Unsafe' | 'Error' = 'Error';
  let explanation = '';
  let nutrition: NutritionalInfo = {
    protein: 0,
    fats: 0,
    carbs: 0,
    fiber: 0,
    calories: 0,
    vitamins: []
  };
  let healthBenefits: string[] = [];
  let risks: string[] = [];
  let alternatives: string[] = [];

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const header = lines[0].toLowerCase();

    if (header.includes('food name')) {
      foodName = lines[1]?.trim() || foodName;
    } else if (header.includes('safety level')) {
      safetyLevel = determineSafetyLevel(lines[1] || '');
    } else if (header.includes('explanation')) {
      explanation = lines.slice(1).join('\n').trim();
    } else if (header.includes('nutritional information')) {
      lines.slice(1).forEach(line => {
        const [key, value] = line.split(':').map(s => s.trim());
        if (!key || !value) return;

        const lowerKey = key.toLowerCase();
        const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));

        if (lowerKey.includes('protein')) {
          nutrition.protein = numericValue || 0;
        } else if (lowerKey.includes('fat')) {
          nutrition.fats = numericValue || 0;
        } else if (lowerKey.includes('carb')) {
          nutrition.carbs = numericValue || 0;
        } else if (lowerKey.includes('fiber')) {
          nutrition.fiber = numericValue || 0;
        } else if (lowerKey.includes('calor')) {
          nutrition.calories = numericValue || 0;
        } else if (lowerKey.includes('vitamin')) {
          nutrition.vitamins = value.split(/[,&]/)
            .map(v => v.trim())
            .filter(v => v.length > 0);
        }
      });
    } else if (header.includes('health benefits')) {
      healthBenefits = lines.slice(1)
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(Boolean);
    } else if (header.includes('risks')) {
      risks = lines.slice(1)
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(Boolean);
    } else if (header.includes('alternatives')) {
      alternatives = lines.slice(1)
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(Boolean);
    }
  }

  return {
    foodName,
    safetyLevel,
    explanation,
    nutrition,
    healthBenefits,
    risks,
    alternatives
  };
} 