import { baseApi } from "@/services/baseApi";
import { endpoints } from "@/services/endPoints";
import type { registerRequest, RegisterResponse } from "@/types/register";

export const registerApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Register"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      registerUser: builder.mutation<RegisterResponse, registerRequest>({
        query: (data) => ({
          url: endpoints.register,
          method: "POST",
          body: data,
        }),
      }),
    }),
    overrideExisting: false,
  });

export const { useRegisterUserMutation } = registerApi;
