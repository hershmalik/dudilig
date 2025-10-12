import { ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Citation } from "@shared/schema";

interface CitationChipProps {
  citation: Citation;
}

export function CitationChip({ citation }: CitationChipProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-auto py-1 px-2 text-xs font-mono text-citation hover:text-citation border-citation/30 hover:border-citation/50 hover-elevate no-default-hover-elevate"
      asChild
      data-testid={`citation-${citation.id}`}
    >
      <a href={citation.url} target="_blank" rel="noopener noreferrer">
        <FileText className="w-3 h-3 mr-1" />
        {citation.article || citation.text}
        <ExternalLink className="w-3 h-3 ml-1" />
      </a>
    </Button>
  );
}
