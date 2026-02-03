import { RECORD_STATUS_LABELS, STATUSES, type RecordStatus } from "../types";
import { useRecords } from "../context/RecordsContext";

interface RecordSummaryProps { 
  activeFilter: "all" | RecordStatus; 
  onFilterChange: (status: "all" | RecordStatus) => void;
}

/**
 * RecordSummary computes derived counts by status from the current record set
 * provided by RecordsContext and renders them as a lightweight dashboard.
 */
export default function RecordSummary({ activeFilter, onFilterChange }: RecordSummaryProps) {
  const { records } = useRecords();
  // Compute counts for each status
  const counts = records.reduce(
    (acc, record) => {
      acc[record.status] = (acc[record.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<RecordStatus, number>,
  );

  return (
    <section aria-label="Record status summary" className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight">
          Summary
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Counts by review status
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATUSES.map((status) => {
          const count = counts[status] ?? 0;
          const isActive = activeFilter === status;

          return (
            <button
              key={status}
              onClick={() => onFilterChange(isActive ? "all" : status)}
              className={`hover:cursor-pointer rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center shadow-sm hover:bg-card transition-colors ${
                isActive
                  ? "ring-2 ring-primary bg-card"
                  : "border bg-card/50"
              }
              `}
            >
              <span className="text-xs sm:text-sm font-medium capitalize text-muted-foreground">
                {RECORD_STATUS_LABELS[status]}
              </span>
              <span
                className="text-xl sm:text-2xl font-bold mt-1 tracking-tight"
                aria-label={`${status} count`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
