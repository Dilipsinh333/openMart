import React from "react";
import { ChevronDown, ChevronUp, X, Sliders } from "lucide-react";
import { useState } from "react";
import type { ProductFilters } from "@/types/product";
import { PRODUCT_CATEGORIES, AGE_GROUPS, CONDITIONS } from "@/types/product";

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
  productCount?: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  productCount = 0,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    priceRange: true,
    condition: true,
    ageGroup: true,
    sellType: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? undefined : category,
    });
  };

  const handleConditionChange = (condition: string) => {
    onFiltersChange({
      ...filters,
      condition: filters.condition === condition ? undefined : condition,
    });
  };

  const handleAgeGroupChange = (ageGroup: string) => {
    onFiltersChange({
      ...filters,
      ageGroup: filters.ageGroup === ageGroup ? undefined : ageGroup,
    });
  };

  const handleSellTypeChange = (sellType: "Sell with us" | "Sell to us") => {
    onFiltersChange({
      ...filters,
      sellType: filters.sellType === sellType ? undefined : sellType,
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: { min, max },
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== null && value !== ""
  );

  const FilterSection = ({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left py-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
      >
        {title}
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-3 space-y-2">{children}</div>
      )}
    </div>
  );

  return (
    <aside className="w-full md:w-72 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">{productCount}</span> products found
        </p>
      </div>

      {/* Category Filter */}
      <FilterSection title="Category" sectionKey="category">
        <div className="space-y-2">
          {PRODUCT_CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === category}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range" sectionKey="priceRange">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                min="0"
                placeholder="₹0"
                value={filters.priceRange?.min || ""}
                onChange={(e) => {
                  const min = parseInt(e.target.value) || 0;
                  const max = filters.priceRange?.max || 50000;
                  handlePriceRangeChange(min, max);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                min="0"
                placeholder="₹50,000"
                value={filters.priceRange?.max || ""}
                onChange={(e) => {
                  const max = parseInt(e.target.value) || 50000;
                  const min = filters.priceRange?.min || 0;
                  handlePriceRangeChange(min, max);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* Quick Price Ranges */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">
              Quick Selection:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Under ₹1,000", min: 0, max: 1000 },
                { label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
                { label: "₹5,000 - ₹15,000", min: 5000, max: 15000 },
                { label: "Above ₹15,000", min: 15000, max: 100000 },
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() => handlePriceRangeChange(range.min, range.max)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${
                    filters.priceRange?.min === range.min &&
                    filters.priceRange?.max === range.max
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Condition Filter */}
      <FilterSection title="Condition" sectionKey="condition">
        <div className="space-y-2">
          {CONDITIONS.map((condition) => (
            <label
              key={condition}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="radio"
                name="condition"
                checked={filters.condition === condition}
                onChange={() => handleConditionChange(condition)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                {condition}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Age Group Filter */}
      <FilterSection title="Age Group" sectionKey="ageGroup">
        <div className="space-y-2">
          {AGE_GROUPS.map((ageGroup) => (
            <label
              key={ageGroup}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="radio"
                name="ageGroup"
                checked={filters.ageGroup === ageGroup}
                onChange={() => handleAgeGroupChange(ageGroup)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                {ageGroup}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Sell Type Filter */}
      {/* <FilterSection title="Sell Type" sectionKey="sellType">
        <div className="space-y-2">
          {["Sell with us", "Sell to us"].map((sellType) => (
            <label
              key={sellType}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="radio"
                name="sellType"
                checked={filters.sellType === sellType}
                onChange={() =>
                  handleSellTypeChange(
                    sellType as "Sell with us" | "Sell to us"
                  )
                }
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                {sellType}
              </span>
            </label>
          ))}
        </div>
      </FilterSection> */}
    </aside>
  );
};

export default FilterSidebar;
