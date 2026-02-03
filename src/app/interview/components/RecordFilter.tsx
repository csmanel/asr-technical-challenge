import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RECORD_STATUS_LABELS, STATUSES, type RecordStatus } from "../types";

/**
 * RecordFilter provides a status selection UI decoupled from the records list
 * to illustrate separation of concerns. It exposes a controlled `value` and an
 * `onChange` callback so filter state can be lifted to a parent.
 */
interface RecordFilterProps {
  value: "all" | RecordStatus;
  onChange: (value: "all" | RecordStatus) => void;
}

export default function RecordFilter({ value, onChange }: RecordFilterProps) {

  return (
    <div className="w-56">
      <label className="block text-sm font-medium mb-1">Filter by status</label>
      <Select
        value={value}
        onValueChange={(v) => onChange(v as "all" | RecordStatus)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {RECORD_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
