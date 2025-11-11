import type { Product } from "./product";

export type Order = {
  orderId: string;
  userId: string;
  products: string[];
  amount: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  shippingAddress: string;
  paymentStatus: "Pending" | "Completed";
  paymentId: string;
  productName: string[];
  expectedDeliveryDate: Date;
  orderPlacedDate: Date;
  username?: string;
  deliveryBoy?: string;
  productsDetail?: Product[];
};
