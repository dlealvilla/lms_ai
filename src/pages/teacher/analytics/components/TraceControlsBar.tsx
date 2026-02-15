import { Search, Filter, ChevronDown, ChevronsUpDown, Hash } from 'lucide-react';

export function TraceControlsBar() {
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4 sticky top-[180px] z-40">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search prompts..."
            disabled
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
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
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed"
          >
            <ChevronsUpDown className="w-4 h-4 inline mr-1" />
            Expand All
          </button>
          <button
            disabled
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed"
          >
            Collapse All
          </button>

          {/* Jump to prompt */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-2 py-2 bg-gray-50 border-r border-gray-200">
              <Hash className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="number"
              placeholder="—"
              disabled
              className="w-12 px-2 py-2 text-sm text-center bg-white cursor-not-allowed"
            />
            <button
              disabled
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 border-l border-gray-200 cursor-not-allowed"
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
      className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
    >
      <Filter className="w-3 h-3" />
      {label}
      <ChevronDown className="w-3 h-3" />
    </button>
  );
}
