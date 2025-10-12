import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, DollarSign, FileText } from "lucide-react";
import type { Scenario } from "@shared/schema";

interface ScenarioPanelProps {
  scenario: Scenario;
}

export function ScenarioPanel({ scenario }: ScenarioPanelProps) {
  const dealTermIcons = {
    reserve: DollarSign,
    milestone: Clock,
    valuation: TrendingUp,
  };

  return (
    <Card className="bg-card border-card-border" data-testid="scenario-panel">
      <CardHeader className="border-b border-card-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-foreground mb-2" data-testid="text-scenario-name">
              {scenario.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground" data-testid="text-scenario-description">
              {scenario.description}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0" data-testid={`badge-scenario-confidence-${scenario.confidence.toLowerCase()}`}>
            {scenario.confidence} Confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background rounded-md p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Cost Impact</span>
            </div>
            <p className="text-2xl font-bold text-foreground" data-testid="text-cost-range">
              +${scenario.costRange.min.toLocaleString()}k - ${scenario.costRange.max.toLocaleString()}k
            </p>
            <p className="text-xs text-muted-foreground mt-1">per year</p>
          </div>
          <div className="bg-background rounded-md p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Timeline Impact</span>
            </div>
            <p className="text-2xl font-bold text-foreground" data-testid="text-timeline-range">
              +{scenario.timelineRange.min} - {scenario.timelineRange.max} months
            </p>
            <p className="text-xs text-muted-foreground mt-1">additional time to market</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Recommended Deal Terms
          </h4>
          <div className="space-y-2">
            {scenario.dealTerms.map((term, index) => {
              const Icon = dealTermIcons[term.type];
              return (
                <div
                  key={term.id}
                  className="bg-background rounded-md p-3 border border-border hover-elevate"
                  data-testid={`deal-term-${index}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-md p-2 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-1" data-testid={`text-term-description-${index}`}>
                        {term.description}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`text-term-impact-${index}`}>
                        {term.impact}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
