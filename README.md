# Phase 1 

*The original readme as be renamed [Challenge ReadMe](CHALLENGE-README.md)

## Identified Issues

*RecordsContext*

- I found using data to be a bit too vague and required to map values when its not entirely necessary. Rather than mapping `records -> data` we can just use records.
```js 
const [data, setData] = useState(...)
const [busy, setBusy] = useState(...)

// interface expects
records: RecordItem[]
loading: boolean

// leading to needing a map 
const value = { 
  records: data,
  loading: busy,
...
}
```

- `RecordsContext` contained all logic while hook was empty/not being fully utilized
- `doUpdate` improperly sets state of `prevRecord`
```js
// previously: reading records after setRecords so we no longer see the previous record
setRecords((prev) => prev.map(...));
const prevRecord = records.find(...); 

// current: read records before the state update 
const prevRecord = records.find(...); 
const updated = await patchRecord(...);
setRecords((prev) => prev.map(...));

```
- Redundant reLoad wrapped

*RecordList*

- Duplicated component logic rather than using component(`RecordSummary`, `RecordHistoryLog`, `RecordFilter`)
```js
// previously: 50ish lines of duplicated logic 
const counts = records.reduce((acc, r) => { ... }, {});
<div className="grid grid-cols-4">
  {Object.entries(counts).map(...)} // summary rendering
</div>
<select value={fltr} onChange={...}> // raw select
  <option>all</option>
  ...
</select>
{log.map((entry) => ...)} // history rendering

// current: use existing RecordFilter
<RecordSummary />
<RecordFilter value={statusFilter} onChange={setStatusFilter} />
<RecordHistoryLog />
```
- Filter logic not yet implemented
```js
// previously: not actually filtering 
const display = records; 

//current: filters records
const filteredRecords = statusFilter === 'all'
  ? records
  : records.filter(r => r.status === statusFilter);
```
- Unclear variable names (`fltr`, `sel`, `display`) 

## Architectural Changes 

```
interview/
├── api/
│   └── records.ts        ← HTTP (fetchRecords, patchRecord)
├── hooks/
│   └── useRecordsState   ← State (useState, useCallback)
├── context/
│   └── RecordsContext    ← Distribution (createContext, Provider)
└── components/
    └── RecordList, etc.  ← UI
```

## Changes Made 

- Created `api/records.ts`: storage for API calls
- Created `useRecordsState` hook: holds state and logic 
- `RecordsContext`: removed state, logic, and api calls, simply exposes hook's return value through context
- Integrated existing components (`RecordSummary`, `RecordHistoryLog`, `RecordFilter`)
- Fixed filter logic, renamed variables
- Created `RECORD_STATUS_LABELS` and `STATUSES` constants for frequently reused text 
- RecordCard layout fix (button has a fixed position, and border is conditional on there being a *note*)
- `HistoryLog` renamed `RecordHistoryLog` for more clarity

## Design Decisions 

- Mapping in hook return for `isLoading: loading` keeping internal names descriptive 
- i18n file would likely replace `RECORD_STATUS_LABELS` and `STATUSES` or work together to provide translatable text 

## Derived Data

**Summary counts**: `RecordSummary` gets records from context, then reduces over the array. For each record a counter increments for that status giving us an object like { pending: 1, approved: 3, flagged: 3...} 

**History log**: On update, the current record status is stored as `previousStatus` before it is replaced with the incoming status. If the statuses differ, it creates an entry with `{ id, previousStatus, newStatus, note, timestamp }`. Prior to my changes this comparison was done client-side in `useRecordsState`, but now lives server-side in the PATCH route so history persists through page refreshes. 

# Phase 2 

## Identified Issues 

*RecordDetailDialog*

- Save button has no functionality 
- No form validation 
- No concurrency handling 
- History didn't persist through refreshes

## Changes Made 

- Form Validation: `RecordDetailDialog` requires notes when status is `flagged` or `needs_revision`. 
  - Edited error handling, button disables on error, and error text displays
- UpdateResult pattern: `updateRecord` returns 
  `{ success: true } | { success: false; error: string }`
  allowing error handling to be done locally rather than through context 
- Concurrency handling: added `version` to `RecordItem`. API checks `expectedVersion` on PATCH requests and errors if conflict in stale versioning
- Audit trail: Status changes are saved on the server, so history survives page refreshes

## Design Decisions 

- Clickable summary counts: `RecordSummary` counts are now buttons that filter by status, and show focus when the `RecordFilter` dropdown is used. 
- Added dark mode

## Scalability Considerations 

- Form validation: Given the scale of this project the current form implementation makes sense, however if the form became more complex or for a project at scale I would likely want to use something like zod or yup: 
```js 
const formSchema = z.object({ 
    status: z.enum(STATUSES),
    note: z.string()
  }).refined(
    (data) => !["flagged", "needs_revision"].includes(data.status) || data.note.trim(),
    { message: "A note is required for submission", path: ["note"] }
  );
```
- Stricter error typing: Current errors are just strings. For larger forms, typed error codes with a messages map would be cleaner:
```ts
type ValidationErrorCode = 'NOTE_REQUIRED';
const ERROR_MESSAGES: Record<ValidationErrorCode, string> = {
  NOTE_REQUIRED: "A note is required for this status"
};
```
- Include a translation file for all text 
- Multiple view types, list as well as grid 
- Reload button styling/menu styling 