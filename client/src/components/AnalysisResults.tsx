import { Download, Calendar, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Model Implementation Strategies
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Explore different compliance approaches with interactive cost/conversion/timeline trade-offs
              </p>
            </div>
            <Button
              asChild
              variant="default"
              size="lg"
              className="gap-2 shrink-0"
              data-testid="button-compliance-simulator"
            >
              <Link href="/simulator">
                <TrendingUp className="w-4 h-4" />
                Open Simulator
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
        <p className="text-xs text-amber-900 dark:text-amber-200 font-medium">
          <strong>Disclaimer:</strong> This analysis is for informational purposes only and does not constitute legal advice. 
          Consult with qualified legal counsel for compliance decisions. Version 1.2 Demo.
        </p>
      </div>
    </div>
  );
}
