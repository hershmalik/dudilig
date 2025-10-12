import { Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassificationDisplay } from "./ClassificationDisplay";
import { ComplianceGapCard } from "./ComplianceGapCard";
import { ScenarioPanel } from "./ScenarioPanel";
import type { AnalysisResult } from "@shared/schema";
import { format } from "date-fns";

interface AnalysisResultsProps {
  result: AnalysisResult;
  onExportPDF: () => void;
  isExporting: boolean;
}

export function AnalysisResults({ result, onExportPDF, isExporting }: AnalysisResultsProps) {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
            Compliance Impact Brief
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span data-testid="text-analysis-date">
              {format(new Date(result.createdAt), "PPpp")}
            </span>
          </div>
        </div>
        <Button
          onClick={onExportPDF}
          disabled={isExporting}
          size="lg"
          className="gap-2"
          data-testid="button-export-pdf"
        >
          <Download className="w-4 h-4" />
          {isExporting ? "Generating PDF..." : "Export 1-Page Brief"}
        </Button>
      </div>

      <ClassificationDisplay
        tier={result.tier}
        reason={result.tierReason}
        citations={result.citations}
        companyName={result.companyName}
      />

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Compliance Gaps Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.gaps.map((gap) => (
            <ComplianceGapCard key={gap.id} gap={gap} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Regulatory Impact Scenario
        </h2>
        <ScenarioPanel scenario={result.scenario} />
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
        <p className="text-xs text-amber-900 dark:text-amber-200 font-medium">
          <strong>Disclaimer:</strong> This analysis is for informational purposes only and does not constitute legal advice. 
          Consult with qualified legal counsel for compliance decisions. Version 1.2 Demo.
        </p>
      </div>
    </div>
  );
}
