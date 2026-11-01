import { Search, Filter, ChevronDown, ChevronsUpDown, Hash } from 'lucide-react';

export function TraceControlsBar() {
  return (
    <section className="bg-page border border-[#E8E6E1] rounded-[3px] p-4 sticky top-[180px] z-40">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
          <input
            type="text"
            placeholder="Search prompts..."
            disabled
            className="w-full pl-10 pr-4 py-2 text-sm border border-[#E8E6E1] rounded-lg bg-page-muted cursor-not-allowed"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <FilterDropdown label="Concept" />
          <FilterDropdown label="Cognitive Level" />
          <FilterDropdown label="Intent" />
          <FilterDropdown label="Flags" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            disabled
            className="px-3 py-2 text-sm font-medium text-ink-muted bg-page-muted rounded-lg cursor-not-allowed"
          >
            <ChevronsUpDown className="w-4 h-4 inline mr-1" />
            Expand All
          </button>
          <button
            disabled
            className="px-3 py-2 text-sm font-medium text-ink-muted bg-page-muted rounded-lg cursor-not-allowed"
          >
            Collapse All
          </button>

          {/* Jump to prompt */}
          <div className="flex items-center border border-[#E8E6E1] rounded-lg overflow-hidden">
            <div className="px-2 py-2 bg-page-muted border-r border-[#E8E6E1]">
              <Hash className="w-4 h-4 text-ink-subtle" />
            </div>
            <input
              type="number"
              placeholder="—"
              disabled
              className="w-12 px-2 py-2 text-sm text-center bg-page cursor-not-allowed"
            />
            <button
              disabled
              className="px-3 py-2 text-sm font-medium text-ink-muted bg-page-muted border-l border-[#E8E6E1] cursor-not-allowed"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterDropdown({ label }: { label: string }) {
  return (
    <button
      disabled
      className="inline-flex items-center gap-1 px-3 py-2 text-sm text-ink-muted bg-page-muted border border-[#E8E6E1] rounded-lg cursor-not-allowed"
    >
      <Filter className="w-3 h-3" />
      {label}
      <ChevronDown className="w-3 h-3" />
    </button>
  );
}
