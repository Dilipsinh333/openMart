import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "../../components/Shop/Hero";
import FilterSidebar from "../../components/Shop/FilterSidebar";
import MobileFilters from "../../components/Shop/MobileFilters";
import ProductGrid from "../../components/Shop/ProductGrid";
import SearchAndSort from "../../components/Shop/SearchAndSort";
import Newsletter from "../../components/Shop/Newsletter";
import Loader from "@/components/Loader";
import { useGetAllProductsQuery } from "@/features/product/productApi";
import type { ProductFilters, ProductSortOption } from "@/types/product";

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [filters, setFilters] = useState<ProductFilters>({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || undefined,
    condition: searchParams.get("condition") || undefined,
    ageGroup: searchParams.get("ageGroup") || undefined,
    sellType:
      (searchParams.get("sellType") as "Sell with us" | "Sell to us") ||
      undefined,
    priceRange: {
      min: parseInt(searchParams.get("minPrice") || "0") || 0,
      max: parseInt(searchParams.get("maxPrice") || "50000") || 50000,
    },
  });

  const [sortBy, setSortBy] = useState<ProductSortOption>(
    (searchParams.get("sortBy") as ProductSortOption) || "newest"
  );

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // API call with all parameters
  const queryParams = useMemo(
    () => ({
      search: filters.search || undefined,
      category: filters.category || undefined,
      condition: filters.condition || undefined,
      ageGroup: filters.ageGroup || undefined,
      sellType: filters.sellType || undefined,
      minPrice: filters.priceRange?.min || undefined,
      maxPrice: filters.priceRange?.max || undefined,
      sortBy,
      status: "Completed", // Only show completed products in shop
    }),
    [filters, sortBy]
  );

  const {
    data: products = [],
    error,
    isLoading,
  } = useGetAllProductsQuery(queryParams);

  // Filter products that are available and completed
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => product.available && product.status === "Completed"
    );
  }, [products]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key === "priceRange" && typeof value === "object") {
          if (value.min > 0) params.set("minPrice", value.min.toString());
          if (value.max < 50000) params.set("maxPrice", value.max.toString());
        } else {
          params.set(key, value.toString());
        }
      }
    });

    if (sortBy !== "newest") {
      params.set("sortBy", sortBy);
    }

    setSearchParams(params, { replace: true });
  }, [filters, sortBy, setSearchParams]);

  // Handlers
  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: undefined,
      condition: undefined,
      ageGroup: undefined,
      sellType: undefined,
      priceRange: { min: 0, max: 50000 },
    });
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleSortChange = (newSortBy: ProductSortOption) => {
    setSortBy(newSortBy);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load products. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen bg-gray-50 ${
        isLoading ? "overflow-hidden" : ""
      }`}
    >
      {/* Loading Overlay */}
      {isLoading && <Loader />}

      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Sort */}
          <SearchAndSort
            searchQuery={filters.search || ""}
            sortBy={sortBy}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            onToggleFilters={() => {
              if (window.innerWidth < 1024) {
                setShowMobileFilters(!showMobileFilters);
              } else {
                toggleFilters();
              }
            }}
            showFilters={showFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            productCount={filteredProducts.length}
            isLoading={isLoading}
          />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            {showFilters && (
              <div className="hidden lg:block">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  productCount={filteredProducts.length}
                />
              </div>
            )}

            {/* Mobile Filters */}
            <MobileFilters
              filtersOpen={showMobileFilters}
              setFiltersOpen={setShowMobileFilters}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />

            {/* Product Grid */}
            <div className="flex-1">
              <ProductGrid products={filteredProducts} isLoading={isLoading} />

              {/* Pagination Placeholder */}
              {filteredProducts.length > 0 && !isLoading && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center gap-2">
                    <button
                      disabled
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md">
                      1
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      2
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      3
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Shop;
