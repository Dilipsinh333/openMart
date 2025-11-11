import { useParams, useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingCart, Check, ArrowLeft } from "lucide-react";
import { useGetProductQuery } from "@/features/product/productApi";
import Loader from "@/components/Loader";
import {
  useAddToCartMutation,
  useGetCartItemsQuery,
} from "@/features/cart/cartApi";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_CART_PRODUCTS } from "@/features/cartSlice";
import { getImageUrl, handleImageError } from "@/utils/imageUtils";
import { useWishlist } from "@/hooks/useWishlist";
import type { RootState } from "@/store";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams(); // fetch ID from route (e.g., /product/:id)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addToCart] = useAddToCartMutation();
  const { refetch } = useGetCartItemsQuery();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const { data: product, isLoading } = useGetProductQuery(id!);

  // Check if product is in cart
  const cartItems = useSelector((state: RootState) => state.cart.products);
  const isInCart = cartItems.some((item: any) => item.productId === id);

  // Check if product is available for purchase
  const isProductAvailable = product?.status === "Completed";

  const imageUrl = getImageUrl(product?.images?.[0]?.url);

  // Calculate discount if applicable
  const discount =
    product?.originalPrice && product?.originalPrice > product?.currentPrice
      ? Math.round(
          ((product.originalPrice - product.currentPrice) /
            product.originalPrice) *
            100
        )
      : 0;

  const addItemToCart = async (productId: string) => {
    try {
      await addToCart({ productId }).unwrap();
      const { data: cartItems } = await refetch(); // re-fetch updated cart
      if (cartItems) {
        dispatch(FETCH_CART_PRODUCTS(cartItems));
      }
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleWishlistToggle = async () => {
    if (id) {
      try {
        await toggleWishlist(id);
        toast.success(
          isInWishlist(id) ? "Removed from wishlist" : "Added to wishlist"
        );
      } catch (error) {
        toast.error("Failed to update wishlist");
      }
    }
  };

  return (
    <div
      className={`relative ${isLoading ? "max-h-screen overflow-hidden" : ""}`}
    >
      {isLoading && <Loader />}

      <div className="max-w-6xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {!product && !isLoading ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative flex justify-center items-center bg-white rounded-lg shadow-md p-4">
              <img
                src={imageUrl}
                alt={product?.name}
                className="max-w-[400px] max-h-[400px] w-full h-auto object-contain rounded-lg"
                onError={handleImageError}
              />
              {/* Wishlist button */}
              <button
                onClick={handleWishlistToggle}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 group"
              >
                {id && isInWishlist(id) ? (
                  <Heart className="w-6 h-6 text-red-500 fill-current" />
                ) : (
                  <Heart className="w-6 h-6 text-gray-600 group-hover:text-red-500" />
                )}
              </button>
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-bold mb-3">{product?.name}</h1>

              {/* Status Badge */}
              {product?.status && (
                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      product.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : product.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status === "Completed"
                      ? "Available"
                      : product.status === "Pending"
                      ? "Pending Approval"
                      : "Not Available"}
                  </span>
                </div>
              )}

              {/* Price Section */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl text-emerald-600 font-bold">
                  ₹{product?.currentPrice}
                </span>
                {product?.originalPrice &&
                  product?.originalPrice > product?.currentPrice && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-medium">
                        {discount}% OFF
                      </span>
                    </>
                  )}
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4 // Default 4 star rating since reviews don't exist
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">(4.0 stars)</span>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product?.description}
              </p>

              {/* Product Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">
                  Product Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">
                      Condition:
                    </span>
                    <span className="ml-2">{product?.condition}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Age Group:
                    </span>
                    <span className="ml-2">{product?.ageGroup}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Category:</span>
                    <span className="ml-2">{product?.category}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Status:</span>
                    <span className="ml-2 capitalize">{product?.status}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                {!isProductAvailable ? (
                  <button
                    disabled
                    className="flex items-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Not Available
                  </button>
                ) : isInCart ? (
                  <button
                    disabled
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed"
                  >
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    onClick={() => addItemToCart(product?.productId!)}
                    disabled={!product?.productId}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                )}

                <button
                  onClick={handleWishlistToggle}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                    id && isInWishlist(id)
                      ? "border-red-500 text-red-500 bg-red-50"
                      : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
                  }`}
                >
                  {id && isInWishlist(id) ? (
                    <>
                      <Heart className="w-5 h-5 fill-current" />
                      In Wishlist
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" />
                      Add to Wishlist
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
