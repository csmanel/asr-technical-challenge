"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { RECORD_STATUS_LABELS, STATUSES, type RecordItem, type RecordStatus } from "../types";
import { useRecords } from "../context/RecordsContext";
import { toast } from "sonner";

interface RecordDetailDialogProps {
  record: RecordItem;
  onClose: () => void;
}

/**
 * RecordDetailDialog allows reviewers to inspect a specimen’s details and
 * update its status and accompanying note in a focused modal flow. Review
 * actions are performed via the Status dropdown, while the note captures
 * rationale or extra context for the change.
 */
export default function RecordDetailDialog({
  record,
  onClose,
}: RecordDetailDialogProps) {
  const [status, setStatus] = useState<RecordStatus>(record.status);
  const [note, setNote] = useState<string>(record.note ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null); 

  const { updateRecord } = useRecords();

  const validate = (): string | null => {
    if ((status === 'flagged' || status === 'needs_revision') && !note.trim()) {
      return `A note is required for status: ${RECORD_STATUS_LABELS[status]}`
    }
    return null;
  }

  const handleSave = async () => {
  setIsSaving(true);
   const result = await updateRecord(record.id, {status, note});
   setIsSaving(false)
   
   if (result.success) {
    toast.success("Record saved");
    onClose();
   } else { 
    // toast.error(result.error)
    setSaveError(result.error)
   }
    
  };
  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    await handleSave();
  }

  useEffect(() => {
    if (validationError) {
      setValidationError(validate());
    }
    setSaveError(null);
  }, [status, note]);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg tracking-tight">
            {record.name}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {record.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as RecordStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {RECORD_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Reviewer note
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="min-h-24"
            />
            <p className={`mt-1 text-xs ${validationError || saveError ? 'text-destructive' : 'text-muted-foreground'}`}>
              {validationError || saveError || 'Notes help other reviewers understand decisions.'}
            </p>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="secondary" onClick={() => onClose()}>
            Close
          </Button>
          <Button 
            variant="default" 
            onClick={() => handleSubmit()}
            disabled={!!validationError || isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
