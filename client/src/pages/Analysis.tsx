import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { AnalysisResults } from "@/components/AnalysisResults";
import type { AnalysisResult } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Analysis() {
  const [, params] = useRoute("/analysis/:id");
  const analysisId = params?.id;
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const { data: analysis, isLoading, error } = useQuery<AnalysisResult>({
    queryKey: ["/api/analysis", analysisId],
    enabled: !!analysisId,
  });

  const handleExportPDF = async () => {
    if (!analysisId) return;
    
    setIsExporting(true);
    try {
      const response = await fetch(`/api/analysis/${analysisId}/pdf`);
      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }
      
      const contentType = response.headers.get("content-type");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Determine file extension based on content type
      const isHTML = contentType?.includes("text/html");
      const fileExt = isHTML ? "html" : "pdf";
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `compliance-brief-${analysisId}.${fileExt}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: isHTML ? "HTML Brief Downloaded" : "PDF Downloaded",
        description: isHTML 
          ? "Your compliance brief has been downloaded as HTML. You can open it and print to PDF from your browser."
          : "Your compliance brief has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!analysisId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Invalid Analysis ID</h1>
          <p className="text-muted-foreground mt-2">No analysis ID provided</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loading-spinner" />
          <p className="text-sm text-muted-foreground">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-destructive">Error Loading Analysis</h1>
          <p className="text-muted-foreground mt-2">
            {error instanceof Error ? error.message : "Failed to load analysis"}
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Analysis Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The requested analysis could not be found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <a
            href="/"
            className="text-sm text-primary hover:underline"
            data-testid="link-back-home"
          >
            ← Back to Home
          </a>
        </div>
        
        <AnalysisResults 
          result={analysis} 
          onExportPDF={handleExportPDF}
          isExporting={isExporting}
        />
      </div>
    </div>
  );
}
