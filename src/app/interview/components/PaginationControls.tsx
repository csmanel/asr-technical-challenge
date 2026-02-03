import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps { 
  page: number;
  totalPages: number; 
  onPrevious: () => void; 
  onNext: () => void;
  disabled?: boolean;
}

export default function PaginationControls({
  page,
  totalPages,
  onPrevious,
  onNext,
  disabled = false,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={page === 1 || disabled}
      >
        <ChevronLeft className="size-4 mr-1" />
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={onNext}
        disabled={page >= totalPages || disabled}
      >
        Next
        <ChevronRight className="size-4 mr-1" />
      </Button>
    </div>
  )
}