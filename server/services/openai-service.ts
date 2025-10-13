import OpenAI from "openai";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export interface ExtractedCompanyData {
  companyName: string;
  sector: string;
  geography: string;
  aiUseCase: string;
  productClaims: string[];
}

export async function extractCompanyDataFromText(text: string): Promise<ExtractedCompanyData> {
  // Clean text: remove unicode emojis and special characters that can cause API issues
  const cleanText = text
    .replace(/[^\x00-\x7F]/g, ' ')   // Replace all non-ASCII characters with space
    .replace(/\s+/g, ' ')             // Normalize whitespace
    .trim();

  const prompt = `You are an expert analyst extracting key information from startup pitch decks for compliance analysis.

Extract the following information from the provided text. Return ONLY valid JSON, no other text.

Required fields:
- companyName: The name of the company
- sector: Primary business sector (e.g., "Healthcare AI", "Financial Services", "Education Technology")
- geography: Primary market/geography (e.g., "EU", "US", "US & EU", "Global")
- aiUseCase: Specific AI use case (e.g., "Medical Diagnosis", "Credit Scoring", "Recruitment Screening", "Content Moderation")
- productClaims: Array of key product claims or capabilities

Text to analyze:
${cleanText.substring(0, 4000)}

Return JSON only:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a precise data extraction assistant. Return only valid JSON, no markdown or additional text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error("Empty AI response. Full response:", JSON.stringify(response));
      throw new Error("No response from AI");
    }

    const extracted = JSON.parse(content);
    
    return {
      companyName: extracted.companyName || "Unknown Company",
      sector: extracted.sector || "Technology",
      geography: extracted.geography || "Global",
      aiUseCase: extracted.aiUseCase || "Other",
      productClaims: extracted.productClaims || [],
    };
  } catch (error) {
    console.error("Error extracting company data:", error);
    
    // Fallback: Try to extract data using pattern matching
    console.log("Attempting fallback extraction with pattern matching...");
    try {
      const fallbackData = extractWithPatterns(text);
      if (fallbackData) {
        console.log("Successfully extracted data with fallback method:", fallbackData);
        return fallbackData;
      }
    } catch (fallbackError) {
      console.error("Fallback extraction also failed:", fallbackError);
    }
    
    throw new Error("Failed to extract company information from document");
  }
}

function extractWithPatterns(text: string): ExtractedCompanyData | null {
  // Extract company name (look for patterns like "COMPANY" followed by name)
  const companyMatch = text.match(/(?:COMPANY|Company Name)[:\s]+([A-Za-z0-9\s&.,]+?)(?:\n|SECTOR|Founded|$)/i);
  
  // Extract sector (look for patterns like "SECTOR" or "Healthcare AI")
  const sectorMatch = text.match(/(?:SECTOR|Industry|Vertical)[:\s]+([A-Za-z\s/]+?)(?:\n|FOUNDED|Geography|$)/i) ||
                      text.match(/(Healthcare AI|FinTech|EdTech|Financial Services|Healthcare|AI\/ML)/i);
  
  // Extract geography (look for US, EU, etc.)
  const geoMatch = text.match(/(?:GEOGRAPHY|Geography|Markets?|Regions?)[:\s]+([A-Za-z\s&,]+?)(?:\n|AI USE CASE|$)/i) ||
                   text.match(/((?:US|EU|United States|European Union)(?:\s*[&,]\s*(?:US|EU|United States|European Union))?)/i);
  
  // Extract AI use case
  const useCaseMatch = text.match(/(?:AI USE CASE|Use Case|Technology)[:\s]+([A-Za-z\s\-/]+?)(?:\n|MEDICAL|Product|$)/i) ||
                       text.match(/(Medical Diagnosis|Credit Scoring|Recruitment|Content Moderation|Image Analysis|Computer [Vv]ision)/i);
  
  if (companyMatch || sectorMatch || useCaseMatch) {
    return {
      companyName: companyMatch?.[1]?.trim() || "Unknown Company",
      sector: sectorMatch?.[1]?.trim() || "Technology",
      geography: geoMatch?.[1]?.trim() || "Global",
      aiUseCase: useCaseMatch?.[1]?.trim() || "Other AI Application",
      productClaims: []
    };
  }
  
  return null;
}
