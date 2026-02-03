import { Button } from "@/components/ui/button";

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
      </Button>
    </div>
  )
}