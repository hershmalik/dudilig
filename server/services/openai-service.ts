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
  const prompt = `You are an expert analyst extracting key information from startup pitch decks for compliance analysis.

Extract the following information from the provided text. Return ONLY valid JSON, no other text.

Required fields:
- companyName: The name of the company
- sector: Primary business sector (e.g., "Healthcare AI", "Financial Services", "Education Technology")
- geography: Primary market/geography (e.g., "EU", "US", "US & EU", "Global")
- aiUseCase: Specific AI use case (e.g., "Medical Diagnosis", "Credit Scoring", "Recruitment Screening", "Content Moderation")
- productClaims: Array of key product claims or capabilities

Text to analyze:
${text.substring(0, 4000)}

Return JSON only:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
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
    throw new Error("Failed to extract company information from document");
  }
}
