import { z } from "zod";

export const sellItemSchema = z.object({
  // itemType: z.string().min(1, "Item type is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  originalPrice: z
    .number({
      required_error: "Estimated price is required",
      invalid_type_error: "Estimated price must be a number",
    })
    .positive("Price must be positive"),
  currentPrice: z
    .number({
      required_error: "Current price is required",
      invalid_type_error: "Current price must be a number",
    })
    .positive("Price must be positive"),
  category: z.enum(["cloths", "toys"], {
    errorMap: () => ({ message: "Category is required" }),
  }),
  ageGroup: z.string().min(1, "Age group is required"),
  condition: z.string().min(1, "Condition is required"),
  dimensions: z.string().optional(), // will refine below
  itemUrl: z.string().optional(),
  pickupAddress: z.string().min(1, "Pickup address is required"),
  images: z.any().optional(), // Make it optional so we can handle validation manually
});

export default sellItemSchema;
