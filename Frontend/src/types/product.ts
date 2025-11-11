export type Product = {
  productId: string;
  userId: string;
  name: string;
  description?: string;
  originalPrice: number;
  currentPrice: number;
  category: string;
  ageGroup?: string;
  condition: string;
  sellType: "Sell with us" | "Sell to us";
  status: "Pending" | "Ready to pick" | "Picked" | "Completed" | "Rejected";
  available: boolean;
  itemUrl?: string;
  pickupGuy?: string;
  pickupAddress: string;
  images: Array<{
    filename: string;
    url: string;
  }>;
  gsi1pk: string;
  gsi1sk: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductFilters = {
  category?: string;
  condition?: string;
  ageGroup?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sellType?: "Sell with us" | "Sell to us";
  search?: string;
};

export type ProductSortOption =
  | "newest"
  | "oldest"
  | "price-low-to-high"
  | "price-high-to-low"
  | "name-a-to-z"
  | "name-z-to-a";

export type ProductListResponse = {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Product categories based on kids' items
export const PRODUCT_CATEGORIES = [
  "Bicycles",
  "Tricycles",
  "Balance Bikes",
  "Electric Rides",
  "Accessories",
  "Safety Gear",
  "Parts & Maintenance",
  "Toys & Games",
  "Books",
  "Clothing",
] as const;

// Age groups for kids
export const AGE_GROUPS = [
  "1-2 years",
  "2-4 years",
  "4-6 years",
  "6-8 years",
  "8-12 years",
  "12+ years",
] as const;

// Condition options
export const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type AgeGroup = (typeof AGE_GROUPS)[number];
export type ProductCondition = (typeof CONDITIONS)[number];
