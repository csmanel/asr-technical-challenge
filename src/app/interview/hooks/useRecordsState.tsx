// Re-export the useRecords hook from the context. This hook provides
// convenient access to the records context from components. See
// `context/RecordsContext.tsx` for implementation details.

import { useCallback, useEffect, useRef, useState } from "react";
import { RecordHistoryEntry, RecordItem, RecordStatus, UpdateResult } from "../types";
import { fetchRecords, patchRecord, StatusCounts } from "../api/records";

const DEFAULT_PAGE_SIZE = 6;

export function useRecordState() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recordHistory, setRecordHistory] = useState<RecordHistoryEntry[]>([]); 

  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);

  const [statusFilter, setStatusFilter] = useState<RecordStatus | null>(null);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({} as StatusCounts);

  // data fetching triggered by page/filter changes
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    const loadRecords = async () => {
      setIsLoading(true); 
      setError(null);

      try { 
        const response = await fetchRecords({
          page,
          limit, 
          status: statusFilter ?? undefined,
        });
        setRecords(response.records);
        setRecordHistory(response.history);
        setTotalCount(response.totalCount);
        setStatusCounts(response.statusCounts);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        setError(message)
      } finally { 
        setIsLoading(false);
      }
      }
    
    loadRecords();
  }, [page, limit, statusFilter, fetchTrigger]);

  const totalPages = Math.ceil(totalCount / limit);

  const nextPage = useCallback(() => {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev))
  }, []);

  const handleSetStatusFilter = useCallback((filter: RecordStatus | null) => {
    setStatusFilter(filter);
    setPage(1);
  }, []);

  const refresh = useCallback(async () => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  const updateRecord = useCallback(
    async (id: string, updates: { status?: RecordStatus; note?: string }): Promise<UpdateResult> => {
      setError(null);
      const prevRecord = records.find((record) => record.id === id);
      if (!prevRecord) {
        return { success: false, error: "Record not found" };
      }
      try {
        const updated = await patchRecord(id, updates, prevRecord.version);
        setRecords((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r)),
        );
        await refresh();
        return { success: true };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: message }
      }
    },
    [records, refresh],
  );

  const clearHistory = useCallback(() => {
    setRecordHistory([]);
  }, []);

  return {
    records,
    loading: isLoading,
    error,
    updateRecord,
    refresh,
    history: recordHistory,
    clearHistory,
    page,
    limit,
    totalCount,
    nextPage,
    prevPage,
    statusFilter,
    statusCounts,
    setStatusFilter: handleSetStatusFilter,
  };
}
