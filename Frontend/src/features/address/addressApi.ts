import { baseApi } from "@/services/baseApi";
import { endpoints } from "@/services/endPoints";

export interface Address {
  addressId: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
}

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<Address[], void>({
      query: () => ({
        url: endpoints.address,
        method: "GET",
      }),
      transformResponse: (response: any) => response.addresses || [],
      providesTags: ["Address"],
    }),

    addAddress: builder.mutation<any, any>({
      query: (address) => ({
        url: endpoints.address,
        method: "POST",
        body: address,
      }),
      invalidatesTags: ["Address"],
    }),

    updateAddress: builder.mutation<any, { addressId: string; data: any }>({
      query: ({ addressId, data }) => ({
        url: endpoints.updateAddress + addressId,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),

    deleteAddress: builder.mutation<any, string>({
      query: (addressId) => ({
        url: endpoints.updateAddress + addressId, // Using same base endpoint for delete
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),

    getAllAddresses: builder.query<Address[], void>({
      query: () => ({
        url: endpoints.getAllAddresses,
        method: "GET",
      }),
      providesTags: ["Address"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetAllAddressesQuery,
} = addressApi;
