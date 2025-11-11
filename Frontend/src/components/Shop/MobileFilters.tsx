import React from "react";
import { X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import type { ProductFilters } from "@/types/product";

interface MobileFiltersProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  filtersOpen,
  setFiltersOpen,
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  if (!filtersOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={() => setFiltersOpen(false)}
      />

      {/* Mobile Filter Panel */}
      <div className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white shadow-xl transform transition-transform lg:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={() => setFiltersOpen(false)}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <FilterSidebar
              filters={filters}
              onFiltersChange={onFiltersChange}
              onClearFilters={onClearFilters}
            />
          </div>

          {/* Apply Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setFiltersOpen(false)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileFilters;
