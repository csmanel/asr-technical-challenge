'use client';

/*
 * RecordsContext is the single source of truth for all record data in this
 * interview exercise.  It encapsulates data fetching from the mock API,
 * exposes mutation functions for updating records, and maintains a simple
 * history log of status changes.
 */

import React, { createContext, useContext } from 'react';
import type { RecordItem, RecordStatus, RecordHistoryEntry, UpdateResult } from '../types';
import { useRecordState } from '../hooks/useRecordsState';
interface RecordsContextValue {
  records: RecordItem[];
  loading: boolean;
  error: string | null;
  /**
   * Update a record’s status and/or note. This function calls the mock API
   * and then updates local state. Errors are set on the context.
   */
  updateRecord: (id: string, updates: { status?: RecordStatus; note?: string }) => Promise<UpdateResult>;
  /**
   * Refresh the list of records from the API. Useful after a mutation
   * or when you need the latest state.
   */
  refresh: () => Promise<void>;

  /**
   * A log of record updates performed during this session. Each entry
   * records the record id, previous and new status, optional note and a
   * timestamp. This can be used to build an audit log or to teach
   * candidates about derived state.
   */
  history: RecordHistoryEntry[];
  /**
   * Clears the history log.
   */
  clearHistory: () => void;
}

const RecordsContext = createContext<RecordsContextValue | undefined>(undefined);

export function RecordsProvider({ children }: { children: React.ReactNode }) {

  const value = useRecordState()

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}

export function useRecords() {
  const ctx = useContext(RecordsContext);
  if (!ctx) throw new Error('useRecords must be used within a RecordsProvider');
  return ctx;
}
