import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";

interface ClassificationBadgeProps {
  tier: string;
  size?: "default" | "lg";
}

export function ClassificationBadge({ tier, size = "default" }: ClassificationBadgeProps) {
  const config = {
    "High-Risk": {
      icon: ShieldAlert,
      className: "bg-error text-white border-error",
    },
    "Limited-Risk": {
      icon: Shield,
      className: "bg-warning text-slate-900 border-warning",
    },
    "Minimal-Risk": {
      icon: ShieldCheck,
      className: "bg-success text-white border-success",
    },
  }[tier] || {
    icon: Shield,
    className: "bg-muted text-muted-foreground border-muted",
  };

  const Icon = config.icon;
  const sizeClasses = size === "lg" ? "text-base px-4 py-2" : "text-sm px-3 py-1";

  return (
    <Badge
      className={`${config.className} ${sizeClasses} font-semibold uppercase tracking-wide inline-flex items-center gap-2`}
      data-testid={`badge-tier-${tier.toLowerCase().replace("-", "")}`}
    >
      <Icon className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      {tier}
    </Badge>
  );
}
