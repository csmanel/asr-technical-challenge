"use client";

import { useState } from "react";

import { useRecords } from "../context/RecordsContext";
import type { RecordItem, RecordStatus } from "../types";
import RecordCard from "./RecordCard";
import RecordDetailDialog from "./RecordDetailDialog";
import { Button } from "@/components/ui/button";
import RecordSummary from "./RecordSummary";
import RecordFilter from "./RecordFilter";
import RecordHistoryLog from "./RecordHistoryLog";
import PaginationControls from "./PaginationControls";
import { Loader2 } from "lucide-react";
import { RecordCardSkeleton } from "./RecordCardSkeleton";

/**
 * RecordList orchestrates the interview page by fetching records via
 * RecordsContext, presenting summary counts, exposing a simple filter UI, and
 * handling selection to open the detail dialog.
 */
export default function RecordList() {
  const { records, loading, error, refresh, page, limit, totalCount, nextPage, prevPage, statusFilter, setStatusFilter } = useRecords();
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);

  const filteredStatus: "all" | RecordStatus = statusFilter ?? "all";
  const handleFilterChange = (value: "all" | RecordStatus) => {
    setStatusFilter(value === "all" ? null : value);
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Records
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalCount} total • Page {page} of {Math.ceil(totalCount / limit)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 ">
          <RecordFilter value={filteredStatus} onChange={handleFilterChange} />
          <Button variant="ghost" onClick={() => refresh()} disabled={loading}>
            Reload
          </Button>
        </div>
      </div>
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <RecordSummary />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <RecordCardSkeleton key={i} />)
          : records.map((record) => (
              <RecordCard key={record.id} record={record} onSelect={setSelectedRecord} />
            ))}
      </div>

      {selectedRecord && <RecordDetailDialog record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
      {records.length === 0 && !loading && !error && (
        <p className="text-sm text-muted-foreground">No records found.</p>
      )}
      
      <PaginationControls 
        page={page}
        totalPages={Math.ceil(totalCount / limit)}
        onPrevious={prevPage}
        onNext={nextPage}
        disabled={loading}
      />


      <RecordHistoryLog />

    </div>
  );
}
