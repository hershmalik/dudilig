import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { CitationChip } from "./CitationChip";
import type { ComplianceGap } from "@shared/schema";

interface ComplianceGapCardProps {
  gap: ComplianceGap;
}

export function ComplianceGapCard({ gap }: ComplianceGapCardProps) {
  const statusConfig = {
    green: {
      icon: CheckCircle,
      color: "bg-success text-white",
      label: "Compliant",
    },
    yellow: {
      icon: AlertTriangle,
      color: "bg-warning text-slate-900",
      label: "Needs Attention",
    },
    red: {
      icon: XCircle,
      color: "bg-error text-white",
      label: "Critical Gap",
    },
  };

  const config = statusConfig[gap.status];
  const Icon = config.icon;

  return (
    <Card className="relative hover-elevate" data-testid={`gap-card-${gap.id}`}>
      <div className="absolute top-4 right-4">
        <Badge className={`${config.color} px-2 py-1`} data-testid={`badge-status-${gap.status}`}>
          <Icon className="w-3 h-3 mr-1" />
          {config.label}
        </Badge>
      </div>
      <CardHeader className="pr-32">
        <h3 className="text-lg font-semibold text-foreground" data-testid="text-gap-title">
          {gap.title}
        </h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-foreground leading-relaxed" data-testid="text-gap-action">
          {gap.action}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Source:</span>
          <CitationChip citation={gap.citation} />
          <Badge variant="outline" className="text-xs" data-testid={`badge-confidence-${gap.confidence.toLowerCase()}`}>
            Confidence: {gap.confidence}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
