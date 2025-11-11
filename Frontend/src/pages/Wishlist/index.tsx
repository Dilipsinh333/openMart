import Loader from "@/components/Loader";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";
import type { WishlistItem } from "@/types/wishlist";

const Wishlist = () => {
  const { wishlist, toggleWishlist, loading } = useWishlist();

  const handleRemoveFromWishlist = (productId: string) => {
    toggleWishlist(productId);
  };

  return (
    <div
      className={`relative ${loading ? "max-h-screen overflow-hidden" : ""}`}
    >
      {loading && <Loader />}

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-emerald-700">
          Your Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            {wishlist.map((item: WishlistItem) => (
              <ProductCard
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.image}
                currentPrice={item.price}
                showRemoveButton={true}
                onRemove={() => handleRemoveFromWishlist(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
