import { baseApi } from "@/services/baseApi";
import { endpoints } from "@/services/endPoints";
import type { WishlistItem } from "@/types/wishlist";

export const wishlistApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Wishlist"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getWishlist: builder.query<WishlistItem[], void>({
        query: () => ({
          url: endpoints.getWishlist,
          method: "GET",
        }),
        providesTags: ["Wishlist"],
        transformResponse: (response: { wishlist: any[] }) => {
          // Transform backend response to match frontend WishlistItem type
          if (!response.wishlist || !Array.isArray(response.wishlist)) {
            return [];
          }

          return response.wishlist.map((item: any) => ({
            id: item.productId,
            title: item.name,
            image:
              item.images && item.images.length > 0 ? item.images[0].url : "",
            price: item.currentPrice || item.originalPrice || 0,
          }));
        },
      }),

      addToWishlist: builder.mutation<void, { productId: string }>({
        query: (item) => ({
          url: endpoints.addWishlistItem,
          method: "POST",
          body: item,
        }),
        invalidatesTags: ["Wishlist"],
      }),

      removeFromWishlist: builder.mutation<void, string>({
        query: (productId) => ({
          url: endpoints.removeWishlistItem(productId),
          method: "DELETE",
        }),
        invalidatesTags: ["Wishlist"],
      }),
    }),
  });

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
