import { baseApi } from "@/services/baseApi";
import { endpoints } from "@/services/endPoints";
import type {
  Product,
  ProductFilters,
  ProductSortOption,
} from "@/types/product";

interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  condition?: string;
  ageGroup?: string;
  minPrice?: number;
  maxPrice?: number;
  sellType?: "Sell with us" | "Sell to us";
  sortBy?: ProductSortOption;
  status?: string;
}

export const productApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Products", "Product"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      addProduct: builder.mutation<any, FormData>({
        query: (data) => ({
          url: endpoints.addProduct,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Products"],
      }),

      getAllProducts: builder.query<Product[], GetProductsParams | void>({
        query: (params) => {
          const searchParams = new URLSearchParams();

          if (params) {
            Object.entries(params).forEach(([key, value]) => {
              if (value !== undefined && value !== null && value !== "") {
                searchParams.append(key, value.toString());
              }
            });
          }

          return {
            url: `${endpoints.getProducts}${
              searchParams.toString() ? `?${searchParams.toString()}` : ""
            }`,
            method: "GET",
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ productId }) => ({
                  type: "Product" as const,
                  id: productId,
                })),
                { type: "Products", id: "LIST" },
              ]
            : [{ type: "Products", id: "LIST" }],
      }),

      getProduct: builder.query<Product, string>({
        query: (productId) => ({
          url: endpoints.getProduct + productId,
          method: "GET",
        }),
        providesTags: (_result, _error, productId) => [
          { type: "Product", id: productId },
        ],
      }),

      getUnapprovedProducts: builder.query<Product[], void>({
        query: () => ({
          url: endpoints.getUnapprovedProducts,
          method: "GET",
        }),
        providesTags: [{ type: "Products", id: "UNAPPROVED" }],
      }),

      updateProductStatus: builder.mutation<
        any,
        {
          id: string;
          status: string;
          price?: number;
          pickupGuy?: string;
        }
      >({
        query: ({ id, status, price, pickupGuy }) => ({
          url: endpoints.approveProduct(id),
          method: "PATCH",
          body: { status, price, pickupGuy },
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Product", id },
          { type: "Products", id: "LIST" },
          { type: "Products", id: "UNAPPROVED" },
        ],
      }),

      deleteProduct: builder.mutation<any, string>({
        query: (productId) => ({
          url: `${endpoints.getProducts}/admin/${productId}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, productId) => [
          { type: "Product", id: productId },
          { type: "Products", id: "LIST" },
          { type: "Products", id: "UNAPPROVED" },
        ],
      }),

      bulkUpdateProducts: builder.mutation<
        any,
        {
          productIds: string[];
          status: string;
        }
      >({
        query: ({ productIds, status }) => ({
          url: `${endpoints.getProducts}/admin/bulk-update`,
          method: "PATCH",
          body: { productIds, status },
        }),
        invalidatesTags: [
          { type: "Products", id: "LIST" },
          { type: "Products", id: "UNAPPROVED" },
        ],
      }),

      searchProducts: builder.query<
        Product[],
        { query: string; filters?: ProductFilters }
      >({
        query: ({ query, filters }) => {
          const searchParams = new URLSearchParams();
          searchParams.append("q", query);

          if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
              if (value !== undefined && value !== null && value !== "") {
                if (key === "priceRange" && typeof value === "object") {
                  searchParams.append("minPrice", value.min.toString());
                  searchParams.append("maxPrice", value.max.toString());
                } else {
                  searchParams.append(key, value.toString());
                }
              }
            });
          }

          return {
            url: `${endpoints.searchProducts}?${searchParams.toString()}`,
            method: "GET",
          };
        },
        providesTags: [{ type: "Products", id: "SEARCH" }],
      }),

      getProductsByCategory: builder.query<Product[], string>({
        query: (category) => ({
          url: endpoints.getProductsByCategory(category),
          method: "GET",
        }),
        providesTags: (_result, _error, category) => [
          { type: "Products", id: `CATEGORY-${category}` },
        ],
      }),

      getFeaturedProducts: builder.query<Product[], { limit?: number }>({
        query: ({ limit = 8 }) => ({
          url: `${endpoints.getFeaturedProducts}?limit=${limit}`,
          method: "GET",
        }),
        providesTags: [{ type: "Products", id: "FEATURED" }],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useGetProductQuery,
  useGetUnapprovedProductsQuery,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,
  useBulkUpdateProductsMutation,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
  useGetFeaturedProductsQuery,
} = productApi;
