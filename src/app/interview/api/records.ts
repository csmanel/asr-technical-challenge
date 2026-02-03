import { RecordHistoryEntry, RecordItem, RecordStatus } from "@/app/interview/types";

export const fetchRecords = async () =>  {
  
  const response = await fetch("/api/mock/records");
  if (!response.ok) {
    throw new Error(`Failed to load records: ${response.statusText}`);
  }
  const data = (await response.json()) as {records: RecordItem[]; history: RecordHistoryEntry[] };
  return data;
}

export const patchRecord = async (id: string, updates: {status?: RecordStatus; note?: string }, expectedVersion: number ) => {

  const response = await fetch("/api/mock/records", { 
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates, expectedVersion }),
  });
  if (!response.ok) { 
    const errorBody = await response.json();
    throw new Error(errorBody.error || `Failed to update record: ${response.statusText}`);
  }
  const updated = (await response.json()) as RecordItem; 
  return updated
}