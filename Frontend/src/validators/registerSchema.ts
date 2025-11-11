import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    userType: z.enum(["Customer", "Seller"], {
      errorMap: () => ({
        message:
          "Allowed User type are customer, seller, deliveryBoy and admin",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default registerSchema;
