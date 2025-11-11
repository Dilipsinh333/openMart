import { endpoints } from "../../services/endPoints";
import { baseApi } from "@/services/baseApi";

export interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  userId: string;
  name: string;
  email: string;
  userType: string;
}

interface LoginResponse {
  status: string;
  user: User;
}

interface MeResponse {
  status: string;
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

// Add these interfaces
interface DeliveryBoy {
  userId: string;
  name: string;
  email: string;
  userType: string;
}

interface GetUsersResponse {
  status: string;
  data: DeliveryBoy[];
}

export const authApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Auth"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      login: builder.mutation<LoginResponse, LoginRequest>({
        query: (credentials) => ({
          url: endpoints.login,
          method: "POST",
          body: credentials,
        }),
      }),
      logout: builder.mutation<void, void>({
        query: () => ({
          url: endpoints.logout,
          method: "POST",
        }),
      }),
      getMe: builder.query<MeResponse, void>({
        query: () => ({
          url: endpoints.getMe,
          method: "GET",
          credentials: "include", // send cookies
        }),
      }),
      getAllUsers: builder.query<
        GetUsersResponse,
        {
          userType: string;
        }
      >({
        query: (params) => ({
          url: endpoints.getUsers,
          method: "GET",
          credentials: "include",
          params,
        }),
      }),
    }),
  });

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetAllUsersQuery,
} = authApi;
