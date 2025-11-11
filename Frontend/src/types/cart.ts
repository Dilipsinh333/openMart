export type Cart = {
  productId: string;
  userId: string;
  currentPrice: number;
  images: { url: string }[];
  name: string;
  description: string;
};
