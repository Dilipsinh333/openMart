import { baseApi } from "@/services/baseApi";
import { endpoints } from "@/services/endPoints";
import type { Cart } from "@/types/cart";

type removeCartRequest = {
  productId: string;
};

export const cartApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Cart"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      addToCart: builder.mutation<any, { productId: string }>({
        query: (data) => ({
          url: endpoints.cart,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Cart"],
      }),
      getCartItems: builder.query<Cart[], void>({
        query: () => ({
          url: endpoints.cart,
          method: "GET",
        }),
        providesTags: ["Cart"],
      }),
      removeFromCart: builder.mutation<any, removeCartRequest>({
        query: (data) => ({
          url: endpoints.cart,
          method: "DELETE",
          body: data,
        }),
        invalidatesTags: ["Cart"],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useAddToCartMutation,
  useGetCartItemsQuery,
  useRemoveFromCartMutation,
} = cartApi;
