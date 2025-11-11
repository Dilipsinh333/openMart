import { z } from "zod";

// 1️⃣ Zod Schema
export default z.object({
  fullName: z.string({ required_error: "Full name is required" }),
  phoneNumber: z
    .string()
    .regex(/^[1-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
    .min(10, "Phone number must be 10 digits"),
  addressLine1: z.string({ required_error: "Address Line 1 is required" }),
  addressLine2: z.string().optional(),
  city: z.string({ required_error: "City is required" }),
  state: z.string({ required_error: "State is required" }),
  pinCode: z.string({ required_error: "Postal Code is required" }),
});
