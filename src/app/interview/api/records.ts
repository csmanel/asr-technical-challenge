import { RecordHistoryEntry, RecordItem, RecordStatus } from "@/app/interview/types";

const API_BASE = "/api/mock/records";

export type StatusCounts = Record<RecordStatus, number>;

export interface FetchRecordsParams { 
  page?: number; 
  limit?: number; 
  status?: RecordStatus;
}

export interface FetchRecordsResponse { 
  records: RecordItem[];
  totalCount: number; 
  statusCounts: StatusCounts;
  history: RecordHistoryEntry[];
}

export const fetchRecords = async (params: FetchRecordsParams = {}): Promise<FetchRecordsResponse> => {

  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);

  const url = `${API_BASE}${searchParams.toString() ? `?${searchParams}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load records: ${response.statusText}`);
  }
  const data = (await response.json()) as FetchRecordsResponse;
  return data;
};

export const patchRecord = async (id: string, updates: { status?: RecordStatus; note?: string }, expectedVersion: number ) => {

  const response = await fetch(API_BASE, { 
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
};

export const deleteHistory = async (): Promise<void> => {
  const response = await fetch(API_BASE, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`Failed to clear history: ${response.statusText}`)
  }
}