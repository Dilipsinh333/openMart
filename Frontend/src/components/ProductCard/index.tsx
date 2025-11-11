import { useNavigate } from "react-router-dom";
import { Heart, HeartOff, Trash2 } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { getImageUrl, handleImageError } from "@/utils/imageUtils";

interface ProductCardProps {
  id: string;
  title: string;
  description?: string;
  image: string;
  currentPrice: number;
  originalPrice?: number;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  className?: string;
}

const ProductCard = ({
  id,
  title,
  description,
  image,
  currentPrice,
  originalPrice,
  showRemoveButton = false,
  onRemove,
  className = "",
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const imageUrl = getImageUrl(image);

  const calculateDiscount = (original: number, current: number): number => {
    return Math.round(((original - current) / original) * 100);
  };

  const discount =
    originalPrice && originalPrice > currentPrice
      ? calculateDiscount(originalPrice, currentPrice)
      : 0;

  return (
    <div
      className={`relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white ${className}`}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={() => navigate(`/product/${id}`)}
        onError={handleImageError}
      />

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg">{title}</h3>

        {description && (
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        )}

        <div className="flex items-center gap-2">
          <span className="text-emerald-600 font-bold text-lg">
            ₹{currentPrice}
          </span>
          {originalPrice && originalPrice > currentPrice && (
            <>
              <span className="line-through text-gray-500 text-sm">
                ₹{originalPrice}
              </span>
              <span className="text-sm text-red-500">{discount}% off</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => navigate(`/product/${id}`)}
            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
          >
            View Details
          </button>

          <div className="flex items-center gap-2">
            {showRemoveButton && onRemove && (
              <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 text-sm flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Remove
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(id);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              {isInWishlist(id) ? (
                <HeartOff size={20} className="text-red-500" />
              ) : (
                <Heart size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
