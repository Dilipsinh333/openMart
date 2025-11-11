import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/features/wishlist/wishlistApi";

export const useWishlist = () => {
  const { items: wishlist, loading } = useSelector(
    (state: RootState) => state.wishlist
  );

  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();

  // Check if product is in wishlist
  const isInWishlist = (productId: string) =>
    wishlist.some((item) => item.id === productId);

  // Toggle wishlist item
  const toggleWishlist = async (productId: string) => {
    try {
      if (isInWishlist(productId)) {
        await removeFromWishlistMutation(productId).unwrap();
      } else {
        await addToWishlistMutation({ productId }).unwrap();
      }
      // The API will invalidate tags and refetch wishlist automatically
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  return {
    wishlist,
    isInWishlist,
    toggleWishlist,
    loading,
  };
};
