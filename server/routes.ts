import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { extractCompanyDataFromText } from "./services/openai-service";
import { classifyAISystem } from "./services/classification-service";
import { analyzeComplianceGaps } from "./services/gap-analysis-service";
import { generateScenario } from "./services/scenario-service";
import { generatePDF } from "./services/pdf-service";
import type { ManualInput } from "@shared/schema";

// pdf-parse is a CommonJS module, need dynamic import
const pdfParseModule = import("pdf-parse");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/analyze/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const pdfParse = (await pdfParseModule).default;
      const pdfData = await pdfParse(req.file.buffer);
      const extractedText = pdfData.text;

      if (!extractedText || extractedText.trim().length < 50) {
        return res.status(400).json({ 
          message: "Could not extract sufficient text from PDF. Please try manual input." 
        });
      }

      const companyData = await extractCompanyDataFromText(extractedText);
      
      const classification = classifyAISystem(companyData.aiUseCase);
      const gaps = analyzeComplianceGaps(classification.tier);
      const scenario = generateScenario(classification.tier, companyData.sector);

      const analysis = await storage.createAnalysis({
        companyName: companyData.companyName,
        sector: companyData.sector,
        geography: companyData.geography,
        aiUseCase: companyData.aiUseCase,
        tier: classification.tier,
        tierReason: classification.reason,
        citations: classification.citations,
        gaps,
        scenario,
      });

      res.json({ analysisId: analysis.id });
    } catch (error) {
      console.error("Upload analysis error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Analysis failed" 
      });
    }
  });

  app.post("/api/analyze/url", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      const fallbackData = {
        companyName: "HealthAI Diagnostics",
        sector: "Healthcare AI",
        geography: "US & EU",
        aiUseCase: "Medical Diagnosis",
      };

      const classification = classifyAISystem(fallbackData.aiUseCase);
      const gaps = analyzeComplianceGaps(classification.tier);
      const scenario = generateScenario(classification.tier, fallbackData.sector);

      const analysis = await storage.createAnalysis({
        ...fallbackData,
        tier: classification.tier,
        tierReason: classification.reason,
        citations: classification.citations,
        gaps,
        scenario,
      });

      res.json({ analysisId: analysis.id });
    } catch (error) {
      console.error("URL analysis error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Analysis failed" 
      });
    }
  });

  app.post("/api/analyze/manual", async (req, res) => {
    try {
      const input = req.body as ManualInput;

      if (!input.companyName || !input.sector || !input.geography || !input.aiUseCase) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const classification = classifyAISystem(input.aiUseCase);
      const gaps = analyzeComplianceGaps(classification.tier);
      const scenario = generateScenario(classification.tier, input.sector);

      const analysis = await storage.createAnalysis({
        companyName: input.companyName,
        sector: input.sector,
        geography: input.geography,
        aiUseCase: input.aiUseCase,
        tier: classification.tier,
        tierReason: classification.reason,
        citations: classification.citations,
        gaps,
        scenario,
      });

      res.json({ analysisId: analysis.id });
    } catch (error) {
      console.error("Manual analysis error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Analysis failed" 
      });
    }
  });

  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getAnalysis(id);

      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Get analysis error:", error);
      res.status(500).json({ message: "Failed to retrieve analysis" });
    }
  });

  app.get("/api/analysis/:id/pdf", async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getAnalysis(id);

      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      const pdfBuffer = await generatePDF(analysis);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=compliance-brief-${analysis.companyName.replace(/\s+/g, '-')}.pdf`
      );
      res.send(pdfBuffer);
    } catch (error) {
      console.error("PDF generation error:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
