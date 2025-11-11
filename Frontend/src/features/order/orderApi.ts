import { baseApi } from "@/services/baseApi";
import { endpoints } from "@/services/endPoints";
import type { Order } from "@/types/order";

export const orderApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Orders"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      placeOrder: builder.mutation<any, any>({
        query: (data) => ({
          url: endpoints.placeOrder,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Orders"],
      }),
      getOrders: builder.query<Order[], void>({
        query: () => ({
          url: endpoints.getOrders,
          method: "GET",
        }),
        providesTags: ["Orders"],
      }),
      getAllOrdersAdmin: builder.query<
        any,
        {
          page?: number;
          limit?: number;
          search?: string;
          status?: string;
          startDate?: string;
          endDate?: string;
          sortBy?: string;
        }
      >({
        query: (params = {}) => ({
          url: endpoints.getOrdersAdmin,
          method: "GET",
          params,
        }),
        providesTags: ["Orders"],
      }),
      updateOrderStatus: builder.mutation<
        any,
        {
          orderId: string;
          status: "Shipped" | "Delivered" | "Failed" | "Cancelled";
        }
      >({
        query: ({ orderId, ...body }) => ({
          url: `${endpoints.updateOrderStatus}${orderId}`,
          method: "PATCH",
          body,
        }),
        invalidatesTags: ["Orders"],
      }),
      getOrder: builder.query<Order, string>({
        query: (orderId) => ({
          url: endpoints.getOrders + orderId,
          method: "GET",
        }),
      }),
      getAdminOrderDetail: builder.query<Order, string>({
        query: (orderId) => ({
          url: `${endpoints.getOrdersAdmin}/${orderId}`,
          method: "GET",
        }),
      }),
    }),
    overrideExisting: false,
  });

export const {
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useGetAllOrdersAdminQuery,
  useUpdateOrderStatusMutation,
  useGetAdminOrderDetailQuery,
} = orderApi;
