import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClassificationBadge } from "./ClassificationBadge";
import { CitationChip } from "./CitationChip";
import type { Citation } from "@shared/schema";

interface ClassificationDisplayProps {
  tier: string;
  reason: string;
  citations: Citation[];
  companyName: string;
}

export function ClassificationDisplay({ tier, reason, citations, companyName }: ClassificationDisplayProps) {
  return (
    <Card className="border-2" data-testid="classification-display">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground mb-4">
          EU AI Act Classification
        </CardTitle>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-muted-foreground">Classification for</span>
          <span className="text-base font-semibold text-foreground" data-testid="text-company-name">{companyName}</span>
        </div>
        <ClassificationBadge tier={tier} size="lg" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Rationale</h4>
          <p className="text-sm text-foreground leading-relaxed" data-testid="text-tier-reason">
            {reason}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Supporting Citations</h4>
          <div className="flex flex-wrap gap-2">
            {citations.map((citation) => (
              <CitationChip key={citation.id} citation={citation} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
