// Re-export the useRecords hook from the context. This hook provides
// convenient access to the records context from components. See
// `context/RecordsContext.tsx` for implementation details.

import { useCallback, useEffect, useState } from "react";
import { RecordHistoryEntry, RecordItem, RecordStatus, UpdateResult } from "../types";
import { fetchRecords, patchRecord } from "../api/records";

export function useRecordState() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recordHistory, setRecordHistory] = useState<RecordHistoryEntry[]>([]); 

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try { 
      const { records: incoming, history: incomingHistory } = await fetchRecords();
      setRecords(incoming);
      setRecordHistory(incomingHistory);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setError(message)
    } finally { 
      setIsLoading(false);
    }
  }, []);

   useEffect(() => {
    refresh();
  }, [refresh]);

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
          prev.map((record) => (record.id === updated.id ? updated : record)),
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
  };
}
