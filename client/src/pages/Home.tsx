import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { UploadDropzone } from "@/components/UploadDropzone";
import { ManualInputForm } from "@/components/ManualInputForm";
import { AnalysisResults } from "@/components/AnalysisResults";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, FileInput } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AnalysisResult, ManualInput } from "@shared/schema";

export default function Home() {
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const { toast } = useToast();

  const { data: analysisResult, isLoading: isLoadingResult } = useQuery<AnalysisResult>({
    queryKey: ["/api/analysis", currentAnalysisId],
    enabled: !!currentAnalysisId,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/analyze/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }
      return response.json();
    },
    onSuccess: (data: { analysisId: string }) => {
      setCurrentAnalysisId(data.analysisId);
      queryClient.invalidateQueries({ queryKey: ["/api/analysis"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const urlMutation = useMutation({
    mutationFn: async (url: string) => {
      return apiRequest("POST", "/api/analyze/url", { url });
    },
    onSuccess: (data: { analysisId: string }) => {
      setCurrentAnalysisId(data.analysisId);
      queryClient.invalidateQueries({ queryKey: ["/api/analysis"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const manualMutation = useMutation({
    mutationFn: async (data: ManualInput) => {
      return apiRequest("POST", "/api/analyze/manual", data);
    },
    onSuccess: (data: { analysisId: string }) => {
      setCurrentAnalysisId(data.analysisId);
      setShowManualInput(false);
      queryClient.invalidateQueries({ queryKey: ["/api/analysis"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/analysis/${currentAnalysisId}/pdf`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("PDF generation failed");
      
      const contentType = response.headers.get("content-type");
      const isHTML = contentType?.includes("text/html");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileExt = isHTML ? "html" : "pdf";
      a.download = `compliance-brief-${analysisResult?.companyName || "analysis"}.${fileExt}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { isHTML };
    },
    onSuccess: (data) => {
      toast({
        title: data.isHTML ? "HTML Brief Downloaded" : "PDF Downloaded",
        description: data.isHTML 
          ? "Your compliance brief has been downloaded as HTML. You can open it and print to PDF from your browser."
          : "Your compliance brief has been downloaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Export Failed",
        description: "Could not generate PDF",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    uploadMutation.mutate(file);
  };

  const handleUrlSubmit = (url: string) => {
    urlMutation.mutate(url);
  };

  const handleManualSubmit = (data: ManualInput) => {
    manualMutation.mutate(data);
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysisId(null);
    setShowManualInput(false);
  };

  const isAnalyzing = uploadMutation.isPending || urlMutation.isPending || manualMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Dudilig</h1>
            <p className="text-sm text-muted-foreground">AI Compliance Analysis for VC Due Diligence</p>
          </div>
          {analysisResult && (
            <Button onClick={handleNewAnalysis} variant="outline" data-testid="button-new-analysis">
              New Analysis
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!currentAnalysisId && !isAnalyzing && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
                From Deck to Deal Terms
              </h2>
              <p className="text-lg text-muted-foreground">
                Turn startup pitch decks into cited EU AI Act risk briefs with deal-term impact scenarios in under 3 minutes
              </p>
            </div>

            <UploadDropzone
              onFileSelect={handleFileSelect}
              onUrlSubmit={handleUrlSubmit}
              isAnalyzing={isAnalyzing}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">or</span>
              </div>
            </div>

            {!showManualInput ? (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowManualInput(true)}
                  className="gap-2"
                  data-testid="button-show-manual"
                >
                  <FileInput className="w-4 h-4" />
                  Enter Company Details Manually
                </Button>
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Manual Input</CardTitle>
                </CardHeader>
                <CardContent>
                  <ManualInputForm
                    onSubmit={handleManualSubmit}
                    isSubmitting={isAnalyzing}
                  />
                </CardContent>
              </Card>
            )}

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 max-w-3xl mx-auto">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      How it works
                    </p>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                      <li>Upload a pitch deck or provide company details</li>
                      <li>AI extracts key information and classifies EU AI Act tier</li>
                      <li>Deterministic rules identify compliance gaps with citations</li>
                      <li>Scenario analysis shows cost/timeline impact on deal terms</li>
                      <li>Export a 1-page IC-ready brief with all sources</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isAnalyzing && <LoadingAnalysis />}

        {isLoadingResult && currentAnalysisId && <LoadingAnalysis />}

        {analysisResult && !isLoadingResult && (
          <AnalysisResults
            result={analysisResult}
            onExportPDF={() => exportMutation.mutate()}
            isExporting={exportMutation.isPending}
          />
        )}
      </main>

      <footer className="border-t border-border bg-card mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-xs text-muted-foreground text-center">
            Dudilig v1.2 Demo - For demonstration purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}
