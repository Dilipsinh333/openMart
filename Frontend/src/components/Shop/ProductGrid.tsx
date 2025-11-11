import React from "react";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddToCartMutation,
  useGetCartItemsQuery,
} from "@/features/cart/cartApi";
import { FETCH_CART_PRODUCTS } from "@/features/cartSlice";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "react-toastify";
import type { RootState } from "@/store";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const dispatch = useDispatch();
  const [addToCart] = useAddToCartMutation();
  const { refetch } = useGetCartItemsQuery();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const cartItems = useSelector((state: RootState) => state.cart.products);
  const isInCart = cartItems.some(
    (item: any) => item.productId === product.productId
  );

  const discountPercentage =
    product.originalPrice > product.currentPrice
      ? Math.round(
          ((product.originalPrice - product.currentPrice) /
            product.originalPrice) *
            100
        )
      : 0;

  const primaryImage = product.images?.[0]?.url || "/api/placeholder/300/200";

  // Add to Cart handler
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isInCart) return;
    try {
      await addToCart({ productId: product.productId }).unwrap();
      const { data: updatedCart } = await refetch();
      if (updatedCart) {
        dispatch(FETCH_CART_PRODUCTS(updatedCart));
      }
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  // Wishlist handler
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await toggleWishlist(product.productId);
      toast.success(
        isInWishlist(product.productId)
          ? "Removed from wishlist"
          : "Added to wishlist"
      );
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = "/api/placeholder/300/200";
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </span>
          )}
          {product.condition && (
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {product.condition}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            onClick={handleWishlistToggle}
            aria-label={
              isInWishlist(product.productId)
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >
            <Heart
              className={`w-4 h-4 ${
                isInWishlist(product.productId)
                  ? "text-red-500 fill-current"
                  : "text-gray-600 group-hover:text-red-500"
              }`}
            />
          </button>
          <button
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            onClick={handleAddToCart}
            aria-label={isInCart ? "Added to cart" : "Add to cart"}
            disabled={isInCart}
          >
            <ShoppingCart
              className={`w-4 h-4 ${
                isInCart
                  ? "text-green-500"
                  : "text-gray-600 group-hover:text-blue-500"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Age Group */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
          {product.ageGroup && (
            <span className="text-xs text-gray-500">{product.ageGroup}</span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link to={`/product/${product.productId}`}>{product.name}</Link>
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.currentPrice.toLocaleString()}
          </span>
          {discountPercentage > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating & Reviews and View Details */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 text-yellow-400 fill-current"
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">(4.5) • 12 reviews</span>
          <Link
            to={`/product/${product.productId}`}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors ml-auto"
          >
            <Eye className="w-3 h-3" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-300 rounded-xl h-48 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m14 0v-8a2 2 0 00-2-2H6a2 2 0 00-2 2v8m0 0v5a2 2 0 002 2h8"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500 mb-4">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
