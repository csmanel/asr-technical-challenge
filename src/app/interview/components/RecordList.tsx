"use client";

import { useState } from "react";

import { useRecords } from "../context/RecordsContext";
import type { RecordItem } from "../types";
import RecordCard from "./RecordCard";
import RecordDetailDialog from "./RecordDetailDialog";
import { Button } from "@/components/ui/button";
import RecordSummary from "./RecordSummary";
import RecordFilter from "./RecordFilter";
import { DarkModeToggle } from "./DarkModeToggle";
import RecordHistoryLog from "./RecordHistoryLog";

/**
 * RecordList orchestrates the interview page by fetching records via
 * RecordsContext, presenting summary counts, exposing a simple filter UI, and
 * handling selection to open the detail dialog.
 */
export default function RecordList() {
  const { records, loading, error, refresh } = useRecords();
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | RecordItem["status"]>("all");

  const filteredRecords = statusFilter === 'all' ? records : records.filter(record => record.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Records
          </h2>
          <p className="text-sm text-muted-foreground">
            {records.length} total • {filteredRecords.length} showing
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 ">
          <RecordFilter value={statusFilter} onChange={setStatusFilter} />
          <Button variant="ghost" onClick={() => refresh()} disabled={loading}>
            Reload
          </Button>
          <DarkModeToggle />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">Error: {error}</p>}
      {loading && (
        <p className="text-sm text-muted-foreground">Loading records...</p>
      )}

      <RecordSummary 
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecords.map((record) => (
          <RecordCard key={record.id} record={record} onSelect={setSelectedRecord} />
        ))}
      </div>
      {selectedRecord && <RecordDetailDialog record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
      {records.length === 0 && !loading && !error && (
        <p className="text-sm text-muted-foreground">No records found.</p>
      )}

       <RecordHistoryLog />

    </div>
  );
}
