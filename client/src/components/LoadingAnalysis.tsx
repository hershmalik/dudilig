import { Loader2 } from "lucide-react";

export function LoadingAnalysis() {
  return (
    <div className="w-full max-w-3xl mx-auto py-16 animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-primary/20"></div>
          <Loader2 className="w-20 h-20 absolute inset-0 text-primary animate-spin" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground" data-testid="text-analyzing">
            Analyzing Compliance Framework
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Extracting company data, classifying EU AI Act tier, identifying gaps, and generating scenario impact...
          </p>
        </div>
        <div className="w-full max-w-md bg-card rounded-full h-2 overflow-hidden">
          <div className="h-full bg-primary animate-pulse" style={{ width: "70%" }}></div>
        </div>
      </div>
    </div>
  );
}
